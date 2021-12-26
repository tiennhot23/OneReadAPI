const { query } = require('express')
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
        (select count(username) follow from "BookFollows" where book_endpoint = $1) n`

        var params = [endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.list = (filter, page) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let query = 'select * from "Book" where'
        if (filter.author) {
            if(num > 1) query += ','
            query += ' author = $' + num
            num += 1
            params.push(filter.author)
        }
        if (filter.type) {
            if(num > 1) query += ','
            query += ' type = $' + num
            num += 1
            params.push(filter.type)
        }
        if (filter.genre) {
            if(num > 1) query += ','
            query += ' genre in $' + num
            num += 1
            params.push(filter.genre)
        }
        if (filter.status) {
            if(num > 1) query += ','
            query += ' status = $' + num
            num += 1
            params.push(filter.status)
        }

        if (num == 1) query = 'select * from "Book"'

        conn.query(query, (err, res) => {
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
        
        conn.query(query, params, (err, res) => {
            if (err) {
                return reject(err)
            } else {
                return resolve(res.rows)
            }
        })
    })
}

db.update = (book, endpoint) => {
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
        if (book.description) {
            if (num > 1) query += ','
            query += ' description = $' + num
            num += 1
            params.push(book.description)
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

module.exports = db;