const bcrypt = require('bcrypt')

const constants = require('../configs/constants')
const message = require('../configs/messages')

const encrypt = {}

encrypt.hash = (req, res, next) => {
    var pwd = req.body.password
    if(!pwd || pwd.trim().length==0){
        return res.status(400).json({message: message.encypt.password_required})
    }
    try{
        req.body.password = bcrypt.hashSync(pwd, constants.saltRounds)
    }catch(err){
        return res.status(500).json({message: err.message})
    }
    
    next()
}

module.exports = encrypt