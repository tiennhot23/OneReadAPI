const conn = require('../connection')

const db = {}

db.begin = () => {
    return new Promise((resolve, reject) => {
        conn.query('begin transaction', (err, res) => {
            if (err) return reject(err)
            return resolve(res)
        })
    })
}

db.commit = () => {
    return new Promise((resolve, reject) => {
        conn.query('commit', (err, res) => {
            if (err) return reject(err)
            return resolve(res)
        })
    })
}

db.rollback = () => {
    return new Promise((resolve, reject) => {
        conn.query('rollback', (err, res) => {
            if (err) return reject(err)
            return resolve(res)
        })
    })
}

module.exports = db