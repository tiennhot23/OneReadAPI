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
	rate_count int not null default 0,
	/*
	    -1  :   đã xoá
	    0   :   đang tiến hành
	    1   :   đã hoàn thành
	*/
	status smallint not null default 0
	    constraint status_constraint
            check ( status = any ('{-1,0,1}'::smallint[])),
	search_number int not null default 0
);

create table "Genre"
(
    endpoint varchar(255) not null
		constraint genre_pk
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
				on update cascade
                on delete cascade,
	constraint book_genres_pk
		primary key (genre_endpoint, book_endpoint)
);

create table "ViewStatistic"
(
    /*
        day: 1 -> 30
        month: 1-> 12
        year: ...
    */
    num smallint not null,
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
    /*
        -1  :   banned
        1   :   default
    */
    status smallint not null default 1
        constraint status_constraint
            check ( status = any ('{1,-1}'::smallint[])),
    email varchar(100) not null unique,
    /*
        0   :   user
        1   :   admin
    */
    role smallint not null default 0
        constraint role_constraint
            check ( role = any ('{0,1}'::smallint[]))
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
    chapter_endpoint varchar(255) not null,
    book_endpoint varchar(255) not null
		constraint book_fk
			references "Book"(endpoint)
				on update cascade,
	title nchar(255) not null,
	time date not null default (date(localtimestamp at time zone 'GMT+7')),
	constraint chapter_pk
        primary key (chapter_endpoint, book_endpoint)
);

create table "ChapterDetail"
(
    chapter_endpoint varchar(255) not null,
    book_endpoint varchar(255) not null,
    images varchar[] not null,
    constraint chapter_detail_fk
        foreign key (chapter_endpoint, book_endpoint)
            references "Chapter"(chapter_endpoint, book_endpoint)
                on update cascade
                on delete cascade
);

create table "History"
(
    book_endpoint varchar(255) not null,
	username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	chapter_endpoint varchar(255) not null,
	time timestamp not null default (localtimestamp at time zone 'GMT+7'),
	constraint history_pk
        primary key (book_endpoint, username),
    constraint chapter_fk
		foreign key (book_endpoint, chapter_endpoint) references "Chapter" (book_endpoint, chapter_endpoint)
			on update cascade
            on delete cascade
);

create table "Comment"
(
    id bigserial not null
        constraint comment_pk
            primary key,
    username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	endpoint varchar(255) not null,
	id_reply int
	    constraint reply_constraint
	        references "Comment"
	            on update cascade
                on delete cascade,
	content text not null,
	time timestamp not null default (localtimestamp at time zone 'GMT+7'),
	files varchar[] not null
);

create table "Notify"
(
    /*
        endpoint: endpoint of comment or book
    */
    endpoint varchar(255) not null,
    username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	content text not null,
	/*
	    0   :   chưa xem
	    1   :   đã xem
	*/
	status smallint not null default 0
	    constraint status_constraint
            check ( status = any ('{0,1}'::smallint[])),
	time timestamp not null default (localtimestamp at time zone 'GMT+7'),
	constraint notify_pk
        primary key (endpoint, username)
);

create table "Report"
(
    /*
        endpoint: endpoint of comment or user
    */
    endpoint varchar(255) not null,
    /*
        A   :   Account
        C   :   Comment
    */
    type char(1) not null
        constraint type_constraint
            check ( type = any ('{"A", "C"}'::char[]) ),
    num int not null default 0,
    reason text not null,
    time timestamp not null default (localtimestamp at time zone 'GMT+7'),
    /*
	    0   :   chưa xủ lí
	    1   :   đã xủ lí
	*/
    status smallint not null default 0
	    constraint status_constraint
            check ( status = any ('{0,1}'::smallint[])),
    constraint report_pk
        primary key (endpoint, type)
);


--TEST--
delete from "Book" where true;
delete from "Account" where true;
delete from "BookFollows" where true;
delete from "Chapter" where true;
delete from "History" where true;
delete from "Comment" where true;
delete from "Notify" where true;
delete from "Genre" where true;

select * from "Genre";
select * from "Genre" where endpoint = 'trinh-tham' limit 1;

insert into "Book"(endpoint, title, type) values ('b', 'a', 'Comic');
insert into "Account" values ('a', 'a', 1, 'a', 1);
insert into "BookFollows" values ('b', 'a');
insert into "History" (chapter_endpoint, book_endpoint, username) values ('1', 'b', 'a');
insert into "Comment"(username, endpoint, id_reply, content, files) values ('a', 'a', null, 'a', '{}');
insert into "Notify" (endpoint, username, content) values ('a', 'a', 'ê');
insert into "Genre" values ('a', 'a', '');

delete from "Comment" where id = 1;

drop table "BookGenres";
drop table "Genre";
drop table "Notify";
drop table "Report";
drop table "ViewStatistic";
drop table "Comment";
drop table "History";
drop table "BookFollows";
drop table "ChapterDetail";
drop table "Chapter";
drop table "Account";
drop table "Book";





