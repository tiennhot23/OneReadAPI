const conn = require('../connection')

const constants = require('../configs/constants')
const db = {}

db.get = (id, page) => {
    return new Promise((resolve, reject) => {
        let query = `select id, a.avatar, c.username, endpoint, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Comment" c, "Account" a where (id = $1 or id_root = $1) and c.username = a.username order by time desc`
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))
        var params = [id]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.list = (endpoint, page) => {
    return new Promise((resolve, reject) => {
        let query = `select id, a.avatar, c.username, endpoint, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time 
        from "Comment" c, "Account" a where endpoint = $1 and id_root is null and c.username = a.username order by time desc`
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))
        let params = [endpoint]
        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.add = (comment) => {
    return new Promise((resolve, reject) => {
        let num = 4
        var params = [comment.endpoint, comment.username, comment.content]
        let query = 'insert into "Comment" (endpoint, username, content' 
        + (comment.id_root?', id_root':'') 
        + (comment.files?', files':'') 
        + ') values ($1, $2, $3'

        if (comment.id_root) {
            if (num > 1) query += ', $' + num
            num += 1
            params.push(comment.id_root)
        }
        if (comment.files) {
            if (num > 1) query += ', $' + num
            num += 1
            params.push(comment.files)
        }
        query += ') returning *'

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