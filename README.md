# rust-blog

Simple blog application developed with the RUST programming language

# Install

1. `sudo apt install libsqlite3-dev` : install the sqlite library
2. `cargo build` : builds the project and check that there is no errors
3. `cargo run` : runs the project and launch the build-in web server
4. `cargo install diesel_cli` :
installs the CLI tools for handling the Diesel migrations.
Please check this page for more details on installation process and issues : 
http://diesel.rs/guides/getting-started/
5. `diesel setup` : create the database if it didn't already exist
6. `diesel migration run` : execute all the migrations

# Model

1. Users
2. Posts
3. Tags

# Structure

Provides several APIs for creating a blog application. Available APIs are :
1. GET /users|posts|tags
2. POST /users|posts|tags
3. DELETE /users|posts|tags

# Authentication

The method used to authenticate users is JWT (Json Web Tokens).

# Used crates

## diesel

ORM for connecting and fetching data from the database.


