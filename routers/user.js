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
 * Xác thực token và cập nhật trang thái tài khoản thành đã xác thực email (status = 1)
 * @query token
 * @body
 * @return
 * data[]
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
 * Lấy thông tin gồm username, avatar, status, email của user
 * @query 
 * @body
 * @return
 * data[{username, avatar, status, email}]
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
 * @query 
 * @body
 * @return
 * data[{endpoint, title, author, thumb, theme, description, type,
    rating, rate_count, status, search_number}]
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
 * @query 
 * @body
 * @return
 * data[{id, username, endpoint, id_root, content, time, files}]
 */
router.get('/comment-history/:username', auth.verifyAdmin, async (req, res, next) => {
    let username = req.params.username
    var comments = []
    try {
        if (!username) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            var result = await UserController.get_comment_history(username)
            result.forEach(e => {
                comments.push({
                    id: e.id,
                    id_root: e.id_root,
                    endpoint: e.endpoint,
                    content: e.content,
                    files: e.files,
                    time: e.time,
                    user: {
                        username: e.username,
                        avatar: e.avatar
                    }
                })
            })
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
 * Lịch sủ các sách đã xem của user
 * @query 
 * @body
 * @return
 * data[book:{{endpoint, title, author, thumb, theme, description, type,
    rating, rate_count, status, search_number}, chapter {chapter_endpoint, title}, time}]
 */
router.get('/history/:username', auth.verifyUser, async (req, res, next) => {
    let username = req.user.username
    var books = []
    try {
        if (!username) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            var result = await HistoryController.list(username)
            var book = {
                endpoint: result[0].endpoint,
                title: result[0].title,
                author: result[0].author,
                thumb: result[0].thumb,
                theme: result[0].theme,
                description: result[0].description,
                type: result[0].type,
                rating: result[0].rating,
                rate_count: result[0].rate_count,
                status: result[0].status,
                search_number: result[0].search_number
            }
            var chapter = {
                chapter_endpoint: result[0].chapter_endpoint,
                title: result[0].chapter_title
            }
            books.push({book, chapter, time: result[0].time})
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
 * Lịch sử xem của 1 sách, chapter đọc gần đây nhất
 * @query 
 * @body
 * @return
 * data[book:{{endpoint, title, author, thumb, theme, description, type,
    rating, rate_count, status, search_number}, chapter {chapter_endpoint, title}, time}]
 */
router.get('/history/:book_endpoint/:username', auth.verifyUser, async (req, res, next) => {
    let username = req.user.username
    let book_endpoint = req.params.book_endpoint
    var books = []
    try {
        if (!username) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.user.missing_username,
                data: null
            })
        } else {
            var result = await HistoryController.get({
                book_endpoint: book_endpoint,
                username: username
            })
            if (result.length > 0) {
                var book = {
                    endpoint: result[0].endpoint,
                    title: result[0].title,
                    author: result[0].author,
                    thumb: result[0].thumb,
                    theme: result[0].theme,
                    description: result[0].description,
                    type: result[0].type,
                    rating: result[0].rating,
                    rate_count: result[0].rate_count,
                    status: result[0].status,
                    search_number: result[0].search_number
                }
                var chapter = {
                    chapter_endpoint: result[0].chapter_endpoint,
                    title: result[0].chapter_title
                }
                books.push({book, chapter, time: result[0].time})
            }
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
 * Đăng nhập
 * @query 
 * @body {username, password}
 * @return
 * data[{accesstoken, user: {username, avatar, status, email}}]
 */
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
 * Đăng kí tài khoản
 * @query 
 * @body {username, password, email}
 * @return
 * data[]
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
 * Gửi mail chứa link xác thực email
 * @query 
 * @body 
 * @return
 * data[]
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
 * Follow sách
 * @query 
 * @body 
 * @return
 * data[]
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

/**
 * Unfollow sách
 * @query 
 * @body 
 * @return
 * data[]
 */
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
 * Ban user và tự động thông báo tới user bị ban
 * @query 
 * @body 
 * @return
 * data[]
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
            message: message.user.user_banned,
            data: null
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

/**
 * Unban user và tự động thông báo tới user được ân xá
 * @query 
 * @body 
 * @return
 * data[]
 */
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
            data: null
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

/**
 * Cập nhật thông tin user gồm email hoặc avatar
 * @query 
 * @body {email, avatar file}
 * @return
 * data[]
 */
router.patch('/:username', auth.verifyUser, upload.any('avatar'), async (req, res, next) => {
    var user = {
        username: req.params.username,
        email: req.body.email
    }

    if (req.files && req.files.length > 0 && req.files[0].fieldname == 'avatar') {
        user.avatar = await FileController.upload_single(req.files[0], 
            'user/' + user.username + '/', 'avatar')
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

/**
 * Cập nhật role của tài khoản
 * @query 
 * @body 
 * @return
 * data[]
 */
router.patch('/change-role/:username', auth.verifyAdmin, async (req, res, next) => {
    var user = {
        username: req.params.username,
        role: req.body.role
    }

    try {
        user = await UserController.update(user)
        return res.status(200).json({
            status: 'success',
            code: 200,
            message: message.user.update_success,
            data: null
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

/**
 * Thay đổi password
 * @query 
 * @body {password}
 * @return
 * data[]
 */
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

/**
 * Xóa user cùng toàn bộ dữ liệu liên quan 
 * gồm lịch sử xem, comment , thông báo, sách theo dõi
 * @query 
 * @body 
 * @return
 * data[]
 */
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
            if (user) {
                FileController.delete('user/' + user.username + '/')
                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: message.user.delete_success,
                    data: null
                })
            }
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

/**
 * Xóa toàn bộ lịch sử xem của user
 * @query 
 * @body 
 * @return
 * data[]
 */
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

/**
 * Xóa lịch sử xem của một sách
 * @query 
 * @body 
 * @return
 * data[]
 */
router.delete('/history/single/:book_endpoint/:username', auth.verifyUser, async (req, res, next) => {
    var history = {
        book_endpoint: req.params.book_endpoint,
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