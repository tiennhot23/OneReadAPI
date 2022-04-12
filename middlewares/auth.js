const jwt = require('jsonwebtoken')

const UserModule = require('../modules/UserModule')
const message = require('../configs/messages')
const utils = require('../utils/utils')

const auth = {}

auth.verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return utils.onResponse(res, 'fail', 401, message.auth.unauthorized, null, null)

    jwt.verify(token, process.env.ACCESSTOKEN, async (err, ress) => {
        if (err) return utils.onResponse(res, 'fail', 401, message.auth.token_invalid, null, null) 
        var user = ress.user
        if (!(user.username && await UserModule.get(user.username))) return utils.onResponse(res, 'fail', 404, message.user.not_found, null, null) 
        if (user.role && user.role < 0) 
            return utils.onResponse(res, 'fail', 403, message.auth.forbidden, null, null) 
            
        req.user = user
        next()
    })
}

auth.verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return utils.onResponse(res, 'fail', 401, message.auth.unauthorized, null, null)

    jwt.verify(token, process.env.ACCESSTOKEN, async (err, ress) => {
        if (err) return utils.onResponse(res, 'fail', 401, message.auth.token_invalid, null, null) 
        var user = ress.user
        if (!(user.username && await UserModule.get(user.username))) return utils.onResponse(res, 'fail', 404, message.user.not_found, null, null) 
        if (user.role && user.role < 1) 
            return utils.onResponse(res, 'fail', 403, message.auth.forbidden, null, null) 
        req.user = user
        next()
    })
}


module.exports = auth