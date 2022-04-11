const BookModule = require('../modules/BookModule')
const UserModule = require('../modules/UserModule')
const HistoryModule = require('../modules/HistoryModule')
const ChapterModule = require('../modules/ChapterModule')
const NotifyModule = require('../modules/NotifyModule')
const FileModule = require('../modules/FileModule')
const utils = require('../utils/utils')
const constants = require('../configs/constants')
const message = require('../configs/messages')
const mail = require('../middlewares/mail')
const encrypt = require('../middlewares/encrypt')


const user = {}

class Err extends Error {
    constructor(message, code) {
      super(message);
      this.message = message;
      this.code = code;
    }
}

function onCatchError(err, res) {
    if (err.constraint) {
        switch (err.constraint) {
            case 'account_pk': {
                utils.onResponse(res, 'fail', 400, message.user.account_pk, null, null)
                break
            }
            case 'status_constraint': {
                utils.onResponse(res, 'fail', 400, message.user.status_constraint, null, null)
                break
            }
            case 'role_constraint': {
                utils.onResponse(res, 'fail', 400, message.user.role_constraint, null, null)
                break
            }
            case 'Account_email_key': {
                utils.onResponse(res, 'fail', 400, message.user.email_exist, null, null)
                break
            }
            case 'book_follows_pk': {
                utils.onResponse(res, 'fail', 400, message.user.book_follows_pk, null, null)
                break
            }
            case 'book_fk': {
                utils.onResponse(res, 'fail', 400, message.user.book_fk, null, null)
                break
            }
            case 'username_fk': {
                utils.onResponse(res, 'fail', 400, message.user.username_fk, null, null)
                break
            }
            default: {
                utils.onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else utils.onResponse(res, 'fail', 500, err.message, null, null)
}

user.onGetResult = (data, req, res, next) => {
    if (data instanceof Error) {
        onCatchError(data, res)
    } else {
        utils.onResponse(res, 'success', 200, data.message, data.page, data.data)
    }
}


user.verifyEmail = async (req, res, next) => {
    var user = req.user
    try {
        if (!req.query.token) return next(new Err(message.auth.token_invalid, 400))
        var data = await UserModule.get_data_from_token(req.query.token)
        if (data.username && data.email &&
            user.username == data.username && user.email == data.email) {
            user = await UserModule.verify_email(data.username)
            next({message: message.user.email_veified})
        } else next (new Err(message.user.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.get = async (req, res, next) => {
    try {
        var user = await UserModule.get(req.params.username)
        if (user) next({data: [user]})
        else next(new Err(message.user.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.getBookFollowing = async (req, res, next) => {
    var user = req.user
    try {
        next({data: await UserModule.get_book_following(user.username)})
    } catch (e) {next(new Err(e.message, 500))}
}

user.getCommentHistory = async (req, res, next) => {
    try {
        if (!await UserModule.get(req.params.username)) return next(new Err(message.user.not_found, 404))
        var comments = []
        var result = await UserModule.get_comment_history(req.params.username)
        result.forEach(e => {
            comments.push({
                id: e.id,
                id_root: e.id_root,
                book_endpoint: e.book_endpoint,
                content: e.content,
                files: e.files,
                time: e.time,
                user: {
                    username: e.username,
                    avatar: e.avatar
                }
            })
        })
        next({data: comments})
    } catch (e) {next(new Err(e.message, 500))}
}

user.getAllHistoryRead = async (req, res, next) => {
    var user = req.user
    var books = []
    try {
        var result = await HistoryModule.get_all(user.username)
        result.forEach( e => {
            var book = {
                endpoint: e[0].endpoint,
                title: e[0].title,
                author: e[0].author,
                thumb: e[0].thumb,
                theme: e[0].theme,
                description: e[0].description,
                type: e[0].type,
                rating: e[0].rating,
                rate_count: e[0].rate_count,
                status: e[0].status,
                search_number: e[0].search_number
            }
            var chapter = {
                chapter_endpoint: e[0].chapter_endpoint,
                title: e[0].chapter_title
            }
            books.push({book, chapter, time: e[0].time})
        })
        next({data: books})
    } catch (e) {next(new Err(e.message, 500))}
}

user.getRecentReadChapter = async (req, res, next) => {
    var books = []
    try {
        if (!await BookModule.get(req.params.book_endpoint)) return next(new Err(message.book.not_found, 404))
        var result = await HistoryModule.get({
            book_endpoint: req.params.book_endpoint,
            username: user.username
        })
        if (result.length > 0) {
            var chapter = ChapterModule.get(result[0].book_endpoint, result[0].chapter_endpoint)
            books.push({chapter, time: result[0].time})
        }
        next({data: books})
    } catch (e) {next(new Err(e.message, 500))}
}


user.login = async (req, res, next) => {
    var user = req.body
    try {
        if (!user.username) return next(new Err(message.user.missing_username, 400))
        else if (!user.password) return next(new Err(message.user.missing_password, 400))

        user = await UserModule.login(user.username, user.password)
        if (user) {
            user.password = ''
            var accessToken = utils.generateAccessToken(user)
            next({data: [{
                accessToken: accessToken,
                user: user
            }], message: message.user.login_success})
        } else next(new Err(message.user.incorrect_account, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.register = async (req, res, next) => {
    var user = req.body
    try {
        if (!user.username) return next(new Err(message.user.missing_username, 400))
        else if (!user.password) return next(new Err(message.user.missing_password, 400))
        else if (!user.email) return next(new Err(message.user.missing_email, 400))
        
        user = await UserModule.add(user)
        if (user) next({message: message.user.registed_success})
        else next(new Err(message.user.registed_fail, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.sendMailVerify = async (req, res, next) => {
    var user = req.user
    try {
        if (!user.username) return next(new Err(message.user.missing_username, 400))
        
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        mail.sendVerification(user.email, constants.baseURL + 'user/verify-email?token=' + token)
        next(new Err(message.auth.verify_email, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.followBook = async (req, res, next) => {
    try {
        if (!await BookModule.get(req.params.book_endpoint)) return next(new Err(message.book.not_found, 404))
        if (await UserModule.follow_book(req.params.book_endpoint, req.user.username))
            next({message: message.user.followed_book})
        else next(new Err(message.user.can_not_follow_book, 500))
    } catch (e) {next(new Err(e.message, 500))}
}

user.unfollowBook = async (req, res, next) => {
    try {
        if (!await BookModule.get(req.params.book_endpoint)) return next(new Err(message.book.not_found, 404))
        if (await UserModule.unfollow_book(req.params.book_endpoint, req.user.username))
            next({message: message.user.unfollowed_book})
        else next(new Err(message.user.can_not_unfollow_book, 500))
    } catch (e) {next(new Err(e.message, 500))}
}

user.banUser = async (req, res, next) => {
    var isSendData = false
    try {
        if (req.user.username == req.params.username) return next(new Err(message.user.can_not_ban_user, 403))
        var user = await UserModule.update({username: req.params.username, status: -1})
        if (user) {
            let notify = {
                endpoint: `+ban+${user.username}`,
                username: user.username,
                content: message.notify.ban_notication
            }
            NotifyModule.add(notify)
            isSendData = true
            next({data: [user], message: message.user.user_banned})
        } else next(new Err(message.user.not_found, 404))
    } catch (e) {
        if (e.constraint == 'notify_pk' && !isSendData) 
            return next({data: [user], message: message.user.user_banned})
        next(new Err(e.message, 500))
    }
}

user.unbanUser = async (req, res, next) => {
    var isSendData = false
    try {
        if (req.user.username == req.params.username) return next(new Err(message.user.can_not_unban_user, 403))
        var user = await UserModule.update({username: req.params.username, status: 0})
        if (user) {
            let notify = {
                endpoint: `+unban+${user.username}`,
                username: user.username,
                content: message.notify.unban_notification
            }
            NotifyModule.add(notify)
            isSendData = true
            next({data: [user], message: message.user.user_unbanned})
        } else next(new Err(message.user.not_found, 404))
    } catch (e) {
        if (e.constraint == 'notify_pk' && !isSendData) 
            return next({data: [user], message: message.user.user_unbanned})
        next(new Err(e.message, 500))
    }
}


user.updateUser = async (req, res, next) => {
    var user = {
        username: req.user.username,
        email: req.body.email
    }
    try {
        if (req.files && req.files.length > 0 && req.files[0].fieldname == 'avatar') {
            if (!req.files[0]['mimetype'].includes('image')) return next(new Err(message.user.avatar_invalid, 400))
            user.avatar = await FileModule.upload_single(req.files[0], 
                'user/' + user.username + '/', 'avatar')
        }
        user = await UserModule.update(user)
        if (user) next({data: [user], message: message.user.update_success})
        else next(new Err(message.user.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.updateRole = async (req, res, next) => {
    var user = {
        username: req.params.username,
        role: req.body.role
    }
    try {
        if (!user.role) return next(new Err(message.user.missing_role, 400))
        user = await UserModule.update(user)
        if (user) next({data: [user], message: message.user.update_success})
        else next(new Err(message.user.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.updatePassword = async (req, res, next) => {
    var user = {
        username: req.user.username,
        password: req.body.password
    }
    try {
        if (!user.password) return next(new Err(message.user.missing_password, 400))
        user = await UserModule.update(user)
        if (user) next({data: [user], message: message.user.password_updated})
        else next(new Err(message.user.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.deleteUser = async (req, res, next) => {
    try {
        var user = await UserModule.delete(req.user.username)
        if (user) {
            await FileModule.delete('user/' + user.username + '/')
            next({data: [user], message: message.user.password_updated})
        } else next(new Err(message.user.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

user.deleteAllHistoryRead = async (req, res, next) => {
    try {
        if (!await UserModule.get(req.user.username)) return next(new Err(message.user.not_found, 404))
        await HistoryModule.delete_all(req.user.username)
        next({message: message.history.delete_all})
    } catch (e) {next(new Err(e.message, 500))}
}

user.deleteSingleHistoryRead = async (req, res, next) => {
    try {
        if (!await UserModule.get(req.user.username)) return next(new Err(message.user.not_found, 404))
        else if (!await BookModule.get(req.params.book_endpoint)) return next(new Err(message.book.not_found, 404))
        await HistoryModule.delete({username: req.user.username, book_endpoint: req.params.book_endpoint})
        next({message: message.history.delete_success})
    } catch (e) {next(new Err(e.message, 500))}
}


module.exports = user