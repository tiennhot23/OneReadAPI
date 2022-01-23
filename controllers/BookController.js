const constants = require('../configs/constants')
const conn = require('../connection')

const db = {}

db.get = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = `select * from (select * from "Book" b where endpoint = $1 limit 1) b,
        (select json_agg(jsonb_build_object('endpoint', endpoint,
                                            'title', btrim(title),
                                            'description', btrim(description))) genres
        from "Genre" g,
             (select * from "BookGenres" where book_endpoint = $1) bg
        where g.endpoint = bg.genre_endpoint) g,
        (select count(username) follow from "BookFollows" where book_endpoint = $1) f,
        (select sum(view) as view from "BookViews" where book_endpoint = $1) v`

        var params = [endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.get_user_follow = (book_endpoint) => {
    return new Promise((resolve, reject) => {
        let query = `select * from "BookFollows" where book_endpoint = $1`

        var params = [book_endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows)
        })
    })
}

db.get_suggest_book = (username) => {
    return new Promise((resolve, reject) => {
        let query = `select b.* from 
        (select book_endpoint, count(book_endpoint) as count from 
        (select * from "BookGenres" where book_endpoint not in 
        (select book_endpoint from "BookFollows" where username = $1)) as bg where genre_endpoint in
        (select genre_endpoint from (select bg.genre_endpoint as genre_endpoint, count(genre_endpoint) as count from
        (select book_endpoint from "BookFollows" where username = $1) bf,
        "BookGenres" bg where bf.book_endpoint = bg.book_endpoint
        group by genre_endpoint
        order by count desc limit 10) as g)
        group by book_endpoint
        order by count desc limit 10) as sg, "Book" b
        where b.endpoint = sg.book_endpoint`

        let params = [username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_top_search = () => {
    return new Promise((resolve, reject) => {
        let query = `select * from "Book" order by search_number desc limit 10`

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_top_rating = () => {
    return new Promise((resolve, reject) => {
        let query = `select * from "Book" order by rating desc limit 10`

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_top_day = () => {
    return new Promise((resolve, reject) => {
        /* TOP VIEW DAY REAL
        let query = `select b.*, view from (select book_endpoint, sum(view) as view from "BookViews"
        where date_part('day', time) = date_part('day', date(localtimestamp at time zone 'GMT+7'))
        group by book_endpoint limit 10) as v, "Book" b
        where v.book_endpoint = b.endpoint
        order by view desc`
        */

        // TOP VIEW DAY FAKE
        let query = `select b.*, view from (select bv.book_endpoint, sum(bv.view) as view from "BookViews" bv,
        (select book_endpoint, max(time) as time from "BookViews"
        group by book_endpoint order by time desc limit 10) b
        where bv.book_endpoint = b.book_endpoint and bv.time = b.time
        group by bv.book_endpoint) as v, "Book" b
        where v.book_endpoint = b.endpoint
        order by view desc`

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_top_month = () => {
    return new Promise((resolve, reject) => {
        /*TOP VIEW MONTH REAL
        let query = `select b.*, view from (select book_endpoint, sum(view) as view from "BookViews"
        where date_part('month', time) = date_part('month', date(localtimestamp at time zone 'GMT+7'))
        group by book_endpoint limit 10) as v, "Book" b
        where v.book_endpoint = b.endpoint
        order by view desc`
        */

        //TOP VIEW MONTH FAKE
        let query = `select b.*, view from (select bv.book_endpoint, sum(bv.view) as view from "BookViews" bv,
        (select book_endpoint, max(time) as time from "BookViews"
        group by book_endpoint order by time desc limit 10) b
        where bv.book_endpoint = b.book_endpoint and date_part('month', bv.time) = date_part('month', b.time) and date_part('year', bv.time) = date_part('year', b.time)
        group by bv.book_endpoint) as v, "Book" b
        where v.book_endpoint = b.endpoint
        order by view desc`

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_top_year = () => {
    return new Promise((resolve, reject) => {
        /* TOP VIEW YEAR REAL
        let query = `select b.*, view from (select book_endpoint, sum(view) as view from "BookViews"
        where date_part('year', time) = date_part('year', date(localtimestamp at time zone 'GMT+7'))
        group by book_endpoint limit 10) as v, "Book" b
        where v.book_endpoint = b.endpoint
        order by view desc`
        */

        //TOP VIEW YEAR FAKE
        let query = `select b.*, view from (select book_endpoint, sum(view) as view, max(time) as time from "BookViews"
        group by book_endpoint order by time desc limit 10) as v, "Book" b
        where v.book_endpoint = b.endpoint
        order by view desc`

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_top_follow = () => {
    return new Promise((resolve, reject) => {
        let query = `select b.*, count from (select book_endpoint, count(username) as count from "BookFollows"
        group by book_endpoint limit 10) as v, "Book" b
        where v.book_endpoint = b.endpoint
        order by count desc`

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_last_update = () => {
    return new Promise((resolve, reject) => {
        let query = `select * from "Book" b where endpoint in
        (select book_endpoint from "Chapter"
        order by time desc limit 10) limit 10`

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_relate_book = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = `select * from "Book",
        (select book_endpoint, count(book_endpoint) as count from "BookGenres"
        where genre_endpoint in
        (select genre_endpoint from "BookGenres" where book_endpoint = $1)
        and book_endpoint <> $1
        group by book_endpoint
        order by count desc limit 10) as g
        where book_endpoint = endpoint`

        let params = [endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_book_of_type = (type) => {
    return new Promise((resolve, reject) => {
        let query = `select * from "Book" b where b.type = $1 order by rate_count desc, rating desc limit 10`
        let params = [type]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.filter_with_genres = (filter, page) => {
    return new Promise((resolve, reject) => {
        let num = 3
        let params = [filter.genres, filter.genres.length]
        let query = `select b.* from "Book" b, 
        (select book_endpoint, count(book_endpoint) as count 
        from "BookGenres" where genre_endpoint = any($1::varchar[])
        group by book_endpoint) as bg
        where b.endpoint = bg.book_endpoint and status <> -1`
        
        if (filter.title) {
            query += ` and title ilike $` + num
            num += 1
            params.push('%' + filter.title + '%')
        }
        if (filter.author) {
            query += ` and lower(author) = lower($` + num + `)`
            num += 1
            params.push(filter.author)
        }
        if (filter.type) {
            query += ' and type = $' + num
            num += 1
            params.push(filter.type)
        }
        if (filter.status) {
            query += ' and status = $' + num
            num += 1
            params.push(filter.status)
        }

        query += ` and count >= $2
        order by count desc`
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))

        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            return resolve(res.rows)
        })
    })
}

db.filter_without_genres = (filter, page) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let params = []
        let query = `select * from "Book" where status <> -1`
        
        if (filter.title) {
            query += ` and title ilike $` + num
            num += 1
            params.push('%' + filter.title + '%')
        }
        if (filter.author) {
            query += ` and lower(author) = lower($` + num + `)`
            num += 1
            params.push(filter.author)
        }
        if (filter.type) {
            query += ' and type = $' + num
            num += 1
            params.push(filter.type)
        }
        if (filter.status) {
            query += ' and status = $' + num
            num += 1
            params.push(filter.status)
        }
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))

        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            return resolve(res.rows)
        })
    })
}

db.get_all = (page) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let params = []
        let query = `select * from "Book" where status <> -1`
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))

        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            return resolve(res.rows)
        })
    })
}

db.add = (book) => {
    return new Promise((resolve, reject) => {
        let num = 3
        let params = [book.endpoint, book.title]
        let query = 'insert into "Book" (endpoint, title'
        + (book.author?', author':'') 
        + (book.thumb?', thumb':'') 
        + (book.theme?', theme':'') 
        + (book.description?', description':'') 
        + (book.type?', type':'') 
        + ') values ($1, $2'
        
        if (book.author) {
            query += ', $' + num
            num += 1
            params.push(book.author)
        }
        if (book.thumb) {
            query += ', $' + num
            num += 1
            params.push(book.thumb)
        }
        if (book.theme) {
            query += ', $' + num
            num += 1
            params.push(book.theme)
        }
        if (book.description) {
            query += ', $' + num
            num += 1
            params.push(book.description)
        }
        if (book.type) {
            query += ', $' + num
            num += 1
            params.push(book.type)
        }
        query += ') returning *;'

        conn.query(query, params, (err, res) => {
            if (err) {
                return reject(err)
            } else {
                return resolve(res.rows[0])
            }
        })
    })
}

db.add_book_genres = (book_endpoint, genres) => {
    return new Promise((resolve, reject) => {
        let num = 2
        let params = [book_endpoint]
        let query = 'insert into "BookGenres" values'
        genres.forEach(genre_endpoint => {
            if (num > 2) query += ','
            query += ' ($1, $' + num + ')'
            num += 1
            params.push(genre_endpoint)
        })
        query += ' returning *'
        
        conn.query(query, params, (err, res) => {
            if (err) {
                return reject(err)
            } else {
                return resolve(res.rows)
            }
        })
    })
}

db.update_info = (book, endpoint) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let params = []
        let query = 'update "Book" set '
        if (book.endpoint) {
            if (num > 1) query += ','
            query += ' endpoint = $' + num
            num += 1
            params.push(book.endpoint)
        }
        if (book.title) {
            if (num > 1) query += ','
            query += ' title = $' + num
            num += 1
            params.push(book.title)
        }
        if (book.author) {
            if (num > 1) query += ','
            query += ' author = $' + num
            num += 1
            params.push(book.author)
        }
        if (book.thumb) {
            if (num > 1) query += ','
            query += ' thumb = $' + num
            num += 1
            params.push(book.thumb)
        }
        if (book.theme) {
            if (num > 1) query += ','
            query += ' theme = $' + num
            num += 1
            params.push(book.theme)
        }
        if (book.description) {
            if (num > 1) query += ','
            query += ' description = $' + num
            num += 1
            params.push(book.description)
        }
        if (book.type) {
            if (num > 1) query += ','
            query += ' type = $' + num
            num += 1
            params.push(book.type)
        }

        query += ' where endpoint = $' + num + ' returning *'
        params.push(endpoint)

        if (num == 1) query = 'select * from "Book" where endpoint = $1 limit 1'

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

/**
 * cong thuc tinh rating: 
 */
db.update_rating = (book, endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'update "Book" set rate_count = $1, rating = $2 where endpoint = $3 returning rating, rate_count'
        let params = [book.rate_count, book.rating, endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.finish_book = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'update "Book" set status = 1 where endpoint = $1 returning *'
        let params = [endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.get_view = (book_endpoint, time) => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "BookViews" where book_endpoint = $1 and time = $2'
        let params = [book_endpoint, time]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}



db.add_view = (book_endpoint, time) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "BookViews" (book_endpoint, time) values($1, $2) returning view'
        let params = [book_endpoint, time]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.update_view = (book_endpoint, time) => {
    return new Promise((resolve, reject) => {
        let query = 'update "BookViews" set view = (view + 1) where book_endpoint = $1 and time = $2 returning view'
        let params = [book_endpoint, time]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.update_search_number = (book) => {
    return new Promise((resolve, reject) => {
        let query = 'update "Book" set search_number = $2 where endpoint = $1 returning search_number'
        let params = [book.endpoint, book.search_number]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.delete = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'update "Book" set status = -1 where endpoint = $1 returning *'

        var params = [endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.delete_all_genres = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "BookGenres" where book_endpoint = $1'

        var params = [endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows)
        })
    })
}

module.exports = db;