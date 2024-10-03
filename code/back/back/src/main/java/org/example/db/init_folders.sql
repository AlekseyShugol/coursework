create table nodes(
    id serial primary key,
    name varchar(16384),
    type varchar(128),
    parent_id bigint,
    url text
);