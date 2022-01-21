const express = require('express')

const router = express.Router()
const BookController = require('../controllers/BookController')
const TransactionController = require('../controllers/TransactionContoller')
const NotifyController = require('../controllers/NotifyController')
const GenreController = require('../controllers/GenreController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')
const auth = require('../middlewares/auth')
const constants = require('../configs/constants')


// //thêm dữ liệu từ web scraping
// const slug = require('slugify')
// const data = require('../data/list-comic-4')
// router.get('/', async (req, res, next) => {
//     for (var e of data){
//         console.log(e.title)
//         // await new Promise(resolve => setTimeout(resolve, 7000))
//         var book = e
//         try {
//             if (!book.title) {
//                 res.status(400).json({message: message.book.missing_title})
//             } else if (!book.type) {
//                 res.status(400).json({message: message.book.missing_type})
//             } else {
//                 book.endpoint = slug(book.title, { lower: true, strict: true })
//                 let genres = book.genres
//                 const blacklist = ['comic', 'harem', 'magical', 'adult', 'anime', 'cooking', 'doujinshi', 'dam-my', 'live-action', 'mecha', 'anime', 'romance', 'isekai', 'fi', 'sci' 
//                 , 'shoujo-ai', 'shounen-ai', 'smut', 'soft-yuri', 'thieu-nhi', '16+', 'soft-yaoi', 'gender-bender', 'tap-chi-truyen-tranh', 'truyen-scan', 'viet-nam']
//                 const found = genres.some(r=> blacklist.includes(r))
//                 if (!found) {
//                     book = await BookController.add(book)
//                     if (genres) await BookController.add_book_genres(book.endpoint, genres)
//                     let view = await BookController.add_view(book.endpoint, new Date().toISOString().slice(0,10))
//                     book.view = view.view
//                     book.genres = genres
//                 } else {
//                     console.log(genres)
//                 }
//             }
//         } catch (err) {
//             console.log(err)
//             if (err.constraint){
//                 switch (err.constraint) {
//                     case 'book_pk': {
//                         res.status(400).json({message: message.book.book_pk})
//                         break
//                     }
//                     case 'type_constraint': {
//                         res.status(400).json({message: message.book.type_constraint})
//                         break
//                     }
//                     case 'genre_fk': {
//                         res.status(400).json({message: message.genre.not_found})
//                         break
//                     }
//                     case 'book_fk': {
//                         res.status(400).json({message: message.book.not_found})
//                         break
//                     }
//                     default:{
//                         res.status(500).json({message: err.message})
//                         break
//                     }
//                 }
//             } else {
//                 res.status(500).json({message: err.message})
//             }
//         }
//     }
// })

/**
 * Lấy danh sách các sách với filter nếu có và phân trang
 * @body filter{author (không dùng %%), type, genre, status (0, 1)}
 * @returns books
 */
router.get('/all', async (req, res, next) => {
    var books
    var page = req.query.page
    if (!page) page = 1
    try {
        if (req.body.genres && req.body.genres.length > 0) {
            books = await BookController.filter_with_genres(req.body, page)
        } else {
            books = await BookController.filter_without_genres(req.body, page)
        }
        res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/suggest-book/:username', auth.verifyUser, async (req, res, next) => {
    var user = req.user
    var books
    try {
        books = await BookController.get_suggest_book(user.username)
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/top-search', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_search()
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/top-rating', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_rating()
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/top-view-day', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_day()
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/top-view-month', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_month()
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/top-view-year', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_year()
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/top-follow', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_top_follow()
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/follower/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var users
    try {
        users = await BookController.get_user_follow(endpoint)
        return res.status(200).json({users: users})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/last-update', async (req, res, next) => {
    var books
    try {
        books = await BookController.get_last_update()
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/relate-book/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var books
    try {
        books = await BookController.get_relate_book(endpoint)
        return res.status(200).json({books: books})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/detail/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    let search = req.body.search
    var book
    try {
        if (endpoint) {
            book = await BookController.get(endpoint)
            if (search) {
                book.search_number = Math.min(book.search_number + 1, constants.max_int)
                let search_number = await BookController.update_search_number(book)
                book.search_number = search_number.search_number
            }
            if (book) res.status(200).json({book: book})
            else res.status(404).json({message: message.book.not_found})
        } else {
            res.status(400).json({message: message.book.missing_endpoint})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


router.get('/type/:type', async (req, res, next) => {
    let type = req.params.type
    var books
    try {
        if (type) {
            books = await BookController.get_book_of_type(type)
            return res.status(200).json({books: books})
        } else {
            return res.status(400).json({message: message.book.missing_type})
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
router.post('/', auth.verifyAdmin, slugify.get_endpoint, async (req, res, next) => {
    var book = req.body
    try {
        if (!book.title) {
            res.status(400).json({message: message.book.missing_title})
        } else if (!book.type) {
            res.status(400).json({message: message.book.missing_type})
        } else {
            // await TransactionController.begin()
            let genres = book.genres
            book = await BookController.add(book)
            if (genres) await BookController.add_book_genres(book.endpoint, genres)
            let view = await BookController.add_view(book.endpoint, new Date().toISOString().slice(0,10))
            book.view = view.view
            book.genres = genres
            // genres.forEach(async (genre) => {
            //     genre = await GenreController.get(genre)
            //     book.genres.push(genre)
            // })
            // await TransactionController.commit()
            res.status(200).json({book: book})
        }
    } catch (err) {
        // await TransactionController.rollback()
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
 router.patch('/:endpoint', auth.verifyAdmin, slugify.get_endpoint, async (req, res, next) => {
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
        book = await BookController.update_info(book, endpoint)
        await TransactionController.commit()
        if (book) res.status(200).json({book: book})
        else res.status(404).json({message: message.book.not_found})
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
        if (book) res.status(200).json({book: book})
        else res.status(404).json({message: message.book.not_found})  
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

router.patch('/rate/:endpoint', auth.verifyUser, async (req, res, next) => {
    let endpoint = req.params.endpoint
    var rating = req.body.rating
    try {
        if (!rating) {
            return res.status(400).json({message: message.book.missing_rating})
        } else if (rating > 5.0) {
            return res.status(400).json({message: message.book.rating_constraint})
        } else {
            var book = await BookController.get(endpoint)
            if (book) {
                rating = Math.max(rating, 3.5) // :D hehe tất cả các đánh giá dưới 3.5 đều chuyển thành 3.5 để ko ảnh hưởng lớn đến điểm rating
                book.rate_count = Math.min(book.rate_count + 1, constants.max_int)
                book.rating = ((book.rating * (book.rate_count - 1)) + rating)/book.rate_count
                book.rating = book.rating.toFixed(1)
                var obj = await BookController.update_rating(book, endpoint)
                book.rating = obj.rating
                book.rate_count = obj.rate_count
                res.status(200).json({book: book})
            }
            else res.status(404).json({message: message.book.not_found})
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
 * xoá book - cập nhật status = -1
 * @body {}
 * @returns book
 */
 router.delete('/:endpoint', async (req, res, next) => {
    let book
    let endpoint = req.params.endpoint
    try {
        book = await BookController.delete(endpoint)
        if (book) res.status(200).json({book: book})
        else res.status(404).json({message: message.book.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router