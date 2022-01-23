const conn = require('../connection')

const db = {}

db.get = (id) => {
    return new Promise((resolve, reject) => {
        let query = `select *, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Comment" where id = $1 or id_root = $1`

        var params = [id]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.list = (endpoint) => {
    return new Promise((resolve, reject) => {
        let query = `select *, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Comment" where endpoint = $1 and id_root is null order by time desc`
        let params = [endpoint]
        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.add = (comment) => {
    return new Promise((resolve, reject) => {
        let query = 'insert into "Comment" (endpoint, username, content' 
        + (comment.id_root?', id_root':'') 
        + (comment.files?', files':'') 
        + ') values ($1, $2, $3'
        + (comment.id_root?', $4':'') 
        + (comment.files?', $5':'')
        + ') returning *'

        var params = [comment.endpoint, comment.username, comment.content]
        if (comment.id_root) params.push(comment.id_root)
        if (comment.files) params.push(comment.files)

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

db.delete = (id) => {
    return new Promise((resolve, reject) => {
        let query = 'delete from "Comment" where id = $1 returning *'

        var params = [id]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

module.exports = db;