PRAGMA foreign_keys=off;

ALTER TABLE post RENAME TO post_old;

CREATE TABLE post(
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    sub_title TEXT NOT NULL,
    body TEXT NOT NULL,
    active BOOLEAN NOT NULL CHECK (active IN (0,1)),
    deleted BOOLEAN NOT NULL DEFAULT 0 CHECK (deleted IN (0,1)),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES user(id)
);

INSERT INTO post (id, user_id, title, sub_title, body, active, deleted)
  SELECT id, user_id, title, title, body, active, deleted
  FROM post_old;

DROP TABLE post_old;

PRAGMA foreign_keys=on;