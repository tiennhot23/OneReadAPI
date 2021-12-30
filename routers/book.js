const express = require('express')

const router = express.Router()
const BookController = require('../controllers/BookController')
const TransactionController = require('../controllers/TransactionContoller')
const NotifyController = require('../controllers/NotifyController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')
const auth = require('../middlewares/auth')

/**
 * Lấy danh sách các sách với filter nếu có và phân trang
 * @body filter{author (không dùng %%), type, genre, status (0, 1)}
 * @returns books
 */
router.get('/all', async (req, res, next) => {
    var page = req.params.page
    var books
    try {
        books = await BookController.list(req.body, page)
        res.status(200).json(books)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/suggest-book', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    var books
    try {
        books = await BookController.get_suggest_book(user.username)
        return res.status(200).json(books)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/top-search', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_search()
        return res.status(200).json(books)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    let search = req.body.search
    var book
    try {
        if (endpoint) {
            book = await BookController.get(endpoint)
            if (search) {
                let search_number = await BookController.update_search_number(book.endpoint)
                book.search_number = search_number.search_number
            }
            if (book) res.status(200).json(book)
            else res.status(404).json({message: message.book.not_found})
        } else {
            res.status(400).json({message: message.book.missing_endpoint})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})





/**
 * thêm sách cùng với thể loại của sách 
 * @body {endpoint, title, (author), (thumb), (theme), (description), type, genres}
 * @returns book
 */
router.post('/', slugify.get_endpoint, async (req, res, next) => {
    var book = req.body
    try {
        if (!book.title) {
            res.status(400).json({message: message.book.missing_title})
        } else if (!book.type) {
            res.status(400).json({message: message.book.missing_type})
        } else {
            await TransactionController.begin()
            let genres = book.genres
            book = await BookController.add(book)
            if (genres) await BookController.add_book_genres(book.endpoint, genres)
            let view = await BookController.add_view(book.endpoint, new Date().toISOString().slice(0,10))
            book.view = view.view
            await TransactionController.commit()
            res.status(200).json(book)
        }
    } catch (err) {
        await TransactionController.rollback()
        if (err.constraint){
            switch (err.constraint) {
                case 'book_pk': {
                    res.status(400).json({message: message.book.book_pk})
                    break
                }
                case 'type_constraint': {
                    res.status(400).json({message: message.book.type_constraint})
                    break
                }
                case 'genre_fk': {
                    res.status(400).json({message: message.genre.not_found})
                    break
                }
                case 'book_fk': {
                    res.status(400).json({message: message.book.not_found})
                    break
                }
                default:{
                    res.status(500).json({message: err.message})
                    break
                }
            }
        } else {
            res.status(500).json({message: err.message})
        }
    }
})


/**
 * cập nhật book
 * @body {endpoint, title, (author), (thumb), (theme), (description), type}
 * @returns book
 */
 router.patch('/:endpoint', slugify.get_endpoint, async (req, res, next) => {
    var book = req.body
    let endpoint = req.params.endpoint
    try {
        book = await BookController.update_info(book, endpoint)
        if (book) res.status(200).json(book)
        else res.status(404).json({message: message.book.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.patch('/finish/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    try {
        var book = await BookController.get(endpoint)
        if (book.status == 0) {
            book = await BookController.finish_book(endpoint)
            var followers = await BookController.get_user_follow(book.endpoint)
            followers.forEach(async (user) => {
                let notify = {
                    endpoint: `*book*${book.endpoint}`,
                    username: user.username,
                    content: message.notify.book_finish_notification
                }
                console.log(1)
                NotifyController.add(notify)
            })
            
        }
        if (book) res.status(200).json(book)
        else res.status(404).json({message: message.book.not_found})  
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

/**
 * xoá book - cập nhật status = -1
 * @body {}
 * @returns book
 */
 router.delete('/:endpoint', async (req, res, next) => {
    let book
    let endpoint = req.params.endpoint
    try {
        book = await BookController.delete(endpoint)
        if (book) res.status(200).json(book)
        else res.status(404).json({message: message.book.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router