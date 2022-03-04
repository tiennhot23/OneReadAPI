const express = require('express')
const multer = require('multer')

const router = express.Router()
const ChapterController = require('../controllers/ChapterController')
const TransactionController = require('../controllers/TransactionContoller')
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
        res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            data: chapters
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
                res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: null,
                    data: [chapter]
                })
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
            } else res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.chapter.not_found,
                data: null
            })
        } else {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.chapter.missing_chapter_endpoint,
                data: null
            })
        }
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
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.chapter.missing_title,
                data: null
            })
        } else if (!chapter.images || chapter.images.length == 0) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.chapter.missing_images,
                data: null
            })
        } else if (!chapter.book_endpoint) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.chapter.missing_book_endpoint,
                data: null
            })
        } else {
            // await TransactionController.begin()
            chapter = await ChapterController.add(chapter)
            // chapter.images = req.body.images
            // let images = await ChapterController.add_chapter_detail(chapter)
            // chapter.images = images.images
            // await TransactionController.commit()
            var followers = await BookController.get_user_follow(chapter.book_endpoint)
            followers.forEach(async (user) => {
                let notify = {
                    endpoint: `*chapter*${chapter.book_endpoint}*${chapter.chapter_endpoint}`,
                    username: user.username,
                    content: message.notify.new_chapter_notification
                }
                await NotifyController.add(notify)
            })
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.chapter.add_success,
                data: [chapter]
            })
        }
    } catch (err) {
        // await TransactionController.rollback()
        if (err.constraint) {
            switch (err.constraint) {
                case 'chapter_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.chapter.chapter_pk,
                        data: null
                    })
                    break
                }
                case 'chapter_detail_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.chapter.chapter_detail_fk,
                        data: null
                    })
                    break
                }
                case 'book_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.chapter.book_fk,
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
                    break;
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
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.chapter.missing_book_endpoint,
                data: null
            })
        } else if (!chapter.images || chapter.images.length == 0) {
            return res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.chapter.missing_images,
                data: null
            })
        }
        chapter = await ChapterController.update(chapter, chapter_endpoint)
        if (chapter) {
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: message.chapter.update_success,
                data: [chapter]
            })
        } else {
            return res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.chapter.not_found,
                data: null
            })
        }
        // await TransactionController.begin()
        // if (chapter.title) {
        //     chapter = await ChapterController.update(chapter, chapter_endpoint)
        // } 
        // if (chapter) {
        //     if (chapter.images && chapter.images.length != 0) {
        //         chapter.images = req.body.images
        //         chapter.images = await ChapterController.update_chapter_images(chapter)
        //     }
        //     await TransactionController.commit()
        //     return res.status(200).json({chapter: chapter})
        // } else {
        //     await TransactionController.commit()
        //     return res.status(404).json({message: message.chapter.not_found})
        // }
    } catch (err) {
        // await TransactionController.rollback()
        if (err.constraint) {
            switch (err.constraint) {
                case 'chapter_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.chapter.chapter_pk,
                        data: null
                    })
                    break
                }
                case 'chapter_detail_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.chapter.chapter_detail_fk,
                        data: null
                    })
                    break
                }
                case 'book_fk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.chapter.book_fk,
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
                    break;
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
        if (chapter) res.status(200).json({
            status: 'success',
            code: 200,
            message: message.chapter.delete_success,
            data: [chapter]
        })
        else res.status(404).json({
            status: 'fail',
            code: 404,
            message: message.chapter.not_found,
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