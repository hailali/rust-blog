use diesel::prelude::*;
use diesel::result::Error;
use diesel::SqliteConnection;

use crate::models::*;
use crate::repository::RepositoryTrait;
use crate::schema::comment;

pub struct CommentRepository<'a> {
    pub con: &'a SqliteConnection
}

impl RepositoryTrait for CommentRepository<'_> {
    type Item = Comment;
    type Items = Comments;

    fn find(&self, _id: i32) -> Result<Option<Self::Item>, Error> {
        let mut comments: Vec<Comment> = comment::table.filter(comment::deleted.eq(false))
            .limit(1)
            .load::<Comment>(self.con)
            .expect("Error loading user");

        Ok(comments.pop())
    }

    fn find_all(&self) -> Result<Self::Items, Error> {
        let comments: Vec<Comment> = comment::table.filter(comment::deleted.eq(false))
            .load::<Comment>(self.con)
            .expect("Error loading user");

        Ok(Comments(comments))
    }

    fn persist(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::insert_into(comment::table)
            .values(NewComment::from(item))
            .execute(self.con)?;

        Ok(())
    }

    fn update(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::update(comment::table.find(item.id.get()))
            .set(&CommentForm {
                body: Some(&item.body),
            })
            .execute(self.con)?;

        Ok(())
    }

    fn delete(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::delete(comment::table.find(item.id()))
            .execute(self.con)?;

        Ok(())
    }
}
