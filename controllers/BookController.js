const conn = require('../connection')

const db = {}

db.get = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "Book" where endpoint = $1 limit 1'

        var params = [endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.list = () => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "book"'

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
        query += ') returning *'

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.update = (book, endpoint) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let params = []
        let query = 'update "book" set '
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

        if (num == 1) query = 'select * from "book" where endpoint = $1 limit 1'

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