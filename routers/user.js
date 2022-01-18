const express = require('express')

const UserController = require('../controllers/UserController')
const HistoryController = require('../controllers/HistoryController')
const NotifyController = require('../controllers/NotifyController')
const utils = require('../utils/utils')
const encrypt = require('../middlewares/encrypt')
const auth = require('../middlewares/auth')
const constants = require('../configs/constants')
const message = require('../configs/messages')
const mail = require('../middlewares/mail')

const router = express.Router()

/**
 * Cập nhật trạng thái tài khoản thành đã xác thực
 */
router.get('/verify-email/:username', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    const token = req.query.token

    try{
        if (!token) {
            return res.status(400).json({message: message.auth.token_invalid})
        } else {
            var data = await UserController.get_data_from_token(token)
            if (data.username && data.email 
                && user.username == data.username && user.email == data.email) {
                    user = await UserController.verify_email(data.username)
                    return res.status(200).json({message: message.user.email_veified})
            } else {
                return res.status(404).json({message: message.user.not_found})
            }
        }
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

/**
 * Lấy thông tin user gồm username, avatar, status, email
 */
router.get('/info/:username', async (req, res, next) => {
    let username = req.params.username
    var user
    try {
        if (username) {
            user = await UserController.get(username)
            if (user) res.status(200).json({user: user})
            else res.status(404).json({message: message.user.not_found})
        } else {
            res.status(400).json({message: message.user.missing_username})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

/**
 * Lấy danh sách các sách mà user đang follow
 */
router.get('/book-following/:username', auth.verifyUser, async (req, res, next) => {
    let username = req.user.username
    var books
    try {
        if (!username) {
            res.status(400).json({message: message.user.missing_username})
        } else {
            books = await UserController.get_book_following(username)
            res.status(200).json({books: books})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

/**
 * Lịch sử comment của user
 */
router.get('/comment-history/:username', auth.verifyAdmin, async (req, res, next) => {
    let username = req.params.username
    var comments
    try {
        if (!username) {
            res.status(400).json({message: message.user.missing_username})
        } else {
            comments = await UserController.get_comment_history(username)
            res.status(200).json({comments: comments})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

/**
 * Lịch sử xem của user
 */
router.get('/history/:username', auth.verifyUser, async (req, res, next) => {
    let username = req.user.username
    var books
    try {
        if (!username) {
            res.status(400).json({message: message.user.missing_username})
        } else {
            books = await HistoryController.list(username)
            res.status(200).json({books: books})
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
            user = await UserController.login(user.username, user.password)
            if (user) {
                user.password = ''
                
                /**
                 * ... jwt.sign(user, ...
                 * ERROR: Expected \"payload\" to be a plain object.
                 * SOLVE: change oject user to json 
                 * ... jwt.sign({user}, ...
                 */
                const accessToken = utils.generateAccessToken(user)
                res.status(200).json({
                    accessToken: accessToken,
                    user: user
                })
            } else {
                return res.status(500).json({messsage: message.user.incorrect_account})
            }
        }
    }catch (err){
        res.status(500).json({message: err.message})
    }
})


/**
 * Đăng kí tài khoản, trả về message đăng kí thàn công hay thất bại
 * @body user: {username, password, email, (avatar)}
 */
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
            if (user) return res.status(200).json({message: message.user.registed_success})
            else return res.status(500).json({message: message.user.registed_fail})
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

/**
 * Gửi email xác thực
 */
router.post('/verify-email/:username', auth.verifyUser, async (req, res, next) => {
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

/**
 * follow sách
 */
router.post('/follow-book/:book_endpoint/:username', auth.verifyUser, async (req, res, next) => {
    var obj = {
        username: req.user.username,
        book_endpoint: req.params.book_endpoint
    }
    try{
        if (!obj.username) {
            return res.status(400).json({message: message.user.missing_username})
        } if (!obj.book_endpoint) {
            return res.status(400).json({message: message.book.missing_endpoint})
        } else {
            obj = await UserController.follow_book(obj.book_endpoint, obj.username)
            return res.status(200).json({message: message.user.followed_book})
        }
    }catch (err){
        if (err.constraint){
            switch (err.constraint) {
                case 'book_follows_pk': {
                    res.status(400).json({message: message.user.book_follows_pk})
                    break
                }
                case 'book_fk': {
                    res.status(400).json({message: message.user.book_fk})
                    break
                }
                case 'username_fk': {
                    res.status(400).json({message: message.user.username_fk})
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

router.post('/unfollow-book/:book_endpoint/:username', auth.verifyUser, async (req, res, next) => {
    var obj = {
        username: req.user.username,
        book_endpoint: req.params.book_endpoint
    }
    try{
        if (!obj.username) {
            return res.status(400).json({message: message.user.missing_username})
        } if (!obj.book_endpoint) {
            return res.status(400).json({message: message.book.missing_endpoint})
        } else {
            obj = await UserController.unfollow_book(obj.book_endpoint, obj.username)
            return res.status(200).json({message: message.user.unfollowed_book})
        }
    }catch (err){
        if (err.constraint){
            switch (err.constraint) {
                case 'book_follows_pk': {
                    res.status(400).json({message: message.user.book_follows_pk})
                    break
                }
                case 'book_fk': {
                    res.status(400).json({message: message.user.book_fk})
                    break
                }
                case 'username_fk': {
                    res.status(400).json({message: message.user.username_fk})
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

/**
 * ban user
 */
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
            NotifyController.add(notify)
        } else {
            res.status(404).json({message: message.user.not_found})
        }
        return res.status(200).json({user: user})
    }catch (err){
        if (err.constraint){
            switch (err.constraint) {
                case 'account_pk': {
                    res.status(400).json({message: message.user.account_pk})
                    break
                }
                case 'notify_pk': {
                    return res.status(200).json({user: user})
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
            NotifyController.add(notify)
        } else {
            res.status(404).json({message: message.user.not_found})
        }
        return res.status(200).json({user: user})
    }catch (err){
        res.status(500).json({message: err.message})
    }
})

router.patch('/:username', auth.verifyUser, async (req, res, next) => {
    var user = {
        username: req.params.username,
        email: req.body.email,
        avatar: req.body.avatar
    }

    try{
        user = await UserController.update(user)
        return res.status(200).json({user: user})
    }catch (err){
        return res.status(500).json({message: err.message})
    }
})

router.patch('/up-role/:username', auth.verifyAdmin, async (req, res, next) => {
    var user = {
        username: req.params.username,
        role: '1'
    }

    try{
        user = await UserController.update(user)
        return res.status(200).json({user: user})
    }catch (err){
        return res.status(500).json({message: err.message})
    }

})

router.patch('/change-password/:username', auth.verifyUser, encrypt.hash, async (req, res, next) => {
    var user = {
        username: req.params.username,
        password: req.body.password
    }

    try{
        if (!user.password) {
            return res.status(400).json({message: message.user.missing_password})
        } else {
            user = await UserController.update(user)
            return res.status(200).json({user: user})
        }
    }catch (err){
        return res.status(500).json({message: err.message})
    }
})

router.delete('/:username', auth.verifyUser, async (req, res, next) => {
    var user = {
        username: req.params.username
    }

    try{
        if (!user.username) {
            return res.status(400).json({message: message.user.missing_username})
        } else {
            user = await UserController.delete(user.username)
            if (user) return res.status(200).json({user: user})
            else return res.status(404).json({message: message.user.not_found})
        }
    }catch (err){
        return res.status(500).json({message: err.message})
    }
})

router.delete('/history/all/:username', auth.verifyUser, async (req, res, next) => {
    var history = {
        username: req.user.username
    }

    try{
        if (!history.username) {
            return res.status(400).json({message: message.user.missing_username})
        } else {
            history = await HistoryController.delete_all(history)
            if (history && history.length > 0) return res.status(200).json({message: message.history.delete_all})
            else return res.status(404).json({message: message.history.not_found})
        }
    }catch (err){
        return res.status(500).json({message: err.message})
    }
})

router.delete('/history/single/:username', auth.verifyUser, async (req, res, next) => {
    var history = {
        book_endpoint: req.body.book_endpoint,
        username: req.user.username
    }

    try{
        if (!history.username) {
            return res.status(400).json({message: message.user.missing_username})
        } else if (!history.book_endpoint) {
            return res.status(400).json({message: message.book.missing_endpoint})
        } else {
            history = await HistoryController.delete(history)
            if (history) return res.status(200).json({message: message.history.delete_success})
            else return res.status(404).json({message: message.history.not_found})
        }
    }catch (err){
        return res.status(500).json({message: err.message})
    }
})

module.exports = router