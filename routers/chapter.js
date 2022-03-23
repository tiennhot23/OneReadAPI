const express = require('express')
const multer = require('multer')

const router = express.Router()
const ChapterController = require('../controllers/ChapterController')
const UserController = require('../controllers/UserController')
const HistoryController = require('../controllers/HistoryController')
const NotifyController = require('../controllers/NotifyController')
const BookController = require('../controllers/BookController')
const FileController = require('../controllers/FileController')
const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')
const auth = require('../middlewares/auth')
const { memoryStorage } = require('multer')

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
            case 'chapter_pk': {
                onResponse(res, 'fail', 400, message.chapter.chapter_pk, null, null)
                break
            }
            case 'book_fk': {
                onResponse(res, 'fail', 400, message.chapter.book_fk, null, null)
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
 * Lấy danh sách các chapter của sách
 * @query 
 * @body 
 * @return 
    data[{chapter_endpoint, book_endpoint, title, time}]
 */
router.get('/all/:book_endpoint', async (req, res, next) => {
    let book_endpoint = req.params.book_endpoint
    var chapters
    try {
        chapters = await ChapterController.list(book_endpoint)
        onResponse(res, 'success', 200,  null, null, chapters)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * chi tiết sách, tự động cập nhật lịch sử xem của người dùng nếu token authorize
 * @query view=true sẽ tăng lượt view của sách
 * @body 
 * @return 
    data[{chapter_endpoint, book_endpoint, title, time, images[]}]
 */
router.get('/detail/:book_endpoint/:chapter_endpoint', async (req, res, next) => {
    let chapter_endpoint = req.params.chapter_endpoint
    let book_endpoint = req.params.book_endpoint
    let view = req.query.view
    var chapter
    try {
        if (chapter_endpoint) {
            chapter = await ChapterController.get(book_endpoint, chapter_endpoint)
            if (chapter) {
                onResponse(res, 'success', 200,  null, null, [chapter])
                const authHeader = req.headers['authorization']
                const token = authHeader && authHeader.split(' ')[1]
                if (token) {
                    var user = await UserController.get_data_from_token(token)
                    var history = {
                        book_endpoint: book_endpoint,
                        chapter_endpoint: chapter_endpoint,
                        username: user.username
                    }
                    if (await HistoryController.get(history)) {
                        history = await HistoryController.update(history, new Date())
                    } else {
                        history = await HistoryController.add(history)
                    }
                }
                if (view == 'true') {
                    let time = new Date().toISOString().slice(0, 10)
                    if (await BookController.get_view(book_endpoint, time)) {
                        await BookController.update_view(book_endpoint, time)
                    } else {
                        await BookController.add_view(book_endpoint, time)
                    }

                }
            } else onResponse(res, 'fail', 404,  message.chapter.not_found, null, null)
        } else onResponse(res, 'fail', 400,  message.chapter.missing_chapter_endpoint, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})


/**
 * Thêm chapter, thông báo tới user đang follow sách
 * @query 
 * @body {title, images}
 * @return 
    data[{chapter_endpoint, book_endpoint, title, time, images[]}]
 */
/**
 * postman: Any data sent using postman's formdata is considered as multipart/formdata. 
 * You have to use multer or other similar library in order to parse formdata
 */
router.post('/:book_endpoint', upload.any(), auth.verifyAdmin, slugify.get_endpoint, async (req, res, next) => {
    var chapter = {
        chapter_endpoint: req.body.endpoint,
        book_endpoint: req.params.book_endpoint,
        title: req.body.title
    }
    chapter.images = await FileController.upload_multi_with_index(req.files, 
        'chapter/' + chapter.book_endpoint + '/' + chapter.chapter_endpoint + '/')
    try {
        if (!chapter.title) {
            onResponse(res, 'fail', 400,  message.chapter.missing_title, null, null)
        } else if (!chapter.images || chapter.images.length == 0) {
            onResponse(res, 'fail', 400,  message.chapter.missing_images, null, null)
        } else if (!chapter.book_endpoint) {
            onResponse(res, 'fail', 400,  message.chapter.missing_book_endpoint, null, null)
        } else {
            chapter = await ChapterController.add(chapter)
            var followers = await BookController.get_user_follow(chapter.book_endpoint)
            followers.forEach(async (user) => {
                let notify = {
                    endpoint: `*chapter*${chapter.book_endpoint}*${chapter.chapter_endpoint}`,
                    username: user.username,
                    content: message.notify.new_chapter_notification
                }
                await NotifyController.add(notify)
            })
            onResponse(res, 'success', 200,  message.chapter.add_success, null, [chapter])
        }
    } catch (err) {
        if (err.constraint == 'notify_pk') {
            onResponse(res, 'success', 200,  message.chapter.add_success, null, [chapter])
        } else {
           onCatchError(err, res)
        }
    }
})

/**
 * Cập nhật chapter
 * @query 
 * @body {(title)}
 * @return 
    data[{chapter_endpoint, book_endpoint, title, time, images[]}]
 */
router.patch('/:book_endpoint/:chapter_endpoint', auth.verifyAdmin, slugify.get_endpoint, async (req, res, next) => {
    let chapter_endpoint = req.params.chapter_endpoint
    var chapter = {
        chapter_endpoint: req.body.endpoint,
        book_endpoint: req.params.book_endpoint,
        title: req.body.title,
        images: req.body.images
    }
    try {
        if (!chapter.book_endpoint) {
            onResponse(res, 'fail', 400, message.chapter.missing_book_endpoint, null, null)
        } else if (!chapter.images || chapter.images.length == 0) {
            onResponse(res, 'fail', 400, message.chapter.missing_images, null, null)
        }
        chapter = await ChapterController.update(chapter, chapter_endpoint)
        if (chapter) {
            onResponse(res, 'success', 200, message.chapter.update_success, null, [chapter])
        } else {
            onResponse(res, 'fail', 404, message.chapter.not_found, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Xóa chapter
 * @query 
 * @body
 * @return 
    data[{chapter_endpoint, book_endpoint, title, time, images[]}]
 */
router.delete('/:book_endpoint/:chapter_endpoint', auth.verifyAdmin, async (req, res, next) => {
    var chapter
    let chapter_endpoint = req.params.chapter_endpoint
    let book_endpoint = req.params.book_endpoint
    try {
        chapter = await ChapterController.delete(book_endpoint, chapter_endpoint)
        if (chapter) onResponse(res, 'success', 200, message.chapter.delete_success, null, [chapter])
        else onResponse(res, 'fail', 404, message.chapter.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})

module.exports = router