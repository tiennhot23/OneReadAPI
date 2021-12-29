const conn = require('../connection')

const db = {}

db.get = (endpoint, username) => {
    return new Promise((resolve, reject) => {
        let query = 'update "Notify" set status = 1 where endpoint = $1 and username = $2 returning *'

        var params = [endpoint, username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.list = () => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "Notify" order by status'

        conn.query(query, (err, res) => {
            if(err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.add = (notify) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Notify" (endpoint, username, content) values ($1, $2, $3) returning *'

        var params = [notify.endpoint, notify.username, notify.content]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.delete = (endpoint, username) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Notify" where endpoint = $1 and username = $2 returning *'

        var params = [endpoint, username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.deleteRead = () => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Notify" where status = 1 returning *'

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

module.exports = db;