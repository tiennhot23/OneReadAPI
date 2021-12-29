const express = require('express')

const router = express.Router()
const CommentController = require('../controllers/CommentController')
const NotifyController = require('../controllers/NotifyController')
const auth = require('../middlewares/auth')
const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

router.get('/:endpoint', auth.verifyUser, async (req, res, next) => {
    const endpoint = req.params.endpoint
    var comments
    try {
        comments = await CommentController.list(endpoint)
        res.status(200).json(comments)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/reply/:id', async (req, res, next) => {
    let id = req.params.id
    var replies
    try {
        replies = await CommentController.get(id)
        if (replies) res.status(200).json(replies)
        else res.status(404).json({message: message.comment.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})



/**
 * thêm comment
 * @body {endpoint, username, id_root, content, files}
 * @returns comment
 */
router.post('/', async (req, res, next) => {
    var comment = req.body
    try {
        if (!comment.endpoint) {
            res.status(400).json({message: message.comment.missing_endpoint})
        } else if (!comment.username) {
            res.status(400).json({message: message.comment.missing_username})
        } else if (!comment.content) {
            res.status(400).json({message: message.comment.missing_content})
        } else {
            comment = await CommentController.add(comment)
            let tags = comment.content.split('@')
            tags.forEach(async (tag) => {
                tag = tag.split(' ')[0]
                if (tag){
                    let notify = {
                        endpoint: `*comment*${comment.id_root}`,
                        username: tag,
                        content: message.notify.tag_notification
                    }
                    await NotifyController.add(notify)
                }
            })
            res.status(200).json(comment)
        }
    } catch (err) {
        if (err.constraint){
            switch (err.constraint) {
                case 'comment_pk': {
                    res.status(400).json({message: message.comment.comment_pk})
                    break
                }
                case 'username_fk': {
                    res.status(400).json({message: message.comment.username_fk})
                    break
                }
                case 'reply_constraint': {
                    res.status(400).json({message: message.comment.reply_constraint})
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
 * xoá comment
 * @body 
 * @returns comment
 */
 router.delete('/:id', auth.verifyUser, async (req, res, next) => {
    let comment
    let id = req.params.id
    try {
        comment = await CommentController.delete(id)
        if (comment) res.status(200).json(comment)
        else res.status(404).json({message: message.comment.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router