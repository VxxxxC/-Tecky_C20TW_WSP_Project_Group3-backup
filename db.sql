create user veper with password 'abc123' superuser;

create database blog;

<<<<<<< HEAD
CREATE TABLE users(
    id SERIAL primary key,
    usernames VARCHAR(255) not null,
    passwords VARCHAR(255) not null,
    create_at timestamp,
    updated_at timestamp,
    is_admin boolean
);


INSERT INTO users (id,usernames ,passwords ,create_at,updated_at,is_admin) VALUES (1,'mary','1223',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),TRUE);
INSERT INTO users (id,usernames ,passwords ,create_at,updated_at,is_admin) VALUES (2,'BEN','12243',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),FALSE);
INSERT INTO users (id,usernames ,passwords ,create_at,updated_at,is_admin) VALUES (3,'peter','12253',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),FALSE);
INSERT INTO users (id,usernames ,passwords ,create_at,updated_at,is_admin) VALUES (4,'BEN','1523',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),FALSE);
=======
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


-- below code for reset post ID serial primary key
-- alter sequence post_id_seq restart with 1000;
>>>>>>> 7df0210fe618f2132931600859ed34e13245637d
