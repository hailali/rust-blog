extern crate diesel;

use std::result::Result;

use diesel::prelude::*;
use diesel::result::Error;
use diesel::SqliteConnection;

use crate::models::*;
use crate::repository::RepositoryTrait;
use crate::schema::user;
use crate::security::LoginInfo;

pub struct UserRepository<'a> {
    pub con: &'a SqliteConnection
}

impl RepositoryTrait for UserRepository<'_> {
    type Item = User;
    type Items = Users;

    fn find(&self, _id: i32) -> Result<Option<Self::Item>, Error> {
        let mut users: Vec<User> = user::table.filter(user::deleted.eq(false))
            .limit(1)
            .load::<User>(self.con)
            .expect("Error loading user");

        Ok(users.pop())
    }

    fn find_all(&self) -> Result<Self::Items, Error> {
        let users: Vec<User> = user::table.filter(user::deleted.eq(false))
            .load::<User>(self.con)
            .expect("Error loading user");

        Ok(Users(users))
    }

    fn persist(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::insert_into(user::table)
            .values(NewUser::from(item))
            .execute(self.con)?;

        Ok(())
    }

    fn update(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::update(user::table.find(item.id.get()))
            .set(&UserForm {
                last_name: Some(&item.last_name),
                first_name: Some(&item.first_name),
                email: Some(&item.email)
            })
            .execute(self.con)?;

        Ok(())
    }

    fn delete(&self, item: &Self::Item) -> Result<(), Error> {
        diesel::delete(user::table.find(item.id()))
            .execute(self.con)?;

        Ok(())
    }
}

impl UserRepository<'_> {
    pub fn find_by_username(&self, login_info: &LoginInfo) -> Result<Option<User>, Error> {
        let mut users: Vec<User> = user::table.filter(user::username.eq(&login_info.username))
            .limit(1)
            .load::<User>(self.con)
            .expect("Error loading user by username");

        Ok(users.pop())
    }
}
