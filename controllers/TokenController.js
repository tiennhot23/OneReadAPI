const conn = require('../connection')

const db = {}

db.get = (token) => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "Token" where token = $1 limit 1'

        var params = [token]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.add = (token, username) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Token" (token, username) returning *'
        var params = [token, username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.delete = (token) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Token" where token = $1 returning *'

        var params = [token]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

module.exports = db;