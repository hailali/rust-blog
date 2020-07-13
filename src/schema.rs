table! {
    comment (id) {
        id -> Integer,
        body -> Text,
        post_id -> Integer,
        deleted -> Bool,
    }
}

table! {
    post (id) {
        id -> Integer,
        user_id -> Integer,
        title -> Text,
        sub_title -> Text,
        body -> Text,
        active -> Bool,
        deleted -> Bool,
        created_at -> Timestamp,
    }
}

table! {
    tag (id) {
        id -> Integer,
        name -> Text,
    }
}

table! {
    tag_user (tag_id, user_id) {
        tag_id -> Integer,
        user_id -> Integer,
    }
}

table! {
    user (id) {
        id -> Integer,
        username -> Text,
        encrypted_password -> Text,
        last_name -> Text,
        first_name -> Text,
        email -> Text,
        deleted -> Bool,
    }
}

joinable!(post -> user (user_id));
joinable!(tag_user -> tag (tag_id));
joinable!(tag_user -> user (user_id));

allow_tables_to_appear_in_same_query!(
    comment,
    post,
    tag,
    tag_user,
    user,
);
