const conn = require('../connection')

const constants = require('../configs/constants')
const db = {}

db.get = (id, page) => {
    return new Promise((resolve, reject) => {
        let query = `select id, a.avatar, a.username, a.status, a.email, a.role, book_endpoint, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Comment" c, "Account" a where (id = $1 or id_root = $1) and c.username = a.username order by id desc`
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))
        var params = [id]
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.get_all = (book_endpoint, page) => {
    return new Promise((resolve, reject) => {
        let query = `select id, a.avatar, a.username, a.status, a.email, a.role, book_endpoint, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time 
        from "Comment" c, "Account" a where book_endpoint = $1 and id_root = id and c.username = a.username order by id desc`
        query += ' limit ' + constants.limit_element + ' offset ' + (constants.limit_element * (page - 1))
        let params = [book_endpoint]
        conn.query(query, params, (err, res) => {
            if(err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

db.add = (comment) => {
    return new Promise((resolve, reject) => {
        let num = 4
        var params = [comment.book_endpoint, comment.username, comment.content]
        let query = 'insert into "Comment" (book_endpoint, username, content' 
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
        query += `) returning id, id_root, book_endpoint, content, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time, files`

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

/**
 * update after add
 * @param {*} comment 
 * @returns 
 */
db.update = (comment) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let params = []
        let query = `update "Comment" set `
        if (comment.files) {
            if (num > 1) query += ','
            query += ' files = $' + num
            num += 1
            params.push(comment.files)
        }
        if (comment.id_root) {
            if (num > 1) query += ','
            query += ' id_root = $' + num
            num += 1
            params.push(comment.id_root)
        }

        query += ' where id = $' + num + ` returning id, id_root, book_endpoint, content, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time, files`
        params.push(comment.id)

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            return resolve(res.rows[0])
        })
    })
}

db.delete = (id) => {
    return new Promise((resolve, reject) => {
        let query = `delete from "Comment" where id = $1 returning id, id_root, username, book_endpoint, content, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time, files`

        var params = [id]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

module.exports = db;