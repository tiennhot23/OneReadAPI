const jwt = require('jsonwebtoken')

const message = require('../configs/messages')

const auth = {}

auth.verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // if (!authHeader || !authHeader.split(' ')[1]) return res.sendStatus(401)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({
        status: 'fail',
        code: 401,
        message: message.auth.unauthorized,
        data: null
    })

    jwt.verify(token, process.env.ACCESSTOKEN, (err, ress) => {
        if (err) return res.status(400).json({
            status: 'fail',
            code: 400,
            message: message.auth.token_invalid,
            data: null
        })
        var user = ress.user
        if (req.params.username && req.params.username != user.username) 
            return res.status(403).json({
                status: 'fail',
                code: 403,
                message: message.auth.forbidden,
                data: null
            })
        req.user = user
        next()
    })
}

auth.verifyAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization']
    // if (!authHeader || !authHeader.split(' ')[1]) return res.sendStatus(401)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).json({
        status: 'fail',
        code: 401,
        message: message.auth.unauthorized,
        data: null
    })

    jwt.verify(token, process.env.ACCESSTOKEN, (err, ress) => {
        if (err) return res.status(400).json({
            status: 'fail',
            code: 400,
            message: message.auth.token_invalid,
            data: null
        })
        var user = ress.user
        if (user.role < 1) 
            return res.status(403).json({
                status: 'fail',
                code: 403,
                message: message.auth.forbidden,
                data: null
            })
        req.user = user
        next()
    })
}

module.exports = auth