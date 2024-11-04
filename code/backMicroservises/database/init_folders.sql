create table nodes(
    id bigserial primary key,
    name text,
    type varchar(128),
    parent_id bigint,
    url text,
    description text
);