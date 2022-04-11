const express = require('express')
const multer = require('multer')

const CommentController = require('../controllers/CommentController')
const auth = require('../middlewares/auth')
const { memoryStorage } = require('multer')

const router = express.Router()
const upload = multer({
    storage: memoryStorage()
})


router.get('/:book_endpoint', CommentController.getAllCommentOfBook, CommentController.onGetResult)

router.get('/detail/:id', CommentController.getDetailComment, CommentController.onGetResult)

router.post('/:book_endpoint', auth.verifyUser, upload.any('file'), CommentController.addComment, CommentController.onGetResult)

router.delete('/:id', auth.verifyAdmin, CommentController.deleteComment, CommentController.onGetResult)

module.exports = router