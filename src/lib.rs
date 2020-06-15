#[macro_use]
extern crate diesel;
extern crate dotenv;

use diesel::Table;

pub mod models;
pub mod schema;
pub mod db;
pub mod repository;
pub mod serialization;
pub mod security;


fn test() -> Box<dyn Table> {

}