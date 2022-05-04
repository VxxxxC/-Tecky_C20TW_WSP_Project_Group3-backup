create user veper with password 'abc123' superuser;

create database blog;

create table users (
  id serial primary key,
  username varchar(255) not null unique,
  password varchar(255) not null,
  email varchar(255) not null unique,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  is_admin boolean default false
);



create table post (
  id serial primary key,
  title text not null,
  content text not null,
  image bytea,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,

  users_id integer,
  foreign key (users_id) references users(id)
);



create table comment (
  id serial primary key,
  content text not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,

  users_id integer,
  foreign key (users_id) references users(id),
  post_id integer,
  foreign key (post_id) references post(id)
);

create table tags(
  id serial primary key,
  tag varchar(255) not null,

  post_id integer,
  foreign key (post_id) references post(id)
);

create table views(
  id serial primary key,

  users_id integer,
  foreign key (users_id) references users(id),
  post_id integer,
  foreign key (post_id) references post(id)
);