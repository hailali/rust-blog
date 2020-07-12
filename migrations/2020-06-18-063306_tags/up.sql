CREATE TABLE tag(
    id INTEGER NOT NULL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE tag_user(
    tag_id INTEGER NOT NULL,
    user_id TEXT INTEGER NOT NULL,
    PRIMARY KEY (tag_id, user_id)
    FOREIGN KEY(tag_id) REFERENCES tag(id),
    FOREIGN KEY(user_id) REFERENCES user(id)
)
