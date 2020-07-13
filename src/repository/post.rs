use diesel::prelude::*;
use diesel::result::Error;
use diesel::SqliteConnection;

use crate::models::*;
use crate::repository::RepositoryTrait;
use crate::schema::post;

pub struct PostRepository<'a> {
    pub con: &'a SqliteConnection
}

impl RepositoryTrait for PostRepository<'_> {
    type Item = Post;
    type Items = Posts;

    fn find(&self, id: i32) -> Result<Option<Self::Item>, Error> {
        let mut posts: Vec<Post> = post::table.filter(post::id.eq(id))
            .limit(1)
            .load::<Post>(self.con)
            .expect("Error loading post");

        Ok(posts.pop())
    }

    fn find_all(&self) -> Result<Self::Items, Error> {
        let posts: Vec<Post> = post::table.filter(post::deleted.eq(false))
            .load::<Post>(self.con)
            .expect("Error loading user");

        Ok(Posts(posts))
    }

    fn persist(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::insert_into(post::table)
            .values(NewPost::from(item))
            .execute(self.con)?;

        Ok(())
    }

    fn update(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::update(post::table.find(item.id.get()))
            .set(&PostForm {
                title: Some(&item.title),
                sub_title: Some(&item.sub_title),
                body: Some(&item.body),
            })
            .execute(self.con)?;

        Ok(())
    }

    fn delete(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::delete(post::table.find(item.id()))
            .execute(self.con)?;

        Ok(())
    }
}

