const conn = require('../connection')
const constants = require('../configs/constants')

const notify = {}

notify.get = (endpoint, username) => {
    return new Promise((resolve, reject) => {
        let query = `update "Notify" set status = 1 where endpoint = $1 and username = $2 returning *, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time`

        var params = [endpoint, username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

notify.get_all = (username, page) => {
    return new Promise((resolve, reject) => {
        let query = `select *, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Notify" where username = $1`
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))
        var params = [username]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

notify.add = (notify) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Notify" (endpoint, username, content) values ($1, $2, $3) returning *'

        var params = [notify.endpoint, notify.username, notify.content]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

notify.delete = (endpoint, username) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Notify" where endpoint = $1 and username = $2 returning *'

        var params = [endpoint, username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

notify.deleteRead = () => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Notify" where status = 1 returning *'

        conn.query(query, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

module.exports = notify