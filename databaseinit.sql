create database cllgproject;
create type user_role as enum('0','1');
create table users(
    user_id serial primary key,
    user_name varchar(32) not null,
    user_lastname varchar(32),
    user_email text unique not null,
    userinfo text,
    encry_password text not null,
    salt text,
    user_role user_role,
    purchases text ARRAY,
    createdat timestamp not null default NOW(),
    last_login timestamp default NOW()
);
