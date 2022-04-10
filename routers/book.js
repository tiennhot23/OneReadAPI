const express = require('express')
const multer = require('multer')

const BookController = require('../controllers/BookController')
const slugify = require('../middlewares/slugify')
const auth = require('../middlewares/auth')
const {
    memoryStorage
} = require('multer')

const router = express.Router()
const upload = multer({
    storage: memoryStorage()
})



router.get('/all', BookController.getAllBook, BookController.onGetResult)

router.get('/suggest-book', auth.verifyUser, BookController.getSuggestBook, BookController.onGetResult)

router.get('/top-search', BookController.getTopSearch, BookController.onGetResult)

router.get('/top-rating', BookController.getTopRating, BookController.onGetResult)

router.get('/top-view-day', BookController.getTopDay, BookController.onGetResult)

router.get('/top-view-month', BookController.getTopMonth, BookController.onGetResult)

router.get('/top-view-year', BookController.getTopYear, BookController.onGetResult)

router.get('/top-follow', BookController.getTopFollow, BookController.onGetResult)

router.get('/last-update', BookController.getlastUpdate, BookController.onGetResult)

router.get('/relate-book/:endpoint', BookController.getRelateBook, BookController.onGetResult)

router.get('/follower/:endpoint', BookController.getBookFollower, BookController.onGetResult)

router.get('/detail/:endpoint', BookController.getDetailBook, BookController.onGetResult)



router.post('/', upload.fields([{
    name: 'thumb',
    maxCount: 1
}, {
    name: 'theme',
    maxCount: 1
}]), auth.verifyAdmin, slugify.get_endpoint, BookController.addBook, BookController.onGetResult)



router.patch('/:endpoint', upload.fields([{
    name: 'thumb',
    maxCount: 1
}, {
    name: 'theme',
    maxCount: 1
}]), auth.verifyAdmin, slugify.get_endpoint, BookController.updateBook, BookController.onGetResult)

router.patch('/finish/:endpoint', auth.verifyAdmin, BookController.finishBook, BookController.onGetResult)

router.patch('/rate/:endpoint', auth.verifyUser, BookController.rateBook, BookController.onGetResult)



router.delete('/:endpoint', auth.verifyAdmin, BookController.deleteBook, BookController.onGetResult)

module.exports = router