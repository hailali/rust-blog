#![feature(proc_macro_hygiene, decl_macro)]
#![feature(in_band_lifetimes)]
#![recursion_limit = "256"]

extern crate argon2;
extern crate log;
#[macro_use]
extern crate rocket;

use diesel::result::Error;
use rocket::http::Method;
use rocket::http::Status;
use rocket_contrib::json::Json;
use rocket_cors;
use rocket_cors::{AllowedHeaders, AllowedOrigins};

use hello_rocket::db::Db;
use hello_rocket::models::{ModelId, Post, Posts, Tag, Tags, User, UserId, Users};
use hello_rocket::repository::RepositoryTrait;
use hello_rocket::security::{JwtGuard, JwtToken, LoginInfo, PasswordEncoder};
use hello_rocket::serialization::{ErrorMessage, ReceivedPost, ReceivedTag, ReceivedUser, SentTag};

#[get("/")]
fn index() -> &'static str {
    "Hello, to my blog written with Rust. Oh yes!!! :)"
}

#[post("/login", format = "json", data = "<login_info>")]
fn login(login_info: Json<LoginInfo>) -> Result<Json<JwtToken>, Status> {
    let login_info = &login_info.into_inner();
    let user = Db::new().get_user_repo().find_by_username(&login_info).unwrap();

    let user = match user {
        Some(user) => user,
        None => return Err(Status::Forbidden)
    };

    if PasswordEncoder::check_password(&login_info.password, &user) {
        return Ok(Json(JwtToken::new(&user)));
    }

    Err(Status::Forbidden)
}

#[get("/")]
fn posts() -> Json<Posts> {
    let posts = Db::new().get_post_repo().find_all().unwrap();

    Json(posts)
}

#[get("/<id>")]
fn post(id: i32) -> Result<Option<Post>, Error> {
    Db::new().get_post_repo().find(id)
}

#[post("/", format = "json", data = "<received_post>")]
fn add_post(received_post: Json<ReceivedPost>, jwt_guard: JwtGuard) -> Status {
    let JwtGuard(claims) = jwt_guard;

    // Set automatically the user_id id to used logged user
    let mut post = Post::from(&received_post.into_inner());
    post.user_id = UserId::new(claims.user_id);

    Db::new().get_post_repo().persist(&post).unwrap();

    Status::Created
}

#[delete("/<id>")]
fn delete_post(id: i32) -> Result<(), ErrorMessage> {

    // find post to delete
    let post = Db::new().get_post_repo().find(id)?;
    let post = match post {
        Some(post) => post,
        None => return Err(ErrorMessage::not_found()),
    };

    Db::new().get_post_repo().delete(&post)?;

    Ok(())
}

#[post("/", format = "json", data = "<received_user>")]
fn add_user(received_user: Json<ReceivedUser>) -> Status {
    let received_user = received_user.into_inner();

    let user = User::from(&received_user);

    Db::new().get_user_repo().persist(&user).unwrap();

    Status::Created
}

#[get("/")]
fn get_users(_guard: JwtGuard) -> Result<Json<Users>, ErrorMessage> {
    let users = Db::new().get_user_repo().find_all()?;

    Ok(Json(users))
}

#[get("/me")]
fn get_me(jwt_guard: JwtGuard) -> Result<Option<User>, ErrorMessage> {
    let JwtGuard(claims) = jwt_guard;

    let user = Db::new().get_user_repo().find(claims.user_id)?;

    Ok(user)
}

#[get("/<id>")]
fn get_user(_jwt_guard: JwtGuard, id: i32) -> Result<Option<User>, ErrorMessage> {
    let user = Db::new().get_user_repo().find(id)?;

    Ok(user)
}

#[put("/<id>", format = "json", data = "<received_user>")]
fn update_user(id: i32, received_user: Json<ReceivedUser>, _jwt_guard: JwtGuard) -> Result<Status, ErrorMessage> {
    let user = Db::new().get_user_repo().find(id)?;

    if user.is_none() {
        return Err(ErrorMessage::not_found());
    }

    let mut user = user.unwrap();
    user.update_from(received_user.into_inner());

    Db::new().get_user_repo().update(&user)?;

    Ok(Status::Ok)
}

#[put("/me", format = "json", data = "<received_user>")]
fn update_user_me(received_user: Json<ReceivedUser>, jwt_guard: JwtGuard) -> Result<Status, ErrorMessage> {
    let JwtGuard(claims) = jwt_guard;

    let user = Db::new().get_user_repo().find(claims.user_id)?;
    if user.is_none() {
        return Err(ErrorMessage::not_found());
    }

    let mut user = user.unwrap();
    user.update_from(received_user.into_inner());

    Db::new().get_user_repo().update(&user)?;

    Ok(Status::Ok)
}

#[delete("/<id>")]
fn delete_user(id: i32, _jwt_guard: JwtGuard) -> Result<Status, ErrorMessage> {
    let user = Db::new().get_user_repo().find(id)?;

    if user.is_none() {
        return Err(ErrorMessage::not_found());
    }

    Db::new().get_user_repo().delete(&user.unwrap())?;

    Ok(Status::Ok)
}

#[get("/")]
fn get_tags(_guard: JwtGuard) -> Json<Vec<SentTag>> {
    let tags: Tags = Db::new().get_tag_repo().find_all().unwrap();

    let sent_tags = tags.0.iter().map(|tag| {
        SentTag::from(tag)
    }).collect();

    Json(sent_tags)
}

#[post("/", format = "json", data = "<received_tag>")]
fn add_tag(_jwt_guard: JwtGuard, received_tag: Json<ReceivedTag>) -> Result<Status, ErrorMessage> {
    Db::new().get_tag_repo().persist(&Tag::from(received_tag.into_inner()))?;

    Ok(Status::Created)
}

#[catch(500)]
fn internal_error() -> ErrorMessage {
    ErrorMessage::new(500, "Internal server error from catcher")
}

#[catch(404)]
fn not_found_error() -> ErrorMessage {
    ErrorMessage::new(404, "Not found from catcher")
}

fn main() {
    // You can also deserialize this
    let cors = rocket_cors::CorsOptions {
        allowed_origins: AllowedOrigins::All,
        allowed_methods: vec![Method::Get, Method::Post].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        ..Default::default()
    }.to_cors().unwrap();

    rocket::ignite()
        .mount("/", routes![index, login])
        .mount("/users", routes![add_user, get_users, get_user, get_me, delete_user, update_user_me,update_user  ])
        .mount("/posts", routes![post, posts, add_post, delete_post])
        .mount("/tags", routes![get_tags, add_tag])
        .register(catchers![internal_error, not_found_error])
        .attach(cors)
        .launch();
}
