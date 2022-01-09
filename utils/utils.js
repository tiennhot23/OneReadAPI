const jwt = require('jsonwebtoken')

module.exports = {
    generateAccessToken: (user) => {
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
    }
}