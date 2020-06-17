CREATE TABLE post(
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    active BOOLEAN NOT NULL CHECK (active IN (0,1)),
    deleted BOOLEAN NOT NULL DEFAULT 0 CHECK (deleted IN (0,1)),
    FOREIGN KEY(user_id) REFERENCES user(id)
)