const express = require('express')
const multer = require('multer')

const CommentController = require('../controllers/CommentController')
const NotifyController = require('../controllers/NotifyController')
const FileController = require('../controllers/FileController')
const UserController = require('../controllers/UserController')
const auth = require('../middlewares/auth')
const message = require('../configs/messages')
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
            case 'comment_pk': {
                onResponse(res, 'fail', 400,  message.comment.comment_pk, null, null)
                break
            }
            case 'username_fk': {
                onResponse(res, 'fail', 400,  message.comment.username_fk, null, null)
                break
            }
            case 'book_fk': {
                onResponse(res, 'fail', 400,  message.comment.book_fk, null, null)
                break
            }
            case 'reply_constraint': {
                onResponse(res, 'fail', 400,  message.comment.reply_constraint, null, null)
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
 * Lấy danh sách các comment gốc của sách theo trang
 * @query page
 * @body 
 * @return 
    data[{id, endpoint, id_root, content, time, files[], user:{usernae, avatar}}]
 */
router.get('/:endpoint', async (req, res, next) => {
    const endpoint = req.params.endpoint
    var page = req.query.page
    if (!page) page = 1
    var comments = []
    try {
        var result = await CommentController.list(endpoint, page)
        result.forEach(e => {
            comments.push({
                id: Number(e.id),
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
        onResponse(res, 'success', 200,  null, page, comments)
    } catch (err) {
        onCatchError(err, res)
    }
})


/**
 * Comment gốc và danh sách các reply của comment theo từng trang
 * @query page
 * @body 
 * @return 
    data[{id, endpoint, id_root, content, time, files[], user:{usernae, avatar},
    replies: [comments]}]
 */
router.get('/detail/:id', async (req, res, next) => {
    let id = req.params.id
    var page = req.query.page
    if (!page) page = 1
    var replies = []
    var comment
    try {
        var result = await CommentController.get(id, page)
        result.forEach((e, index, array) => {
            if (index != array.length - 1) {
                replies.push({
                    id: Number(e.id),
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
            } else {
                comment = e
                comment.id = Number(e.id)
            }
        })
        if (comment) comment.replies = replies
        if (comment) onResponse(res, 'success', 200,  null, page, [comment])
        else onResponse(res, 'fail', 404,  message.comment.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})



/**
 * Thêm comment, thông báo đến user được tag trong comment
 * @query 
 * @body {content, image files}
 * @return 
    data[{id, endpoint, id_root, content, time, files[], user:{usernae, avatar}}]
 */
router.post('/:book_endpoint/:username', auth.verifyUser, upload.any('file'), async (req, res, next) => {
    var comment = req.body
    comment.endpoint = req.params.book_endpoint
    comment.username = req.params.username
    try {
        if (!comment.endpoint) {
            onResponse(res, 'fail', 400,  message.comment.missing_endpoint, null, null)
        } else if (!comment.username) {
            onResponse(res, 'fail', 400,  message.comment.missing_username, null, null)
        } else if (!comment.content) {
            onResponse(res, 'fail', 400,  message.comment.missing_content, null, null)
        } else {
            comment = await CommentController.add(comment)            
            comment.files = await FileController.upload_multi_with_index(req.files, 
                'comment/' + comment.id + '/')
            if (comment.id_root === null) comment.id_root = comment.id
            comment = await CommentController.update(comment)
            var user = await UserController.get(req.params.username)
            comment.user = {
                username: user.username,
                avatar: user.avatar
            }
            let tags = comment.content.match(/@[a-zA-Z0-9]+/g)
            if (tags) tags.forEach(async (tag) => {
                var arr = tag.split('@')
                tag = arr[arr.length - 1]
                if (tag) {
                    let notify = {
                        endpoint: `*comment*${comment.id_root}`,
                        username: tag,
                        content: message.notify.tag_notification
                    }
                    NotifyController.add(notify)
                }
            })
            onResponse(res, 'success', 200,  message.comment.add_success, null, [comment])
        }
    } catch (err) {
        if (err.constraint == 'notify_pk') {
            onResponse(res, 'success', 200,  message.comment.add_success, null, [comment])
        } else {
            onCatchError(err, res)
        }
    }
})

/**
 * Xóa hoàn toàn comment và các replies
 * @query 
 * @body
 * @return 
    data[{id, endpoint, username, id_root, content, time, files[]}]
 */
router.delete('/:id', auth.verifyAdmin, async (req, res, next) => {
    let comment
    let id = req.params.id
    try {
        comment = await CommentController.delete(id)
        if (comment) {
            onResponse(res, 'success', 200,  message.comment.delete_success, null, [comment])
        } else onResponse(res, 'fail', 404,  message.comment.not_found, null, null)
    } catch (err) {
        onCatchError(err)
    }
})

module.exports = router