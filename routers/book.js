const express = require('express')

const router = express.Router()
const BookController = require('../controllers/BookController')
const TransactionController = require('../controllers/TransactionContoller')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

/**
 * Lấy danh sách các sách với filter nếu có và phân trang
 * @body filter{author (không dùng %%), type, genre, status (0, 1)}
 * @returns books
 */
router.get('/all/:page', async (req, res, next) => {
    var page = req.params.page
    var books
    try {
        books = await BookController.list(req.body, page)
        res.status(200).json(books)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var book
    try {
        if (endpoint) {
            book = await BookController.get(endpoint)
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


// /**
//  * cập nhật book
//  * @body {endpoint, title, (author), (thumb), (theme), (description), type}
//  * @returns book
//  */
//  router.patch('/:endpoint', slugify.get_endpoint, async (req, res, next) => {
//     var book = {
//         endpoint: req.body.endpoint,
//         title: req.body.title,
//         description: req.body.description
//     }
//     let endpoint = req.params.endpoint
//     try {
//         book = await BookController.update(book, endpoint)
//         if (book) res.status(200).json(book)
//         else res.status(404).json({message: message.book.not_found})
//     } catch (err) {
//         res.status(500).json({message: err.message})
//     }
// })

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