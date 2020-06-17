use diesel::{Queryable};
use serde::{Deserialize, Serialize};

use crate::schema::{user, comment, post};
use crate::security::PasswordEncoder;
use crate::serialization::ReceivedUser;


type DB = diesel::sqlite::Sqlite;

#[derive(Eq, PartialEq, Hash)]
pub enum ModelEnum {
    Comment,
    Post,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PostId {
    id: i32
}

#[derive(Debug, Serialize)]
pub struct CommentId {
    id: i32
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserId {
    id: i32
}

pub trait Identifier {
    type Id: ModelId;

    fn id(&self) -> i32;
}

impl Identifier for User {
    type Id = UserId;

    fn id(&self) -> i32 {
        self.id.get()
    }
}

impl Identifier for Comment {
    type Id = CommentId;

    fn id(&self) -> i32 {
        self.id.get()
    }
}

impl Identifier for Post {
    type Id = PostId;

    fn id(&self) -> i32 {
        self.id.get()
    }
}

pub trait ModelId {
    type ModelType;

    fn new(id: i32) -> Self::ModelType;
    fn get(&self) -> i32;
    fn to_string(&self) -> String;
}

impl ModelId for PostId {
    type ModelType = Self;

    fn new(id: i32) -> Self::ModelType { PostId { id } }
    fn get(&self) -> i32 { self.id }
    fn to_string(&self) -> String { format!("{}", self.id) }
}

impl ModelId for CommentId {
    type ModelType = Self;

    fn new(id: i32) -> Self::ModelType { CommentId { id } }
    fn get(&self) -> i32 { self.id }
    fn to_string(&self) -> String { format!("{}", self.id) }
}

impl ModelId for UserId {
    type ModelType = Self;

    fn new(id: i32) -> Self::ModelType { Self { id } }
    fn get(&self) -> i32 { self.id }
    fn to_string(&self) -> String { format!("{}", self.id) }
}

#[derive(Debug, Serialize)]
pub struct Comment {
    pub id: CommentId,
    pub body: String,
    pub post_id: PostId,
    pub deleted: bool,
}

#[derive(Insertable)]
#[table_name="comment"]
pub struct NewComment {
    pub body: String,
    pub post_id: i32,
}

impl From<&Comment> for NewComment {
    fn from(c: &Comment) -> Self {
        Self {
            body: c.body.clone(),
            post_id: c.post_id.get()
        }
    }
}

#[derive(AsChangeset)]
#[table_name="comment"]
pub struct CommentForm<'a> {
    pub body: Option<&'a String>,
}

impl Queryable<comment::SqlType, DB> for Comment {
    type Row = (i32, String, i32, bool);

    fn build(row: Self::Row) -> Self {
        Comment {
            id: CommentId::new(row.0),
            body: row.1,
            post_id: PostId::new(row.2),
            deleted: row.3,
        }
    }
}

pub struct Comments(pub Vec<Comment>);

#[derive(Debug, Deserialize)]
pub struct Post {
    pub id: PostId,
    pub user_id: UserId,
    pub title: String,
    pub body: String,
    pub active: bool,
    pub deleted: bool,
}

#[derive(Insertable)]
#[table_name="post"]
pub struct NewPost {
    pub user_id: i32,
    pub title: String,
    pub body: String,
}

impl From<&Post> for NewPost {
    fn from(post: &Post) -> Self {
        Self {
            user_id: post.user_id.get(),
            title: post.title.clone(),
            body: post.body.clone()
        }
    }
}

#[derive(AsChangeset)]
#[table_name="post"]
pub struct PostForm<'a> {
    pub title: Option<&'a String>,
    pub body: Option<&'a String>,
}

impl Queryable<post::SqlType, DB> for Post {
    type Row = (i32, i32, String, String, bool, bool);

    fn build(row: Self::Row) -> Self {
        Post {
            id: PostId::new(row.0),
            user_id: UserId::new(row.1),
            title: row.2,
            body: row.3,
            active: row.4,
            deleted: row.5,
        }
    }
}

impl Post {
    pub fn new(user_id: UserId, title: String, body: String) -> Self {
        Post {
            id: PostId::new(0),
            user_id,
            title,
            body,
            active: true,
            deleted: false,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct Posts(pub Vec<Post>);

#[derive(Debug)]
pub struct User {
    pub id: UserId,
    pub username: String,
    pub encrypted_password: String,
    pub last_name: String,
    pub first_name: String,
    pub email: String,
    pub deleted: bool,
}

#[derive(Insertable)]
#[table_name="user"]
pub struct NewUser {
    pub username: String,
    pub encrypted_password: String,
    pub last_name: String,
    pub first_name: String,
    pub email: String,
}

impl From<&User> for NewUser {
    fn from(user: &User) -> Self {
        Self {
            username: user.username.clone(),
            encrypted_password: user.encrypted_password.clone(),
            last_name: user.last_name.clone(),
            first_name: user.first_name.clone(),
            email: user.email.clone()
        }
    }
}

#[derive(AsChangeset)]
#[table_name="user"]
pub struct UserForm<'a> {
    pub last_name: Option<&'a String>,
    pub first_name: Option<&'a String>,
    pub email: Option<&'a String>,
}

impl Queryable<user::SqlType, DB> for User {
    type Row = (i32, String, String, String, String, String, bool);

    fn build(row: Self::Row) -> Self {
        User {
            id: UserId::new(row.0),
            username: row.1,
            encrypted_password: row.2,
            last_name: row.3,
            first_name: row.4,
            email: row.5,
            deleted: row.6,
        }
    }
}

impl User {
    pub fn new(id: UserId, username: String, encrypted_password: String, last_name: String, first_name: String, email: String) -> Self {
        Self { id, username, encrypted_password, last_name, first_name, email, deleted: false }
    }

    pub fn update_from(&mut self, user: ReceivedUser) {
        self.username = user.username;
        self.encrypted_password = PasswordEncoder::encode(&user.password);
        self.last_name = user.last_name;
        self.first_name = user.first_name;
        self.email = user.email;
    }
}

#[derive(Debug, Serialize)]
pub struct Users(pub Vec<User>);