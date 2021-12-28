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

user.get = (username, password) => {
    return new Promise((resolve, reject) => {
        let query = 'select * from "Account" where username = $1 limit 1'
        let params = [username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else {
                if(!bcrypt.compareSync(password, res.rows[0].password)){
                    resolve(null)
                }else{
                    resolve(res)
                }
                return resolve(res.rows[0])
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
        let query = 'update "Account" set status = 1 where username = $1'
        let params= [username]

        conn.query(query, params, (err, res) => {
            if (err) return reject(err)
            else return resolve(res.rows[0])
        })
    })
}

/**
 * 
 * @param {User} user 
 * @param {string} username 
 * @returns {
                "userfollowing": {
                    "n": 1,
                    "nModified": 1,
                    "ok": 1
                }
            }
 */
// user.following = (user, username) => {
//     return new Promise((resolve, reject) => {
//         if(module.exports.is_following(user, username)){
//             resolve({
//                 "n": 1,
//                 "nModified": 0,
//                 "ok": 1
//             })
//         }else{
//             user.following.push(username)
//             User.updateOne({username: user.username}, {following: user.following})
//             .then((res) => {
//                 resolve(res)
//             }).catch((err) => {
//                 reject(err)
//             })
//         }
//     })
// }


// /**
//  * 
//  * @param {User} user 
//  * @param {string} username 
//  * @returns {
//                 "userfollower": {
//                     "n": 1,
//                     "nModified": 1,
//                     "ok": 1
//                 }
//             }
//  */
// user.follower = (user, username) => {
//     return new Promise((resolve, reject) => {
//         if(module.exports.is_followed(user, username)){
//             resolve({
//                 "n": 1,
//                 "nModified": 0,
//                 "ok": 1
//             })
//         }else{
//             user.follower.push(username)
//             User.updateOne({username: user.username}, {follower: user.follower})
//             .then((res) => {
//                 resolve(res)
//             }).catch((err) => {
//                 reject(err)
//             })
//         }
//     })
// }

// user.star = (user, slug) => {
//     return new Promise((resolve, reject) => {
//         if(module.exports.is_stared(user, slug)){
//             resolve({
//                 "n": 1,
//                 "nModified": 0,
//                 "ok": 1
//             })
//         }else{
//             user.star.push(slug)
//             User.updateOne({username: user.username}, {star: user.star})
//             .then((res) => {
//                 resolve(res)
//             }).catch((err) => {
//                 reject(err)
//             })
//         }
//     })
// }

// /**
//  * 
//  * @param {User} user 
//  * @param {string} username 
//  * @returns {
//                 "userfollowing": {
//                     "n": 1,
//                     "nModified": 1,
//                     "ok": 1
//                 }
//             }
//  */
// user.unfollowing = (user, username) => {
//     return new Promise((resolve, reject) => {
//         if(!module.exports.is_following(user, username)){
//             resolve({
//                 "n": 1,
//                 "nModified": 0,
//                 "ok": 1
//             })
//         }else{
//             user.following = user.following.filter(item => item!=username)
//             User.updateOne({username: user.username}, {following: user.following})
//             .then((res) => {
//                 resolve(res)
//             }).catch((err) => {
//                 reject(err)
//             })
//         }
//     })
// }

// /**
//  * 
//  * @param {User} user 
//  * @param {string} username 
//  * @returns {
//                 "userfollower": {
//                     "n": 1,
//                     "nModified": 1,
//                     "ok": 1
//                 }
//             }
//  */
// user.unfollower = (user, username) => {
//     return new Promise((resolve, reject) => {
//         if(!module.exports.is_followed(user, username)){
//             resolve({
//                 "n": 1,
//                 "nModified": 0,
//                 "ok": 1
//             })
//         }else{
//             user.follower = user.follower.filter(item => item!=username)
//             User.updateOne({username: user.username}, {follower: user.follower})
//             .then((res) => {
//                 resolve(res)
//             }).catch((err) => {
//                 reject(err)
//             })
//         }
//     })
// }
            
// user.unstar = (user, slug) => {
//     return new Promise((resolve, reject) => {
//         if(!module.exports.is_stared(user, slug)){
//             resolve({
//                 "n": 1,
//                 "nModified": 0,
//                 "ok": 1
//             })
//         }else{
//             user.star = user.star.filter(item => item!=slug)
//             User.updateOne({username: user.username}, {star: user.star})
//             .then((res) => {
//                 resolve(res)
//             }).catch((err) => {
//                 reject(err)
//             })
//         }
//     })
// }

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
        query += ') returning *;'

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
        if (user.status) {
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
        query += ' where username = $' + num + ' returning *'
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



// user.is_following = (user, username) => {
//     return user.following.includes(username)
// }

// user.is_followed = (user, username) => {
//     return user.follower.includes(username)
// }

// user.is_stared = (user, slug) => {
//     return user.star.includes(slug)
// }

module.exports = user