const express = require('express')
const multer = require('multer')

const UserController = require('../controllers/UserController')
const auth = require('../middlewares/auth')
const encrypt = require('../middlewares/encrypt')
const { memoryStorage } = require('multer')

const router = express.Router()
const upload = multer({
    storage: memoryStorage()
})

router.get('/verify-email', UserController.verifyEmail, UserController.onGetResult)

router.get('/info/:username', UserController.get, UserController.onGetResult)

router.get('/book-following', auth.verifyUser, UserController.getBookFollowing, UserController.onGetResult)

router.get('/comment-history/:username', auth.verifyAdmin, UserController.getCommentHistory, UserController.onGetResult)

router.get('/history', auth.verifyUser, UserController.getAllHistoryRead, UserController.onGetResult)

router.get('/history/:book_endpoint', auth.verifyUser, UserController.getRecentReadChapter, UserController.onGetResult)



router.post('/login', UserController.login, UserController.onGetResult)

router.post('/register', encrypt.hash, UserController.register, UserController.onGetResult)

router.post('/verify-email', auth.verifyUser, UserController.sendMailVerify, UserController.onGetResult)

router.post('/follow-book/:book_endpoint', auth.verifyUser, UserController.followBook, UserController.onGetResult)

router.post('/unfollow-book/:book_endpoint', auth.verifyUser, UserController.unfollowBook, UserController.onGetResult)

router.post('/ban/:username', auth.verifyAdmin, UserController.banUser, UserController.onGetResult)

router.post('/unban/:username', auth.verifyAdmin, UserController.unbanUser, UserController.onGetResult)



router.patch('/', auth.verifyUser, upload.any('avatar'), UserController.updateUser, UserController.onGetResult)

router.patch('/change-role/:username', auth.verifyAdmin, UserController.updateRole, UserController.onGetResult)

router.patch('/change-password', auth.verifyUser, encrypt.hash, UserController.updatePassword, UserController.onGetResult)




router.delete('/', auth.verifyUser, UserController.deleteUser, UserController.onGetResult)

router.delete('/history/all', auth.verifyUser, UserController.deleteAllHistoryRead, UserController.onGetResult)

router.delete('/history/single/:book_endpoint', auth.verifyUser, UserController.deleteSingleHistoryRead, UserController.onGetResult)

module.exports = router