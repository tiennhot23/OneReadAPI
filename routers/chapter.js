const express = require('express')
const multer = require('multer')

const router = express.Router()
const ChapterController = require('../controllers/ChapterController')
const slugify = require('../middlewares/slugify')
const auth = require('../middlewares/auth')
const { memoryStorage } = require('multer')

const upload = multer({
    storage: memoryStorage()
})

router.get('/all/:book_endpoint', ChapterController.getAllChapter, ChapterController.onGetResult)

router.get('/detail/:book_endpoint/:chapter_endpoint', ChapterController.getDetailChapter, ChapterController.onGetResult)


router.post('/comic/:book_endpoint', upload.any(), auth.verifyAdmin, slugify.get_endpoint, ChapterController.addComicChapter, ChapterController.onGetResult)

router.post('/novel/:book_endpoint', auth.verifyAdmin, slugify.get_endpoint, ChapterController.addNovelChapter, ChapterController.onGetResult)


router.delete('/:book_endpoint/:chapter_endpoint', auth.verifyAdmin, ChapterController.deleteChapter, ChapterController.onGetResult)

module.exports = router