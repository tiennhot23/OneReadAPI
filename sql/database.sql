create table "Book"
(
	endpoint varchar(255) not null
		constraint book_pk
			primary key,
	title nchar(500) not null,
	author nchar(100) not null default 'unknown',
	thumb varchar(255) not null default 'default-image',
	theme varchar(255) not null default 'default-image',
	description nchar(500) not null default 'Không có mô tả nào',
	type varchar(100) not null
	    constraint type_constraint
            check ( type = any ('{"Comic", "Novel", "Literature"}'::varchar[]) ),
	view int not null default 0,
	rating float not null default 0.0,
	status int not null default 0
	    constraint status_constraint
            check ( status = any ('{0,1}'::int[])),
	search_number int not null default 0
);

create table "Genre"
(
	endpoint varchar(255) not null
		constraint book_pk
			primary key,
	title nchar(500) not null,
	description nchar(500) not null default 'Không có mô tả nào'
);

create table "BookGenres"
(
	book_endpoint varchar(255) not null
		constraint book_fk
			references "Book"
				on update cascade,
	genre_endpoint varchar(255) not null
		constraint genre_fk
			references "Genre"
				on update cascade,
	constraint book_genres_pk
		primary key (genre_endpoint, book_endpoint)
);

create table "ViewStatistic"
(
    num int not null,
    type char(1) not null
        constraint type_constraint
            check ( type = any ('{"D", "M", "Y"}'::char[]) ),
	book_endpoint varchar(255) not null
		constraint book_fk
			references "Book"
				on update cascade,
	view int not null default 0,
	constraint view_statistic_pk
        primary key (num, type, book_endpoint)
);

create table "Account"
(
    username varchar(50) not null
        constraint account_pk
            primary key,
    password varchar(100) not null,
    avatar varchar(255) not null default 'default-avatar',
    status int not null
        constraint status_constraint
            check ( status = any ('{1,-1}'::int[])),
    email varchar(100) not null unique,
    role int not null
        constraint role_constraint
            check ( role = any ('{0,1}'::int[]))
);

create table "BookFollows"
(
	book_endpoint varchar(255) not null
		constraint book_fk
			references "Book"
				on update cascade,
	username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	constraint book_follows_pk
		primary key (book_endpoint, username)
);

create table "Chapter"
(
    endpoint varchar(255) not null,
    book_endpoint varchar(255) not null
		constraint book_fk
			references "Book"
				on update cascade,
	title nchar(255) not null,
	time date not null default (date(localtimestamp at time zone 'GMT+7')),
	images varchar[] not null,
	constraint chapter_pk
        primary key (endpoint, book_endpoint)
);

create table "History"
(
    endpoint varchar(255) not null,
    book_endpoint varchar(255) not null,
	username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	time timestamp not null default (localtimestamp at time zone 'GMT+7'),
	constraint history_pk
        primary key (endpoint, book_endpoint, username),
    constraint chapter_fk
		foreign key (book_endpoint, endpoint) references "Chapter" (book_endpoint, endpoint)
			on update cascade
);

create table "Comment"
(
    id int not null
        constraint comment_pk
            primary key,
    username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	endpoint varchar(255) not null,
	id_reply int not null
	    constraint reply_constraint
	        references "Comment"
	            on update cascade,
	content text not null,
	time timestamp not null default (localtimestamp at time zone 'GMT+7'),
	files varchar[] not null
);

create table "Notify"
(
    endpoint varchar(255) not null,
    username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	content text not null,
	status int not null default 0
	    constraint status_constraint
            check ( status = any ('{0,1}'::int[])),
	time timestamp not null default (localtimestamp at time zone 'GMT+7'),
	constraint notify_pk
        primary key (endpoint, username)
);

create table "Report"
(
    endpoint varchar(255) not null,
    type char(1) not null
        constraint type_constraint
            check ( type = any ('{"A", "C"}'::char[]) ),
    num int not null default 0,
    reason text not null,
    time timestamp not null default (localtimestamp at time zone 'GMT+7'),
    status int not null default 0
	    constraint status_constraint
            check ( status = any ('{0,1}'::int[])),
    constraint report_pk
        primary key (endpoint, type)
);


--TEST--
delete from "Book" where true;
select * from "Notify";

insert into "Book"(endpoint, title, type) values ('b', 'a', 'Comic');
insert into "Account" values ('a', 'a', 1, 'a', 1);
insert into "BookFollows" values ('b', 'a');
insert into "Chapter"(endpoint, book_endpoint, title, images) values ('1', 'b', 'a', '{"a", "b", "c"}');
insert into "History" (endpoint, book_endpoint, username) values ('1', 'b', 'a');
insert into "Comment"(id, username, endpoint, id_reply, content, files) values (1, 'a', 'a', 1, 'a', '{}');
insert into "Notify" (endpoint, username, content) values ('a', 'a', 'ê');