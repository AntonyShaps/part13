CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title, likes) values ('Dan Abramov', 'http://hello.com', 'stop it', 5);
insert into blogs (author, url, title, likes) values ('Angus Young', 'http://acdc.com', 'power up', 6);