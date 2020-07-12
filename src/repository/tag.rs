extern crate diesel;

use std::result::Result;

use diesel::prelude::*;
use diesel::result::Error;
use diesel::SqliteConnection;

use crate::models::*;
use crate::repository::RepositoryTrait;
use crate::schema::tag;

pub struct TagRepository<'a> {
    pub con: &'a SqliteConnection
}

impl RepositoryTrait for TagRepository<'_> {
    type Item = Tag;
    type Items = Tags;

    fn find(&self, _id: i32) -> Result<Option<Self::Item>, Error> {
        let mut tags: Vec<Tag> = tag::table
            .limit(1)
            .load::<Tag>(self.con)
            .expect("Error loading tag");

        Ok(tags.pop())
    }

    fn find_all(&self) -> Result<Self::Items, Error> {
        let tags: Vec<Tag> = tag::table
            .load::<Tag>(self.con)
            .expect("Error loading user");

        Ok(Tags(tags))
    }

    fn persist(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::insert_into(tag::table)
            .values(NewTag::from(item))
            .execute(self.con)?;

        Ok(())
    }

    fn update(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::update(tag::table.find(item.id.get()))
            .set(&TagForm {
                name: Some(&item.name)
            })
            .execute(self.con)?;

        Ok(())
    }

    fn delete(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::delete(tag::table.find(item.id()))
            .execute(self.con)?;

        Ok(())
    }
}
