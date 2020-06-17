use std::time::{SystemTime, UNIX_EPOCH};

use argon2::{self, Config};
use jsonwebtoken::{decode, DecodingKey, encode, EncodingKey, Header, Validation};
use jsonwebtoken::errors::Error;
use rocket::http::Status;
use rocket::outcome::Outcome::{Failure, Success};
use rocket::request::{FromRequest, Outcome};
use rocket::Request;
use serde::{Deserialize, Serialize};

use crate::models::{ModelId, User};

#[derive(Debug, Serialize, Deserialize)]
pub struct LoginInfo {
    pub username: String,
    pub password: String,
}

pub struct PasswordEncoder;

impl PasswordEncoder {
    pub fn check_password(password: &str, user: &User) -> bool {
        argon2::verify_encoded(&user.encrypted_password, password.as_ref()).unwrap()
    }

    pub fn encode(password: &str) -> String {
        let config = Config::default();
        let salt = b"Zt3GRh@X]kJMrmRu";

        argon2::hash_encoded(password.as_ref(), salt, &config).unwrap()
    }
}

////--------------JWT----------------------------////////

fn get_current_timestamp() -> u64 {
    let start = SystemTime::now();
    start.duration_since(UNIX_EPOCH).expect("Time went backwards").as_secs()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct JwtToken {
    token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    sub: String,
    company: String,
    exp: usize,
    pub user_id: i32,
    last_name: String,
    first_name: String,
    email: String,
}

impl JwtToken {
    pub fn new(user: &User) -> Self {
        let claims = Claims {
            sub: "Subject".to_string(),
            company: "Company".to_string(),
            exp: (get_current_timestamp() + 3600) as usize,
            user_id: user.id.get(),
            last_name: user.last_name.clone(),
            first_name: user.first_name.clone(),
            email: user.email.clone(),
        };

        let secret = b"Zt3GRh@X]kJMrmRu";

        Self {
            token: encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_ref())).unwrap(),
        }
    }

    pub fn decode(token: &str) -> Result<Claims, Error> {
        let secret = b"Zt3GRh@X]kJMrmRu";

        // `token` is a struct with 2 fields: `header` and `claims` where `claims` is your own struct.
        let token = decode::<Claims>(
            &token,
            &DecodingKey::from_secret(secret),
            &Validation::default(),
        )?;

        Ok(token.claims)
    }
}

pub struct JwtGuard(pub Claims);

#[derive(Debug)]
pub enum JwtGuardError {
    Missing,
    Invalid,
}

impl<'a, 'r> FromRequest<'a, 'r> for JwtGuard {
    type Error = JwtGuardError;

    fn from_request(request: &'a Request<'r>) -> Outcome<Self, Self::Error> {
        let authorization = match request.headers().get_one("Authorization") {
            Some(header) => header,
            None => return Failure((Status::Forbidden, JwtGuardError::Missing))
        };

        match JwtToken::decode(&authorization) {
            Ok(claims) => Success(JwtGuard(claims)),
            Err(_) => Failure((Status::Forbidden, JwtGuardError::Invalid)),
        }
    }
}
