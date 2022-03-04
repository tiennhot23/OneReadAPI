const conn = require('../connection')

const db = {}

db.get = (history) => {
    return new Promise((resolve, reject) => {
        let query = `select c.title as chapter_title,b.*
        from "Chapter" c, (select b.*, book_endpoint, chapter_endpoint, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time
        from "Book" b,
        (select * from "History" where book_endpoint = $1 and username = $2 order by time desc) h
        where b.endpoint = h.book_endpoint) b
        where c.book_endpoint = b.book_endpoint and c.chapter_endpoint = b.chapter_endpoint`

        var params = [history.book_endpoint, history.username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.list = (username) => {
    return new Promise((resolve, reject) => {
        let query = `select c.title as chapter_title,b.*
        from "Chapter" c, (select b.*, book_endpoint, chapter_endpoint, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time
        from "Book" b,
        (select * from "History" where username = $1 order by time desc) h
        where b.endpoint = h.book_endpoint) b
        where c.book_endpoint = b.book_endpoint and c.chapter_endpoint = b.chapter_endpoint`

        var params = [username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.add = (history) => {
    return new Promise((resolve, reject) => {
        let query = `insert into "History" (book_endpoint, username, chapter_endpoint) 
        values ($1, $2, $3) returning *`

        var params = [history.book_endpoint, history.username, history.chapter_endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.update = (history, time) => {
    return new Promise((resolve, reject) => {
        let query = `update "History" set chapter_endpoint = $3, time = $4 where book_endpoint = $1
        and username = $2 returning *`

        var params = [history.book_endpoint, history.username, history.chapter_endpoint, time]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.delete = (history) => {
    return new Promise((resolve, reject) => {
        let query = `delete from "History" where book_endpoint = $1 and username = $2 returning *`

        var params = [history.book_endpoint, history.username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.delete_all = (history) => {
    return new Promise((resolve, reject) => {
        let query = `delete from "History" where username = $1 returning *`

        var params = [history.username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

module.exports = db;