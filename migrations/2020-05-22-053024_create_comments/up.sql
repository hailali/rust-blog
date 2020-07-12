CREATE TABLE comment(
    id INTEGER NOT NULL PRIMARY KEY,
    body TEXT NOT NULL,
    post_id INTEGER NOT NULL ,
    deleted BOOLEAN NOT NULL DEFAULT 0 CHECK (deleted IN (0,1)),
    FOREIGN KEY(post_id) REFERENCES post(id)
)