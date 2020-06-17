use std::env;

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;

use crate::repository::comment::CommentRepository;
use crate::repository::post::PostRepository;
use crate::repository::user::UserRepository;

pub struct Db {
    con: SqliteConnection
}

impl Default for Db {
    fn default() -> Self {
        Self::new()
    }
}

impl Db {
    pub fn new() -> Self {
        let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");

        Db {
            con: SqliteConnection::establish(&database_url).expect(&format!("Error connecting to {}", database_url))
        }
    }

    pub fn get_post_repo(&self) -> PostRepository {
        PostRepository {
            con: &self.con
        }
    }

    pub fn get_comment_repo(&self) -> CommentRepository {
        CommentRepository {
            con: &self.con
        }
    }

    pub fn get_user_repo(&self) -> UserRepository {
        UserRepository {
            con: &self.con
        }
    }
}