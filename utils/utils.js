const jwt = require('jsonwebtoken')

module.exports = {
    generateAccessToken: (user) => {
        /**
             * ... jwt.sign(user, ...
             * ERROR: Expected \"payload\" to be a plain object.
             * SOLVE: change oject user to json 
             * ... jwt.sign({user}, ...
             */
        return jwt.sign({user}, process.env.ACCESSTOKEN, { expiresIn: '365d'})
    },
    generateRefreshToken: (user) => {
        return jwt.sign({user}, process.env.REFRESHTOKEN)
    },
    get_endpoint: (title) => {
        try{
            return slugify(title, { lower: true, strict: true })
        }catch(e){
            return null
        }
    },
    parseQueryParamObjToJson(obj) {
        try {
            return JSON.parse(obj)
        } catch (ignored) {
            return {}
        }
    },
    onResponse(res, status, code, message, page, data) {
        if (page) {
            res.status(code).json({
                status: status,
                code: code,
                message: message,
                page: Number(page),
                data: data
            })
        } else {
            res.status(code).json({
                status: status,
                code: code,
                message: message,
                data: data
            })
        }
    }
}