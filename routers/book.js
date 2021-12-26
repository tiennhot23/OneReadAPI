const express = require('express')

const router = express.Router()
const BookController = require('../controllers/BookController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

// router.get('/all/:page', async (req, res, next) => {
//     var page = req.params.page
//     var books
//     try {
//         books = await BookController.list(req.body, page)
//         res.status(200).json(books)
//     } catch (err) {
//         res.status(500).json({message: err.message})
//     }
// })

router.get('/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var book
    try {
        if (endpoint) {
            book = await BookController.get(endpoint)
            if (book) res.status(200).json(book)
            res.status(200).json({message: message.book.not_found})
        } else {
            res.status(400).json({message: message.book.missing_endpoint})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})



/**
 * thêm book
 * @body {endpoint, title, (author), (thumb), (theme), (description), type}
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
            book = await BookController.add(book)
            res.status(200).json(book)
        }
    } catch (err) {
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
 * xoá book
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