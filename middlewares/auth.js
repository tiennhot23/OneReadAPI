const jwt = require('jsonwebtoken')

const message = require('../configs/messages')
const utils = require('../utils/utils')

const auth = {}

auth.verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return utils.onResponse(res, 'fail', 401, message.auth.unauthorized, null, null)

    jwt.verify(token, process.env.ACCESSTOKEN, (err, ress) => {
        if (err) return utils.onResponse(res, 'fail', 400, message.auth.token_invalid, null, null) 
        var user = ress.user
        if (isUser(user) && user.role < 0) 
            return utils.onResponse(res, 'fail', 403, message.auth.forbidden, null, null) 
            
        req.user = user
        next()
    })
}

auth.verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return utils.onResponse(res, 'fail', 401, message.auth.unauthorized, null, null)

    jwt.verify(token, process.env.ACCESSTOKEN, (err, ress) => {
        if (err) return utils.onResponse(res, 'fail', 400, message.auth.token_invalid, null, null) 
        var user = ress.user
        if (isUser(user) && user.role < 1) 
            return utils.onResponse(res, 'fail', 403, message.auth.forbidden, null, null) 
        req.user = user
        next()
    })
}

function isUser(user) {
    return user.username && user.role
}

module.exports = auth