use std::io::Cursor;

use rocket::{Request, Response};
use rocket::http::ContentType;
use rocket::http::Status;
use rocket::response;
use rocket::response::content;
use rocket::response::Responder;
use serde::{Deserialize, Serialize, Serializer};

use crate::models::{ ModelId, Post, PostId, User, UserId};
use crate::security::PasswordEncoder;
use diesel::result::Error;

#[derive(Debug, Serialize)]
pub struct ErrorMessage {
    code: u32,
    message: String,
}

impl ErrorMessage {
    pub fn new(c: u32, m: &str) -> Self {
        Self { code: c, message: m.to_string() }
    }

    pub fn not_found() -> Self {
        Self { code: 404, message: String::from("Resource not found") }
    }

    pub fn internal() -> Self {
        Self { code: 500, message: String::from("Whoops! Looks like we messed up.") }
    }
}

impl From<Error> for ErrorMessage {
    fn from(e: Error) -> Self {
        log::error!("{}", e);

        Self::internal()
    }
}

#[derive(Debug, Serialize)]
pub struct SentPost {
    pub id: i32,
    pub user: String,
    pub title: String,
    pub body: String,
    pub active: bool,
}

#[derive(Debug, Deserialize)]
pub struct ReceivedPost {
    pub title: String,
    pub body: String,
    pub active: bool,
}


#[derive(Debug, Serialize)]
pub struct SentUser {
    pub id: i32,
    pub username: String,
    pub last_name: String,
    pub first_name: String,
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct ReceivedUser {
    pub username: String,
    pub password: String,
    pub last_name: String,
    pub first_name: String,
    pub email: String,
}

impl From<&Post> for SentPost {
    fn from(other: &Post) -> Self {
        Self {
            id: other.id.get(),
            user: format!("http://localhost:8000/user/{}", other.user_id.get()),
            title: other.title.clone(),
            body: other.body.clone(),
            active: other.active,
        }
    }
}

impl From<&User> for SentUser {
    fn from(other: &User) -> Self {
        Self {
            id: other.id.get(),
            username: other.username.clone(),
            last_name: other.last_name.clone(),
            first_name: other.first_name.clone(),
            email: other.email.clone()
        }
    }
}

impl From<&ReceivedPost> for Post {
    fn from(other: &ReceivedPost) -> Self {
        Post {
            id: PostId::new(0),
            user_id: UserId::new(0),
            title: other.title.clone(),
            body: other.body.clone(),
            active: other.active,
            deleted: false
        }
    }
}

impl From<&ReceivedUser> for User {
    fn from(other: &ReceivedUser) -> Self {
        User {
            id: UserId::new(0),
            username: other.username.clone(),
            encrypted_password: PasswordEncoder::encode(&other.password),
            last_name: other.last_name.clone(),
            first_name: other.first_name.clone(),
            email: other.email.clone(),
            deleted: false
        }
    }
}

impl Serialize for Post {
    fn serialize<S>(&self, serializer: S) -> Result<<S as Serializer>::Ok, <S as Serializer>::Error> where
        S: Serializer {
        SentPost::from(self).serialize(serializer)
    }
}

impl Serialize for User {
    fn serialize<S>(&self, serializer: S) -> Result<<S as Serializer>::Ok, <S as Serializer>::Error> where
        S: Serializer {
        SentUser::from(self).serialize(serializer)
    }
}

impl<'r> Responder<'r> for Post {
    fn respond_to(self, req: &Request) -> response::Result<'r> {
        serde_json::to_string(&self).map(|string| {
            content::Json(string).respond_to(req).unwrap()
        }).map_err(|_e| {
            //error_!("JSON failed to serialize: {:?}", e);
            Status::InternalServerError
        })
    }
}

impl<'r> Responder<'r> for User {
    fn respond_to(self, req: &Request) -> response::Result<'r> {
        serde_json::to_string(&self).map(|string| {
            content::Json(string).respond_to(req).unwrap()
        }).map_err(|_e| {
            //error_!("JSON failed to serialize: {:?}", e);
            Status::InternalServerError
        })
    }
}


impl<'r> Responder<'r> for ErrorMessage {
    fn respond_to(self, _: &Request) -> response::Result<'r> {
        let status = match self.code {
            404 => Status::NotFound,
            _ => Status::InternalServerError
        };

        Response::build()
            .header(ContentType::JSON)
            .sized_body(Cursor::new(serde_json::to_string(&self).unwrap()))
            .status(status)
            .ok()
    }
}