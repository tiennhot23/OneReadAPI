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

module.exports = user


