const bcrypt = require('bcrypt')
const conn = require('../connection')
const jwt = require('jsonwebtoken')

const user = {}

user.get_data_from_token = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.ACCESSTOKEN, (err, user) => {
            if (err) return reject(err)
            else return resolve(user.user)
        })
    })
}

user.login = (username, password) => {
    return new Promise((resolve, reject) => {
        let query = 'select username, password, avatar, status, email from "Account" where username = $1 limit 1'
        let params = [username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else {
                if(res.rows.length == 0 || !bcrypt.compareSync(password, res.rows[0].password)){
                    return resolve(null)
                }else{
                    return resolve(res.rows[0])
                }
            } 
        })
    })
}

user.get = (username) => {
    return new Promise((resolve, reject) => {
        let query = 'select username, avatar, email, status, role from "Account" where username = $1 limit 1'
        let params = [username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

user.verify_email = (username) => {
    return new Promise((resolve, reject) => {
        let query = 'update "Account" set status = 1 where username = $1 returning *'
        let params= [username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

user.follow_book = (book_endpoint, username) => {
    return new Promise((resolve, reject) => {
        let params = [book_endpoint, username]
        let query = 'insert into "BookFollows" values ($1, $2) returning *'
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

user.unfollow_book = (book_endpoint, username) => {
    return new Promise((resolve, reject) => {
        let params = [book_endpoint, username]
        let query = 'delete from "BookFollows" where book_endpoint = $1 and username = $2 returning *'
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

user.get_book_following = (username) => {
    return new Promise((resolve, reject) => {
        let params = [username]
        let query = `select b.* from "Book" b, (select * from "BookFollows" where username = $1) bf 
        where b.endpoint = bf.book_endpoint`
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

user.get_comment_history = (username) => {
    return new Promise((resolve, reject) => {
        let params = [username]
        let query = `select id, a.avatar, a.username, a.status, a.email, a.role, book_endpoint, id_root, content, files, to_char(time, 'DD-MM-YYYY hh:mm:ss') as time from "Comment" c, "Account" a where c.username = $1 and c.username = a.username order by id desc`
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows)
        })
    })
}

user.add = (user) => {
    return new Promise((resolve, reject) => {
        let num = 3
        let params = [user.username, user.password]
        let query = 'insert into "Account" (username, password'
        + (user.avatar?', avatar':'') 
        + (user.email?', email':'')  
        + ') values ($1, $2'
        
        if (user.avatar) {
            query += ', $' + num
            num += 1
            params.push(user.avatar)
        }
        if (user.email) {
            query += ', $' + num
            num += 1
            params.push(user.email)
        }
        query += ') returning username, avatar, status, email, role'

        conn.query(query, params, (err, res) => {
            if (err) {
                return reject(err)
            } else {
                return resolve(res.rows[0])
            }
        })
    })
}

user.update = (user) => {
    return new Promise((resolve, reject) => {
        let num = 1
        let params = []
        let query = 'update "Account" set '
        if (user.avatar) {
            if (num > 1) query += ','
            query += ' avatar = $' + num
            num += 1
            params.push(user.avatar)
        }
        if (user.password) {
            if (num > 1) query += ','
            query += ' password = $' + num
            num += 1
            params.push(user.password)
        }
        if (user.email) {
            if (num > 1) query += ','
            query += ' email = $' + num + ', status = 0'
            num += 1
            params.push(user.email)
        }
        if (user.status >= -1) {
            if (num > 1) query += ','
            query += ' status = $' + num
            num += 1
            params.push(user.status)
        }
        if (user.role) {
            if (num > 1) query += ','
            query += ' role = $' + num
            num += 1
            params.push(user.role)
        }
        query += ' where username = $' + num + ' returning username, avatar, email, status, role'
        params.push(user.username)
        if (num == 1) return resolve(null)
        else {
            conn.query(query, params, (err, res) => {
                if (err) {
                    return reject(err)
                } else {
                    return resolve(res.rows[0])
                }
            })
        }
    })
}

user.delete = (username) => {
    return new Promise((resolve, reject) => {
        let params = [username]
        let query = `delete from "Account" where username = $1 returning username, avatar, email, status, role`
        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}


module.exports = user