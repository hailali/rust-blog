

use diesel::result::Error;


use crate::models::Identifier;


pub trait RepositoryTrait {
    type Item: Identifier;
    type Items;

    fn find(&self, id: i32) -> Result<Option<Self::Item>, Error>;
    fn find_all(&self) -> Result<Self::Items, Error>;
    fn persist(&self, item: &Self::Item) -> Result<(), Error>;
    fn update(&self, item: &Self::Item) -> Result<(), Error>;
    fn delete(&self, item: &Self::Item) -> Result<(), Error>;
}

pub mod post;
pub mod comment;
pub mod user;