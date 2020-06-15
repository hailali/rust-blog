CREATE TABLE user(
    id INTEGER NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    encrypted_password TEXT NOT NULL,
    last_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    email TEXT NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT 0 CHECK (deleted IN (0,1))
)