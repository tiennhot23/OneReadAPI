const CommentModule = require('../modules/CommentModule')
const BookModule = require('../modules/BookModule')
const ChapterModule = require('../modules/ChapterModule')
const NotifyModule = require('../modules/NotifyModule')
const FileModule = require('../modules/FileModule')
const message = require('../configs/messages')
const utils = require('../utils/utils')

const comment = {}

class Err extends Error {
    constructor(message, code, constraint) {
      super(message)
      this.message = message
      this.code = code
      this.constraint = constraint
    }
}

function onCatchError(err, res) {
    if (err.constraint) {
        switch (err.constraint) {
            case 'comment_pk': {
                utils.onResponse(res, 'fail', 400,  message.comment.comment_pk, null, null)
                break
            }
            case 'username_fk': {
                utils.onResponse(res, 'fail', 404,  message.comment.username_fk, null, null)
                break
            }
            case 'book_fk': {
                utils.onResponse(res, 'fail', 404,  message.comment.book_fk, null, null)
                break
            }
            case 'reply_constraint': {
                utils.onResponse(res, 'fail', 404,  message.comment.reply_constraint, null, null)
                break
            }
            default: {
                utils.onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else utils.onResponse(res, 'fail', err.code, err.message, null, null)
}

comment.onGetResult = (data, req, res, next) => {
    if (data instanceof Error) {
        onCatchError(data, res)
    } else {
        utils.onResponse(res, 'success', 200, data.message, data.page, data.data)
    }
}


comment.getAllCommentOfBook = async (req, res, next) => {
    var page = req.query.page
    if (!page) page = 1
    var comments = []
    try {
        if (!await BookModule.get(req.params.book_endpoint)) return next(new Err(message.book.not_found, 404))
        var result = await CommentModule.get_all(req.params.book_endpoint, page)
        result.forEach(e => {
            comments.push({
                id: Number(e.id),
                id_root: Number(e.id_root),
                book_endpoint: e.book_endpoint,
                content: e.content,
                files: e.files,
                time: e.time,
                user: {
                    username: e.username,
                    avatar: e.avatar,
                    status: Number(e.status),
                    email: e.email,
                    role: Number(e.role)
                }
            })
        })
        next({data: comments, page: page})
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

comment.getDetailComment = async (req, res, next) => {
    var page = req.query.page
    if (!page) page = 1
    var replies = []
    var comment
    try {
        var result = await CommentModule.get(req.params.id, page)
        result.forEach((e, index, array) => {
            if (index != array.length - 1) {
                replies.push({
                    id: Number(e.id),
                    id_root: Number(e.id_root),
                    book_endpoint: e.book_endpoint,
                    content: e.content,
                    files: e.files,
                    time: e.time,
                    user: {
                        username: e.username,
                        avatar: e.avatar,
                        status: Number(e.status),
                        email: e.email,
                        role: Number(e.role)
                    }
                })
            } else {
                comment = {
                    id: Number(e.id),
                    id_root: Number(e.id_root),
                    book_endpoint: e.book_endpoint,
                    content: e.content,
                    files: e.files,
                    time: e.time,
                    user: {
                        username: e.username,
                        avatar: e.avatar,
                        status: Number(e.status),
                        email: e.email,
                        role: Number(e.role)
                    }
                }
            }
        })
        if (comment) comment.replies = replies
        if (comment) next({data: [comment], page: page})
        else next(new Err(message.comment.not_found, 404))
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

comment.addComment = async (req, res, next) => {
    var comment = {
        book_endpoint: req.params.book_endpoint,
        username: req.user.username,
        content: req.body.content
    }
    var isSendData = false
    try {
        if (!comment.content) return next(new Err(message.comment.missing_content, 400))

        comment = await CommentModule.add(comment)            
        comment.files = await FileModule.upload_multi_with_index(req.files, 
            'comment/' + comment.id + '/')
        if (comment.id_root === null) comment.id_root = comment.id
        comment = await CommentModule.update(comment)
        comment.id = Number(comment.id)
        comment.id_root = Number(comment.id_root)
        comment.user = {
            username: req.user.username,
            avatar: req.user.avatar,
            status: Number(req.user.status),
            email: req.user.email,
            role: Number(req.user.role)
        }
        let tags = comment.content.match(/@[a-zA-Z0-9]+/g)
        if (tags) tags.forEach(tag => {
            var arr = tag.split('@')
            tag = arr[arr.length - 1]
            if (tag) {
                let notify = {
                    endpoint: `+comment+${comment.id_root}`,
                    username: tag,
                    content: message.notify.tag_notification
                }
                NotifyModule.add(notify)
            }
        })
        isSendData = true
        next({data: [comment], message: message.comment.add_success})
    } catch (e) {
        if (e.constraint == 'notify_pk' && !isSendData) 
            return next({data: [comment], message: message.comment.add_success})
        next(new Err(e.message, 500,  e.constraint))
    }
}

comment.deleteComment = async (req, res, next) => {
    try {
        var comment = await CommentModule.delete(req.params.id)
        
        if (comment) {
            comment.id = Number(comment.id)
            comment.id_root = Number(comment.id_root)
            comment.user = {
                username: req.user.username,
                avatar: req.user.avatar,
                status: Number(req.user.status),
                email: req.user.email,
                role: Number(req.user.role)
            }
            next({data: [comment], message: message.comment.delete_success})
        } 
        else next(new Err(message.comment.not_found, 404))
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

module.exports = comment