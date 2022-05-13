create user veper with password 'abc123' superuser;




//////////////////////////////////////////////////////////
create database blog;

  username varchar(255) not null unique,
  password varchar(255) not null,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,
  is_admin boolean default false
);

INSERT INTO users (id,username ,password ,created_at,updated_at,is_admin) VALUES (1,'mary','1223',default(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),TRUE);
INSERT INTO users (id,username ,password ,created_at,updated_at,is_admin) VALUES (2,'BEN','12243',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),FALSE);
INSERT INTO users (id,username ,password ,created_at,updated_at,is_admin) VALUES (3,'peter','12253',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),FALSE);
INSERT INTO users (id,username ,password ,created_at,updated_at,is_admin) VALUES (4,'user','1523',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),FALSE);

create table post (
  id serial primary key,
  title text not null,
  content text not null,
  image varchar(255),
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp,

  users_id integer,
  foreign key (users_id) references users(id) 
);

INSERT INTO users (id,title ,content,image ,created_at,updated_at,users_id) VALUES (1,'mary','testing','image.jpe',(CURRENT_TIMESTAMP),(CURRENT_TIMESTAMP),'ppp');

create table tags(
  id serial primary key,
  name varchar(255)

);

create table post_tag(
  id serial primary key,

  post_id integer,
  foreign key (post_id) references post(id),
  tags_id integer,
  foreign key (tags_id) references tags(id)
);



/////////////////////////////////////////////////////////////////////////////////

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



create table views(
  id serial primary key,

  users_id integer,
  foreign key (users_id) references users(id),
  post_id integer,
  foreign key (post_id) references post(id)
);



/*
-- below code for reset post ID serial primary key :
alter sequence post_id_seq restart with 1;


-- below code 搵由OFFSET開始計 8行嘅DATA :
select * from post offset 0 fetch first 8 rows only;

*/

/* 
alter sequence post_id_seq restart with 1;
alter sequence post_tag_id_seq restart with 1;
alter sequence tags_id_seq restart with 1;

delete from post_tag;
delete from tags;
delete from post;
*/