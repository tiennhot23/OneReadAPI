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
            page: Number(page),
            data: comments
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
            } else {
                comment = e
            }
        })
        if (comment) comment.replies = replies
        if (comment) res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            page: Number(page),
            data: [comment]
        })
        else res.status(404).json({
            status: 'fail',
            code: 404,
            message: message.comment.not_found,
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
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.comment.missing_endpoint,
                data: null
            })
        } else if (!comment.username) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.comment.missing_username,
                data: null
            })
        } else if (!comment.content) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.comment.missing_content,
                data: null
            })
        } else {
            
            comment = await CommentController.add(comment)
            var user = await UserController.get(req.params.username)
            comment.user = {
                username: user.username,
                avatar: user.avatar
            }
            comment.files = await FileController.upload_multi_with_index(req.files, 
                'comment/' + comment.id + '/')
            if (comment.id_root === null) comment.id_root = comment.id
            comment = await CommentController.update(comment)
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
            res.status(200).json({
                status: 'success',
                code: 200,
                message: message.comment.add_success,
                data: [comment]
            })
        }
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'comment_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.comment.comment_pk,
                        data: null
                    })
                    break
                }
                case 'username_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.comment.username_fk,
                        data: null
                    })
                    break
                }
                case 'book_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.comment.book_fk,
                        data: null
                    })
                    break
                }
                case 'reply_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.comment.reply_constraint,
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
        if (comment) res.status(200).json({
            status: 'success',
            code: 200,
            message: message.comment.delete_success,
            data: [comment]
        })
        else res.status(404).json({
            status: 'fail',
            code: 404,
            message: message.comment.not_found,
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

module.exports = router