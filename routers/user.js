const express = require('express')
const multer = require('multer')

const UserController = require('../controllers/UserController')
const HistoryController = require('../controllers/HistoryController')
const NotifyController = require('../controllers/NotifyController')
const FileController = require('../controllers/FileController')
const utils = require('../utils/utils')
const encrypt = require('../middlewares/encrypt')
const auth = require('../middlewares/auth')
const constants = require('../configs/constants')
const message = require('../configs/messages')
const mail = require('../middlewares/mail')
const { memoryStorage } = require('multer')

const router = express.Router()
const upload = multer({
    storage: memoryStorage()
})

/**
 * Cập nhật trạng thái tài khoản thành đã xác thực
 */
router.get('/verify-email/:username', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    const token = req.query.token

    try {
        if (!token) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.auth.token_invalid,
                data: null
            })
        } else {
            var data = await UserController.get_data_from_token(token)
            if (data.username && data.email &&
                user.username == data.username && user.email == data.email) {
                user = await UserController.verify_email(data.username)
                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: message.user.email_veified,
                    data: null
                })
            } else {
                return res.status(404).json({
                    status: 'fail',
                    code: 404,
                    message: message.user.not_found,
                    data: null
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
            if (user) res.status(200).json({
                status: 'success',
                code: 200,
                message: null,
                data: [user]
            })
            else res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.user.not_found,
                data: null
            })
        } else {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            books = await UserController.get_book_following(username)
            res.status(200).json({
                status: 'success',
                code: 200,
                message: null,
                data: books
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            comments = await UserController.get_comment_history(username)
            res.status(200).json({
                status: 'success',
                code: 200,
                message: null,
                data: comments
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            books = await HistoryController.list(username)
            res.status(200).json({
                status: 'success',
                code: 200,
                message: null,
                data: books
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})



router.post('/login', async (req, res, next) => {
    var user = req.body

    try {
        if (!user.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else if (!user.password) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_password,
                data: null
            })
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
                    status: 'success',
                    code: 200,
                    message: message.user.login_success,
                    data: [{
                        accessToken: accessToken,
                        user: user
                    }]
                })
            } else {
                return res.status(500).json({
                    status: 'fail',
                    code: 500,
                    messsage: message.user.incorrect_account,
                    data: null
                })
            }
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})


/**
 * Đăng kí tài khoản, trả về message đăng kí thàn công hay thất bại
 * @body user: {username, password, email, (avatar)}
 */
router.post('/register', encrypt.hash, async (req, res, next) => {
    var user = req.body

    try {
        if (!user.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else if (!user.password) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_password,
                data: null
            })
        } else if (!user.email) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_email,
                data: null
            })
        } else {
            user = await UserController.add(user)
            if (user) return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.user.registed_success,
                data: null
            })
            else return res.status(500).json({
                status: 'fail',
                code: 500,
                message: message.user.registed_fail,
                data: null
            })
        }
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'account_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.account_pk,
                        data: null
                    })
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.status_constraint,
                        data: null
                    })
                    break
                }
                case 'role_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.role_constraint,
                        data: null
                    })
                    break
                }
                case 'Account_email_key': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.email_exist,
                        data: null
                    })
                    break
                }
                default: {
                    res.status(500).json({
                        status: 'fail',
                        code: 500,
                        message: err.message,
                        data: null
                    })
                    break
                }
            }
        } else {
            res.status(500).json({
                status: 'fail',
                code: 500,
                message: err.message,
                data: null
            })
        }
    }
})

/**
 * Gửi email xác thực
 */
router.post('/verify-email/:username', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    try {
        if (!user.username || !req.body.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            // token = bcrypt.hashSync(username, constants.saltRounds)
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            mail.sendVerification(user.email, constants.baseURL + 'user/verify-email?token=' + token)
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.auth.verify_email,
                data: null
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
    try {
        if (!obj.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        }
        if (!obj.book_endpoint) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.book.missing_endpoint,
                data: null
            })
        } else {
            obj = await UserController.follow_book(obj.book_endpoint, obj.username)
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.user.followed_book,
                data: null
            })
        }
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'book_follows_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.book_follows_pk,
                        data: null
                    })
                    break
                }
                case 'book_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.book_fk,
                        data: null
                    })
                    break
                }
                case 'username_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.username_fk,
                        data: null
                    })
                    break
                }
                default: {
                    res.status(500).json({
                        status: 'fail',
                        code: 500,
                        message: err.message,
                        data: null
                    })
                    break
                }
            }
        } else res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

router.post('/unfollow-book/:book_endpoint/:username', auth.verifyUser, async (req, res, next) => {
    var obj = {
        username: req.user.username,
        book_endpoint: req.params.book_endpoint
    }
    try {
        if (!obj.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        }
        if (!obj.book_endpoint) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.book.missing_endpoint,
                data: null
            })
        } else {
            obj = await UserController.unfollow_book(obj.book_endpoint, obj.username)
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.user.unfollowed_book,
                data: null
            })
        }
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'book_follows_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.book_follows_pk,
                        data: null
                    })
                    break
                }
                case 'book_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.book_fk,
                        data: null
                    })
                    break
                }
                case 'username_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.username_fk,
                        data: null
                    })
                    break
                }
                default: {
                    res.status(500).json({
                        status: 'fail',
                        code: 500,
                        message: err.message,
                        data: null
                    })
                    break
                }
            }
        } else res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
    try {
        if (user.username == req.user.username) {
            return res.status(403).json({
                status: 'fail',
                code : 403,
                message: message.user.can_not_ban_user,
                data: null
            })
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
            res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.user.not_found,
                data: null
            })
        }
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            data: [user]
        })
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'account_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.account_pk,
                        data: null
                    })
                    break
                }
                case 'notify_pk': {
                    return res.status(200).json({
                        status: 'success',
                        code: 200,
                        message: message.user.user_banned,
                        data: [user]
                    })
                    break
                }
                case 'role_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.role_constraint
                    })
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.user.status_constraint,
                        data: null
                    })
                    break
                }
                default: {
                    res.status(500).json({
                        status: 'fail',
                        code: 500,
                        message: err.message,
                        data: null
                    })
                    break
                }
            }
        } else res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

router.post('/unban/:username', auth.verifyAdmin, async (req, res, next) => {
    var user = {
        username: req.params.username,
        status: '0'
    }
    try {
        if (user.username == req.user.username) {
            return res.status(403).json({
                status: 'fail',
                code: 403,
                message: message.user.can_not_unban_user,
                data: null
            })
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
            res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.user.not_found,
                data: null
            })
        }
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: message.user.user_unbanned,
            data: [user]
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

router.patch('/:username', auth.verifyUser, upload.any('avatar'), async (req, res, next) => {
    var user = {
        username: req.params.username,
        email: req.body.email,
        avatar: req.body.avatar
    }

    if (req.files && req.files.length > 0 && req.files[0].fieldname == 'avatar') {
        user.avatar = await FileController.upload_single(req.files[0], 'avatar/')
    }

    try {
        user = await UserController.update(user)
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: message.user.update_success,
            data: [user]
        })
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

router.patch('/up-role/:username', auth.verifyAdmin, async (req, res, next) => {
    var user = {
        username: req.params.username,
        role: '1'
    }

    try {
        user = await UserController.update(user)
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: message.user.update_success,
            data: [user]
        })
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }

})

router.patch('/change-password/:username', auth.verifyUser, encrypt.hash, async (req, res, next) => {
    var user = {
        username: req.params.username,
        password: req.body.password
    }

    try {
        if (!user.password) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_password,
                data: null
            })
        } else {
            user = await UserController.update(user)
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.user.password_updated,
                data: [user]
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

router.delete('/:username', auth.verifyUser, async (req, res, next) => {
    var user = {
        username: req.params.username
    }

    try {
        if (!user.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            user = await UserController.delete(user.username)
            if (user) return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.user.delete_success,
                data: [user]
            })
            else return res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.user.not_found,
                data: null
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

router.delete('/history/all/:username', auth.verifyUser, async (req, res, next) => {
    var history = {
        username: req.user.username
    }

    try {
        if (!history.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            history = await HistoryController.delete_all(history)
            if (history && history.length > 0) return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.history.delete_all,
                data: null
            })
            else return res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.history.not_found,
                data: null
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

router.delete('/history/single/:username', auth.verifyUser, async (req, res, next) => {
    var history = {
        book_endpoint: req.body.book_endpoint,
        username: req.user.username
    }

    try {
        if (!history.username) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else if (!history.book_endpoint) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.book.missing_endpoint,
                data: null
            })
        } else {
            history = await HistoryController.delete(history)
            if (history) return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.history.delete_success,
                data: null
            })
            else return res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.history.not_found,
                data: null
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

module.exports = router