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

function onResponse(res, status, code, message, page, data) {
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

function onCatchError(err, res) {
    if (err.constraint) {
        switch (err.constraint) {
            case 'account_pk': {
                onResponse(res, 'fail', 400, message.user.account_pk, null, null)
                break
            }
            case 'status_constraint': {
                onResponse(res, 'fail', 400, message.user.status_constraint, null, null)
                break
            }
            case 'role_constraint': {
                onResponse(res, 'fail', 400, message.user.role_constraint, null, null)
                break
            }
            case 'Account_email_key': {
                onResponse(res, 'fail', 400, message.user.email_exist, null, null)
                break
            }
            case 'book_follows_pk': {
                onResponse(res, 'fail', 400, message.user.book_follows_pk, null, null)
                break
            }
            case 'book_fk': {
                onResponse(res, 'fail', 400, message.user.book_fk, null, null)
                break
            }
            case 'username_fk': {
                onResponse(res, 'fail', 400, message.user.username_fk, null, null)
                break
            }
            default: {
                onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else onResponse(res, 'fail', 500, err.message, null, null)
}

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
            onResponse(res, 'fail', 400, message.auth.token_invalid, null, null)
        } else {
            var data = await UserController.get_data_from_token(token)
            if (data.username && data.email &&
                user.username == data.username && user.email == data.email) {
                user = await UserController.verify_email(data.username)
                onResponse(res, 'success', 200, message.user.email_veified, null, null)
            } else {
                onResponse(res, 'fail', 404, message.user.not_found, null, null)
            }
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null) 
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
            if (user) onResponse(res, 'success', 200, null, null, [user])
            else onResponse(res, 'fail', 404, message.user.not_found, null, null)
        } else {
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        } else {
            books = await UserController.get_book_following(username)
            onResponse(res, 'success', 200, null, null, books)
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
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
            onResponse(res, 'success', 200, null, null, comments)
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
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
            onResponse(res, 'success', 200, null, null, books)
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
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
            onResponse(res, 'success', 200, null, null, books)
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null) 
        } else if (!user.password) {
            onResponse(res, 'fail', 400, message.user.missing_password, null, null)
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
                onResponse(res, 'success', 200, message.user.login_success, null, [{
                    accessToken: accessToken,
                    user: user
                }])
            } else {
                onResponse(res, 'fail', 500, message.user.incorrect_account, null, null)
            }
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        } else if (!user.password) {
            onResponse(res, 'fail', 400, message.user.missing_password, null, null)
        } else if (!user.email) {
            onResponse(res, 'fail', 400, message.user.missing_email, null, null)
        } else {
            user = await UserController.add(user)
            if (user) onResponse(res, 'success', 200, message.user.registed_success, null, null)
            else onResponse(res, 'fail', 500, message.user.registed_fail, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null) 
        } else {
            // token = bcrypt.hashSync(username, constants.saltRounds)
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            mail.sendVerification(user.email, constants.baseURL + 'user/verify-email?token=' + token)
            onResponse(res, 'success', 200, message.auth.verify_email, null, null)
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        }
        if (!obj.book_endpoint) {
            onResponse(res, 'fail', 400, message.book.missing_endpoint, null, null)
        } else {
            obj = await UserController.follow_book(obj.book_endpoint, obj.username)
            onResponse(res, 'success', 200, message.user.followed_book, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        }
        if (!obj.book_endpoint) {
            onResponse(res, 'fail', 400, message.book.missing_endpoint, null, null)
        } else {
            obj = await UserController.unfollow_book(obj.book_endpoint, obj.username)
            onResponse(res, 'success', 200, message.user.unfollowed_book, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
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
            onResponse(res, 'fail', 403, message.user.can_not_ban_user, null, null)
        }
        user = await UserController.update(user)
        if (user) {
            let notify = {
                endpoint: `*ban*${user.username}`,
                username: user.username,
                content: message.notify.ban_notication
            }
            NotifyController.add(notify)
            onResponse(res, 'success', 200, message.user.user_banned, null, null)
        } else {
            onResponse(res, 'fail', 404, message.user.not_found, null, null)
        }
    } catch (err) {
        if (err.constants == 'notify_pk') {
            onResponse(res, 'success', 200, message.user.user_banned, null, [user])
        } else {
            onCatchError(err, res)
        }
       
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
            onResponse(res, 'fail', 403, message.user.can_not_unban_user, null, null)
        }
        user = await UserController.update(user)
        if (user) {
            let notify = {
                endpoint: `*unban*${user.username}`,
                username: user.username,
                content: message.notify.unban_notification
            }
            NotifyController.add(notify)
            onResponse(res, 'success', 200, message.user.user_unbanned, null, null)
        } else {
            onResponse(res, 'fail', 404, message.user.not_found, null, null)
        }
    } catch (err) {
        if (err.constants == 'notify_pk') {
            onResponse(res, 'success', 200, message.user.user_unbanned, null, [user])
        } else {
            onCatchError(err, res)
        }
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
        onResponse(res, 'success', 200, message.user.update_success, null, [user])
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
        onResponse(res, 'success', 200, message.user.update_success, null, null)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_password, null, null)
        } else {
            user = await UserController.update(user)
            onResponse(res, 'success', 200, message.user.password_updated, null, null)
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        } else {
            user = await UserController.delete(user.username)
            if (user) {
                FileController.delete('user/' + user.username + '/')
                onResponse(res, 'success', 200, message.user.delete_success, null, null)
            }
            else {
                onResponse(res, 'fail', 404, message.user.not_found, null, null)
            }
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        } else {
            history = await HistoryController.delete_all(history)
            if (history && history.length > 0) {
                onResponse(res, 'success', 200, message.history.delete_all, null, null)
            }
            else {
                onResponse(res, 'fail', 404, message.history.not_found, null, null)
            }
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
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
            onResponse(res, 'fail', 400, message.user.missing_username, null, null)
        } else if (!history.book_endpoint) {
            onResponse(res, 'fail', 400, message.book.missing_endpoint, null, null)
        } else {
            history = await HistoryController.delete(history)
            if (history) {
                onResponse(res, 'success', 200, message.history.delete_success, null, null)
            } else {
                onResponse(res, 'fail', 404, message.history.not_found, null, null)
            }
        }
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

module.exports = router