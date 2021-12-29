const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const UserController = require('../controllers/UserController')
const TokenController = require('../controllers/TokenController')
const NotifyController = require('../controllers/NotifyController')
const upload = require('../middlewares/upload')
const encrypt = require('../middlewares/encrypt')
const auth = require('../middlewares/auth')
const constants = require('../configs/constants')
const message = require('../configs/messages')
const mail = require('../middlewares/mail')

const router = express.Router()

router.get('/verify-email', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    const token = req.query.token

    try{
        // if(!bcrypt.compareSync(user.username, token)){
        //     return res.status(404).json({message: message.auth.token_invalid})
        // }else{
        //     return res.status(404).json({message: message.user.email_veified})
        // }

        var data = await UserController.get_data_from_token(token)
        if (data.username && data.email 
            && user.username == data.username && user.email == data.email) {
                user = await UserController.verify_email(data.username)
                return res.status(200).json({message: message.user.email_veified})
        } else {
            return res.status(404).json({message: message.user.not_found})
        }
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

router.get('/info/:username', async (req, res, next) => {
    let username = req.params.username
    var user
    try {
        if (username) {
            user = await UserController.get(username)
            if (user) res.status(200).json(user)
            else res.status(404).json({message: message.user.not_found})
        } else {
            res.status(400).json({message: message.user.missing_username})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/login', async (req, res, next) => {
    var user = req.body

    try{
        if(!user.username){
            return res.status(400).json({message: message.user.missing_username})
        } else if (!user.password) {
            return res.status(400).json({message: message.user.missing_password})
        } else {
            user = await UserController.get(user.username, user.password)
            if (user) {
                user.password = ''
                
                /**
                 * ... jwt.sign(user, ...
                 * ERROR: Expected \"payload\" to be a plain object.
                 * SOLVE: change oject user to json 
                 * ... jwt.sign({user}, ...
                 */
                const accessToken = jwt.sign({user}, process.env.ACCESSTOKEN, { expiresIn: '1d'})
                res.status(200).json({
                    accessToken: accessToken,
                    data: user
                })
            } else {
                return res.status(500).json({messsage: message.user.incorrect_account})
            }
        }
    }catch (err){
        res.status(500).json({message: err.message})
    }
})


//TODO: code this
router.post('/logout', auth.verifyUser, async (req, res, next) => {
    try{
        res.status(200).json()
    }catch (err){
        res.status(500).json({message: err.message})
    }
})


router.post('/register', encrypt.hash, async (req, res, next) => {
    var user = req.body

    try{
        if(!user.username){
            return res.status(400).json({message: message.user.missing_username})
        } else if (!user.password) {
            return res.status(400).json({message: message.user.missing_password})
        } else if (!user.email) {
            return res.status(400).json({message: message.user.missing_email})
        } else {
            user = await UserController.add(user)
            return res.status(200).json(user)
        }
    }catch (err){
        if (err.constraint){
            switch (err.constraint) {
                case 'account_pk': {
                    res.status(400).json({message: message.user.account_pk})
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({message: message.user.status_constraint})
                    break
                }
                case 'role_constraint': {
                    res.status(400).json({message: message.user.role_constraint})
                    break
                }
                case 'Account_email_key': {
                    res.status(400).json({message: message.user.email_exist})
                    break
                }
                default:{
                    res.status(500).json({message: err.message})
                    break
                }
            }
        } else {
            res.status(500).json({message: err.message})
        }
    }
})

router.post('/verify-email', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    try{
        if(!user.username || !req.body.username){
            return res.status(400).json({message: message.user.missing_username})
        } else {
            // token = bcrypt.hashSync(username, constants.saltRounds)
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            mail.sendVerification(user.email, constants.baseURL + 'user/verify-email?token=' + token)
            return res.status(200).json({message: message.auth.verify_email})
        }
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

router.post('/ban/:username', auth.verifyAdmin, async (req, res, next) => {
    var user = {
        username: req.params.username,
        status: '-1'
    }
    try{
        if (user.username == req.user.username) {
            return res.status(403).json({message: message.user.can_not_ban_user})
        }
        user = await UserController.update(user)
        if (user) {
            let notify = {
                endpoint: `*ban*${user.username}`,
                username: user.username,
                content: message.notify.ban_notication
            }
            await NotifyController.add(notify)
        } else {
            res.status(404).json({message: message.user.not_found})
        }
        return res.status(200).json(user)
    }catch (err){
        if (err.constraint){
            switch (err.constraint) {
                case 'account_pk': {
                    res.status(400).json({message: message.user.account_pk})
                    break
                }
                case 'notify_pk': {
                    return res.status(200).json(user)
                    break
                }
                case 'role_constraint': {
                    res.status(400).json({message: message.user.role_constraint})
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({message: message.user.status_constraint})
                    break
                }
                default: {
                    res.status(500).json({message: err.message})
                    break
                }
            }
        } else res.status(500).json({message: err.message})
    }
})

router.post('/unban/:username', auth.verifyAdmin, async (req, res, next) => {
    var user = {
        username: req.params.username,
        status: '0'
    }
    try{
        if (user.username == req.user.username) {
            return res.status(403).json({message: message.user.can_not_unban_user})
        }
        user = await UserController.update(user)
        if (user) {
            let notify = {
                endpoint: `*unban*${user.username}`,
                username: user.username,
                content: message.notify.unban_notification
            }
            await NotifyController.add(notify)
        } else {
            res.status(404).json({message: message.user.not_found})
        }
        return res.status(200).json(user)
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

router.patch('/:username', async (req, res, next) => {
    var user = {
        username: req.params.username,
        email: req.body.email,
        avatar: req.body.avatar
    }

    try{
        user = await UserController.update(user)
        return res.status(200).json(user)
    }catch (err){
        return res.status(500).json({message: err.message})
    }
})

router.patch('/up-role/:username', async (req, res, next) => {
    var user = {
        username: req.params.username,
        role: req.body.role
    }

    try{
        if (!user.role) {
            return res.status(400).json({message: message.user.missing_role})
        } else {
            user = await UserController.update(user)
            return res.status(200).json(user)
        }
    }catch (err){
        return res.status(500).json({message: err.message})
    }

})

router.patch('/change-password/:username', encrypt.hash, async (req, res, next) => {
    var user = {
        username: req.params.username,
        password: req.body.password
    }

    try{
        if (!user.password) {
            return res.status(400).json({message: message.user.missing_password})
        } else {
            user = await UserController.update(user)
            return res.status(200).json(user)
        }
    }catch (err){
        return res.status(500).json({message: err.message})
    }
})



// router.post('/follow-user', auth.verifyuser, async (req, res, next) => {
//     const username = req.body.username
//     var currentuser = await UserController.get_user(req.user.user.username)
//     if(!username) return res.status(400).json({message: message.user.not_found})
//     if(username === currentuser.username) return res.status(500).json({message: message.user.can_not_follow_user})
//     try{
//         var userfollower = await UserController.get_user(username)
//         if(!userfollower) return res.status(500).json({message: message.user.can_not_follow_user})
//         userfollower = await UserController.follower(userfollower, currentuser.username)
//         var userfollowing = await UserController.following(currentuser, username)
//         res.status(200).json({userfollower, userfollowing})
//     }catch(err){
//         res.status(500).json({message: err.message})
//     }
// })


// /**
//  * @body    {
//  *              "article-slug": slug of article star
//  *          }
//  * @returns {
//                 "user": {
//                     "n": number of document found
//                     "nModified": number of document has been modified
//                     "ok": 1 (success), 0 (fail)
//                 },
//                 "article": {
//                     "n": 1,
//                     "nModified": 1,
//                     "ok": 1
//                 }
//             }
//  */
// router.post('/star-article', auth.verifyuser, async (req, res, next) => {
//     const slug = req.body.slug
//     var currentuser = await UserController.get_user(req.user.user.username)
//     if(!slug) return res.status(400).json({message: message.Article.not_found})
//     try{
//         var user = await UserController.star(currentuser, slug)
//         if(user.nModified == 0) return res.status(200).json({message: message.Article.stared})
//         var article = await ArticleController.get_one(slug)
//         article = await ArticleController.star(article)
//         res.status(200).json({user, article})
//     }catch(err){
//         res.status(500).json({message: err.message})
//     }
// })

// /**
//  * @body    {
//  *              "username": username of unfollowed user
//  *          }
//  * @returns {
//                 "userfollower": {
//                     "n": number of document found
//                     "nModified": number of document has been modified
//                     "ok": 1 (success), 0 (fail)
//                 },
//                 "userfollowing": {
//                     "n": 1,
//                     "nModified": 1,
//                     "ok": 1
//                 }
//             }
//  */
// router.post('/unfollow-user', auth.verifyuser, async (req, res, next) => {
//     const username = req.body.username
//     var currentuser = await UserController.get_user(req.user.user.username)
//     if(!username) return res.status(400).json({message: message.user.not_found})
//     if(username === currentuser.username) return res.status(500).json({message: message.user.can_not_unfollow_user})
//     try{
//         var userfollower = await UserController.get_user(username)
//         if(!userfollower) return res.status(500).json({message: message.user.can_not_unfollow_user})
//         userfollower = await UserController.unfollower(userfollower, currentuser.username)
//         var userfollowing = await UserController.unfollowing(currentuser, username)
//         res.status(200).json({userfollower, userfollowing})
//     }catch(err){
//         res.status(500).json({message: err.message})
//     }
// })
            
            
//             /**
//              * @body    {
//              *              "article-slug": slug of article unstar
//              *          }
//              * @returns {
//                             "user": {
//                                 "n": number of document found
//                                 "nModified": number of document has been modified
//                                 "ok": 1 (success), 0 (fail)
//                             },
//                             "article": {
//                                 "n": 1,
//                                 "nModified": 1,
//                                 "ok": 1
//                             }
//                         }
//              */
// router.post('/unstar-article', auth.verifyuser, async (req, res, next) => {
//     const slug = req.body.slug
//     var currentuser = await UserController.get_user(req.user.user.username)
//     if(!slug) return res.status(400).json({message: message.Article.not_found})
//     try{
//         var user = await UserController.unstar(currentuser, slug)
//         if(user.nModified == 0) return res.status(200).json({message: message.Article.not_stared})
//         var article = await ArticleController.get_one(slug)
//         article = await ArticleController.unstar(article)
//         res.status(200).json({user, article})
//     }catch(err){
//         res.status(500).json({message: err.message})
//     }
// })

module.exports = router