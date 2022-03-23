const express = require('express')
const multer = require('multer')

const BookController = require('../controllers/BookController')
const TransactionController = require('../controllers/TransactionContoller')
const NotifyController = require('../controllers/NotifyController')
const FileController = require('../controllers/FileController')
const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')
const auth = require('../middlewares/auth')
const constants = require('../configs/constants')
const {
    memoryStorage
} = require('multer')

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
            case 'book_pk': {
                onResponse(res, 'fail', 400,  message.book.book_pk, null, null)
                break
            }
            case 'type_constraint': {
                onResponse(res, 'fail', 400, message.book.type_constraint, null, null)
                break
            }
            case 'genre_fk': {
                onResponse(res, 'fail', 404, message.genre.not_found, null, null)
                break
            }
            case 'book_fk': {
                onResponse(res, 'fail', 404,  message.book.not_found, null, null)
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
 * Lấy toàn bộ sách theo từng trang
 * @query page
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.get('/all', async (req, res, next) => {
    var books
    var page = req.query.page
    if (!page) page = 1
    try {
        books = await BookController.get_all(page)
        onResponse(res, 'success', 200, null, page, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

/**
 * Lọc sách theo title, author, type, status, genre phân theo từng trang
 * @query page, filter (typeof json)
 *       ex: filter={"title":"one",%20"genres":["action","shounen"]}
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.get('/filter', async (req, res, next) => {
    var books
    var filter
    try {
        filter = JSON.parse(req.query.filter)
    } catch (ignored) {
        filter = {}
    }
    var page = req.query.page
    if (!page) page = 1
    try {
        if (filter.genres && filter.genres.length > 0) {
            books = await BookController.filter_with_genres(filter, page)
        } else {
            books = await BookController.filter_without_genres(filter, page)
        }
        onResponse(res, 'success', 200, null, page, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

/**
 * Top 10 sách gợi ý cho người dùng dựa trên các thể loại của sách mà người dùng follow
 * @query 
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.get('/suggest-book/:username', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    var books
    try {
        books = await BookController.get_suggest_book(user.username)
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

/**
 * Top 10 tìm kiếm
 * @query
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.get('/top-search', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_search()
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

/**
 * Top 10 rating
 * @query
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.get('/top-rating', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_rating()
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})


router.get('/top-view-day', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_day()
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

router.get('/top-view-month', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_month()
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

router.get('/top-view-year', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_year()
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

router.get('/top-follow', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_follow()
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

/**
 * Danh sách các user follow sách
 * @query
 * @body 
 * @return 
    data[{username, avatar}]
 */
router.get('/follower/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var users
    try {
        users = await BookController.get_user_follow(endpoint)
        onResponse(res, 'success', 200, null, null, users)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

router.get('/last-update', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_last_update()
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

/**
 * Top 10 sách tương tự được lọc dựa trên thể loại của sách hiện tại
 * @query
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.get('/relate-book/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var books
    try {
        books = await BookController.get_relate_book(endpoint)
        onResponse(res, 'success', 200, null, null, books)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

/**
 * Chi tiết sách
 * @query search: nếu search=true thì tăng lượt tìm kiếm search_number scuar sách lên 1
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number,
    genres[]: {endpoint, title,description}
    follow, view}]
 */
router.get('/detail/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    let search = req.query.search
    var book
    try {
        if (endpoint) {
            book = await BookController.get(endpoint)
            if (book) {
                if (search == 'true') {
                    book.search_number = Math.min(book.search_number + 1, constants.max_int)
                    let search_number = await BookController.update_search_number(book)
                    book.search_number = search_number.search_number
                }
                book.follow = Number(book.follow)
                book.view = Number(book.view)
                onResponse(res, 'success', 200, null, null, [book])
            } else onResponse(res, 'fail', 404, message.book.not_found, null, null)
        } else onResponse(res, 'fail', 400, message.book.missing_endpoint, null, null)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})


/**
 * Lấy sách theo thể loại Comic, Novel, Literature
 * @query page
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.get('/type/:type', async (req, res, next) => {
    let type = req.params.type
    var page = req.query.page
    if (!page) page = 1
    var books
    try {
        if (type) {
            books = await BookController.get_book_of_type(type, page)
            onResponse(res, 'success', 200, null, null, books)
        } else onResponse(res, 'fail', 400, message.book.missing_type, null, null)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})


/**
 * Thêm sách
 * @query 
 * @body {title, (author), (thumb), (theme),
    (description), type, genres[]: genre_endpoint}
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.post('/', upload.fields([{
        name: 'thumb',
        maxCount: 1
    },
    {
        name: 'theme',
        maxCount: 1
    }
]), auth.verifyAdmin, slugify.get_endpoint, async (req, res) => {
    var book = req.body
    try {
        if (!book.title) {
            onResponse(res, 'fail', 400, message.book.missing_title, null, null)
        } else if (!book.type) {
            onResponse(res, 'fail', 400, message.book.missing_type, null, null)
        } else if (!req.files['thumb']) {
            onResponse(res, 'fail', 400, message.book.missing_thumb, null, null)
        } else if (!req.files['theme']) {
            onResponse(res, 'fail', 400, message.book.missing_theme, null, null)
        } else {
            book.thumb = await FileController.upload_single(req.files['thumb'][0],
                'book/' + book.endpoint + '/', 'thumb')
            book.theme = await FileController.upload_single(req.files['theme'][0],
                'book/' + book.endpoint + '/', 'theme')
            let genres = book.genres
            book = await BookController.add(book)
            if (genres) await BookController.add_book_genres(book.endpoint, genres)
            await BookController.add_view(book.endpoint, new Date().toISOString().slice(0, 10))
            onResponse(res, 'success', 200, message.book.add_success, null, [book])
        }
    } catch (err) {
        onCatchError(err, res)
    }
})


/**
 * Cập nhật sách
 * @query 
 * @body {title, (author), (thumb), (theme),
    (description), type, genres[]: genre_endpoint}
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.patch('/:endpoint', upload.fields([{
        name: 'thumb',
        maxCount: 1
    },
    {
        name: 'theme',
        maxCount: 1
    }
]), auth.verifyAdmin, slugify.get_endpoint, async (req, res, next) => {
    var book = req.body
    let endpoint = req.params.endpoint
    try {
        await TransactionController.begin()
        if (book.genres && book.genres.lenght > 0) {
            await BookController.delete_all_genres(endpoint)
            book.genres.forEach(async (genre_endpoint) => {
                await BookController.add_book_genres(endpoint, genre_endpoint)
            })
        }
        if (req.files['thumb']) book.thumb = await FileController.upload_single(req.files['thumb'][0],
            'book/' + book.endpoint + '/', 'thumb')
        if (req.files['theme']) book.theme = await FileController.upload_single(req.files['theme'][0],
            'book/' + book.endpoint + '/', 'theme')
        book = await BookController.update_info(book, endpoint)
        await TransactionController.commit()
        if (book) onResponse(res, 'success', 200, message.book.update_success, null, [book])
        else onResponse(res, 'fail', 404, message.book.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Cập nhật sách đã hoàn thành, tự động thông báo tới các user đang follow sách
 * @query 
 * @body 
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.patch('/finish/:endpoint', auth.verifyAdmin, async (req, res, next) => {
    let endpoint = req.params.endpoint
    try {
        var book = await BookController.get(endpoint)
        if (book && book.status == 0) {
            book = await BookController.finish_book(endpoint)
            var followers = await BookController.get_user_follow(book.endpoint)
            followers.forEach(async (user) => {
                let notify = {
                    endpoint: `*book*${book.endpoint}`,
                    username: user.username,
                    content: message.notify.book_finish_notification
                }
                NotifyController.add(notify)
            })

        }
        if (book) onResponse(res, 'success', 200, message.book.update_success, null, [book])
        else onResponse(res, 'fail', 404, message.book.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Đánh giá sách
 * @query 
 * @body {rating}
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.patch('/rate/:endpoint/:username', auth.verifyUser, async (req, res, next) => {
    let endpoint = req.params.endpoint
    var rating = req.body.rating
    try {
        if (!rating) {
            onResponse(res, 'fail', 400, message.book.missing_rating, null, null)
        } else if (rating > 5.0) {
            onResponse(res, 'fail', 400, message.book.rating_constraint, null, null)
        } else {
            var book = await BookController.get(endpoint)
            if (book) {
                rating = Math.max(rating, 3.5) // :D hehe tất cả các đánh giá dưới 3.5 đều chuyển thành 3.5 để ko ảnh hưởng lớn đến điểm rating
                book.rate_count = Math.min(book.rate_count + 1, constants.max_int)
                book.rating = ((book.rating * (book.rate_count - 1)) + rating) / book.rate_count
                book.rating = book.rating.toFixed(1)
                var obj = await BookController.update_rating(book, endpoint)
                book.rating = obj.rating
                book.rate_count = obj.rate_count
                onResponse(res, 'success', 200, message.book.update_success, null, [book])
            } else onResponse(res, 'fail', 404, message.book.not_found, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Xóa sách (set status = -1)
 * @query 
 * @body
 * @return 
    data[{endpoint, title, author, thumb,
    theme, description, type, rating,
    rate_count, status, search_number}]
 */
router.delete('/:endpoint', auth.verifyAdmin, async (req, res, next) => {
    let book
    let endpoint = req.params.endpoint
    try {
        book = await BookController.delete(endpoint)
        if (book) onResponse(res, 'success', 200, message.book.delete_success, null, [book])
        else onResponse(res, 'fail', 404, message.book.not_found, null, null)
    } catch (err) {
        onResponse(res, 'fail', 500, err.message, null, null)
    }
})

module.exports = router