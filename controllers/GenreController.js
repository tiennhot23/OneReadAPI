const conn = require('../connection')

const db = {}

db.get = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "Genre" where endpoint = $1 limit 1'

        var params = [endpoint]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.list = () => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "Genre"'

        conn.query(query, (err, res) => {
            if(err) return reject(err)
            return resolve(res.rows)
        })
    })
}

db.add = (genre) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Genre" (endpoint, title' 
        + (genre.description?', discription':'') 
        + ') values ($1, $2' 
        + (genre.description?', $3':'')
        + ') returning *'

        var params = [genre.endpoint, genre.title]
        if (genre.description) {
            params.push(genre.description)
        }

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.update = (genre, endpoint) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let params = []
        let query = 'update "Genre" set '
        if (genre.endpoint) {
            if (num > 1) query += ','
            query += ' endpoint = $' + num
            num += 1
            params.push(genre.endpoint)
        }
        if (genre.title) {
            if (num > 1) query += ','
            query += ' title = $' + num
            num += 1
            params.push(genre.title)
        }
        if (genre.description) {
            if (num > 1) query += ','
            query += ' description = $' + num
            num += 1
            params.push(genre.description)
        }

        query += ' where endpoint = $' + num + ' returning *'
        params.push(endpoint)

        if (num == 1) query = 'select * from "Genre" where endpoint = $1 limit 1'

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.delete = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Genre" where endpoint = $1 returning *'

        var params = [endpoint]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

module.exports = db;