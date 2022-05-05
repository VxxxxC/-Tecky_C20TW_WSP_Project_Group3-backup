create database blog;

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