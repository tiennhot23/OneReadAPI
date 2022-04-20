const conn = require('../connection')

const token = {}

token.get = (token) => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "Token" where token = $1 limit 1'

        var params = [token]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows.length > 0 ? res.rows[0] : null)
        })
    })
}

token.add = (token) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Token" (token, username) values ($1, $2) returning *'

        var params = [token.token, token.username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows.length > 0 ? res.rows[0] : null)
        })
    })
}

token.update = (token) => {
    return new Promise((resolve, reject) => {
        let query = 'update "token" set token = $1 where username = $2 returning *'
        var params = [token.token, token.username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows.length > 0 ? res.rows[0] : null)
        })
    })
}

token.delete = (token) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Token" where token = $1 returning *'

        var params = [token]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows.length > 0 ? res.rows[0] : null)
        })
    })
}

module.exports = token