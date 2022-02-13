const express = require('express')

const router = express.Router()
const CommentController = require('../controllers/CommentController')
const NotifyController = require('../controllers/NotifyController')
const auth = require('../middlewares/auth')
const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

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

router.get('/detail/:id', async (req, res, next) => {
    let id = req.params.id
    var page = req.query.page
    if (!page) page = 1
    var comments = []
    try {
        var result = await CommentController.get(id, page)
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
        if (comments) res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            data: comments
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
 * thêm comment
 * @body {endpoint, username, id_root, content, files}
 * @returns comment
 */
router.post('/:book_endpoint/:username', auth.verifyUser, async (req, res, next) => {
    var comment = req.body
    comment.endpoint = req.params.book_endpoint
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
            if (comment.id_root === null) comment.id_root = comment.id
            let tags = comment.content.split('@')
            tags.forEach(async (tag) => {
                tag = tag.split(' ')[0]
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
 * xoá comment
 * @body 
 * @returns comment
 */
router.delete('/:id', auth.verifyUser, async (req, res, next) => {
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