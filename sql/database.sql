create table "Book"
(
    endpoint varchar(255) not null
		constraint book_pk
			primary key,
	title text not null,
	author text not null default 'unknown',
	thumb varchar(255) not null default 'https://lh3.googleusercontent.com/proxy/2tSbUwA5fzMnQ7Jh85LXp4_QwOCwYQtv1yrqoW7Fpgvav1WXRJPqFNXClbRFOMIKtP6mDAgJG1y1pac0sxENIA78BrntCd5DrlQnCPxwzvM8QHoYipIc8X62T3-o',
	theme varchar(255) not null default 'https://lh3.googleusercontent.com/proxy/2tSbUwA5fzMnQ7Jh85LXp4_QwOCwYQtv1yrqoW7Fpgvav1WXRJPqFNXClbRFOMIKtP6mDAgJG1y1pac0sxENIA78BrntCd5DrlQnCPxwzvM8QHoYipIc8X62T3-o',
	description text not null default 'Không có mô tả nào',
	type varchar(100) not null
	    constraint type_constraint
            check ( type = any ('{"Comic", "Novel", "Literature"}'::varchar[]) ),
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
	title text not null,
	description text not null default 'Không có mô tả nào'
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

create table "BookViews"
(
    time date not null default (date(localtimestamp at time zone 'GMT+7')),
	book_endpoint varchar(255) not null
		constraint book_fk
			references "Book"
				on update cascade,
	view int not null default 0,
	constraint view_statistic_pk
        primary key (time, book_endpoint)
);

create table "Account"
(
    username varchar(50) not null
        constraint account_pk
            primary key,
    password varchar(100) not null,
    avatar varchar(255) not null default 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg',
    /*
        -1  :   banned
        0   :   not verify (default)
        1   :   verified
    */
    status smallint not null default 0
        constraint status_constraint
            check ( status = any ('{1,0,-1}'::smallint[])),
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
				on update cascade
                on delete cascade,
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
	title text not null,
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
				on update cascade
                on delete cascade,
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
				on update cascade
                on delete cascade,
	endpoint varchar(255) not null,
	id_root int
	    constraint reply_constraint
	        references "Comment"
	            on update cascade
                on delete cascade,
	content text not null,
	time timestamp not null default (localtimestamp at time zone 'GMT+7'),
	files varchar[]
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
				on update cascade
                on delete cascade,
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

create table "Token"
(
    token text not null primary key,
    username varchar(50) not null
		constraint username_fk
			references "Account"
				on update cascade,
	createAt timestamp not null default (localtimestamp at time zone 'GMT+7')
);


--TEST--
delete from "BookGenres" where true;
delete from "Genre" where true;
delete from "Notify" where true;
delete from "Report" where true;
delete from "BookViews" where true;
delete from "Comment" where true;
delete from "History" where true;
delete from "BookFollows" where true;
delete from "ChapterDetail" where true;
delete from "Chapter" where true;
delete from "Account" where true;
delete from "Book" where true;

insert into "Book"(endpoint, title, type) values ('one-punch-man', 'One punch man', 'Comic');
insert into "Account" values ('a', 'a', 1, 'a', 1);
insert into "BookFollows" values ('b', 'a');
insert into "History" (chapter_endpoint, book_endpoint, username) values ('chapter-2', 'one-piece', 'sai');
insert into "Comment"(username, endpoint, id_root, content, files) values ('a', 'a', null, 'a', '{}');
insert into "Notify" (endpoint, username, content) values ('a', 'a', 'ê');
insert into "Genre" (endpoint, title) values ('manga', 'Manga');
insert into "BookGenres" values ('one-punch-man', 'comedy');
insert into "Report" (endpoint, type, reason) values ('a', 'A', 'a') returning *;

drop table "BookGenres";
drop table "Genre";
drop table "Notify";
drop table "Report";
drop table "BookViews";
drop table "Comment";
drop table "History";
drop table "BookFollows";
drop table "ChapterDetail";
drop table "Chapter";
drop table "Account";
drop table "Book";

select * from "BookGenres";
select * from "Genre";
select * from "Notify";
select * from "Report";
select * from "BookViews";
select * from "Comment";
select * from "History";
select * from "BookFollows";
select * from "ChapterDetail";
select * from "Chapter";
select * from "Account";
select * from "Book";


--data
insert into "Book"(endpoint, title, type) values ('my-hero-academia', 'My Hero Academia', 'Comic'),
                                                 ('haikyuu', 'Haikyuu', 'Comic'),
                                                 ('my-hero-academia', 'My Hero Academia', 'Comic'),
                                                 ('my-hero-academia', 'My Hero Academia', 'Comic'),
                                                 ('my-hero-academia', 'My Hero Academia', 'Comic'),
                                                 ('my-hero-academia', 'My Hero Academia', 'Comic');
insert into "Genre" (endpoint, title, description) values ('adventure', 'Adventure', 'Thể loại phiêu lưu, mạo hiểm, thường là hành trình của các nhân vật'),
                                             ('romance', 'Romance', 'Thường là những câu chuyện về tình yêu, tình cảm lãng mạn. Ớ đây chúng ta sẽ lấy ví dụ như tình yêu giữa một người con trai và con gái, bên cạnh đó đặc điểm thể loại này là kích thích trí tưởng tượng của bạn về tình yêu'),
                                             ('supernatural', 'Supernatural', 'Thể hiện những sức mạnh đáng kinh ngạc và không thể giải thích được, chúng thường đi kèm với những sự kiện trái ngược hoặc thách thức với những định luật vật lý');



select * from (select * from "Book" b where endpoint = 'one-punch-man' limit 1) b,
(select json_agg(jsonb_build_object('endpoint', endpoint,
                                    'title', title,
                                    'description', description)) genres
from "Genre" g,
     (select * from "BookGenres" where book_endpoint = 'one-punch-man') bg
where g.endpoint = bg.genre_endpoint) g,
(select count(username) follow from "BookFollows" where book_endpoint = 'one-punch-man') f,
(select sum(view) as view from "BookViews" where book_endpoint = 'one-punch-man') v;


select c.title as chapter_title,b.*
from "Chapter" c, (select title, thumb, theme, type, rating, book_endpoint, chapter_endpoint
from "Book" b,
(select * from "History" where username = 'sai' order by time desc) h
where b.endpoint = h.book_endpoint) b
where c.book_endpoint = b.book_endpoint and c.chapter_endpoint = b.chapter_endpoint;


-- goi y sach theo user
select b.* from (select book_endpoint, count(book_endpoint) as count from (select * from "BookGenres" where book_endpoint not in (select book_endpoint from "BookFollows" where username = 'sai')) as bg where genre_endpoint in
(select genre_endpoint from (select bg.genre_endpoint as genre_endpoint, count(genre_endpoint) as count from
(select book_endpoint from "BookFollows" where username = 'sai') bf,
"BookGenres" bg where bf.book_endpoint = bg.book_endpoint
group by genre_endpoint
order by count desc limit 10) as g)
group by book_endpoint
order by count desc limit 10) as sg, "Book" b
where b.endpoint = sg.book_endpoint;

-- goi y sach cung the loai
select * from "Book",
(select book_endpoint, count(book_endpoint) as count from "BookGenres"
where genre_endpoint in
(select genre_endpoint from "BookGenres" where book_endpoint = 'sherlock-holmes')
and book_endpoint <> 'sherlock-holmes'
group by book_endpoint
order by count desc limit 10) as g
where book_endpoint = endpoint;

--top view
select b.*, view from (select book_endpoint, sum(view) as view from "BookViews"
where date_part('month', time) = date_part('month', date(localtimestamp at time zone 'GMT+7'))
group by book_endpoint limit 10) as v, "Book" b
where v.book_endpoint = b.endpoint
order by view desc;


-- top sach co follow cao
select b.*, count from (select book_endpoint, count(username) as count from "BookFollows"
group by book_endpoint limit 10) as v, "Book" b
where v.book_endpoint = b.endpoint
order by count desc;

select * from "Book" b
where endpoint in
(select book_endpoint from "Chapter"
order by time desc limit 10) limit 10;

--filter book
select b.* from "Book" b, (select book_endpoint, count(book_endpoint) as count
from "BookGenres" where genre_endpoint = any('{"action", "comedy", adventure}'::varchar[])
group by book_endpoint) as bg
where b.endpoint = bg.book_endpoint
and endpoint like '%ne%'
and author = lower('unknown')
and status = 1
and type = 'Comic'
and count >= 2
order by count desc;


select date_part('day', date(localtimestamp at time zone 'GMT+7'));











