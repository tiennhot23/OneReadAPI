const BookModule = require('../modules/BookModule')
const NotifyModule = require('../modules/NotifyModule')
const GenreModule = require('../modules/GenreModule')
const FileModule = require('../modules/FileModule')
const utils = require('../utils/utils')
const constants = require('../configs/constants')
const message = require('../configs/messages')

const book = {}
class Err extends Error {
    constructor(message, code, constraint) {
      super(message)
      this.message = message
      this.code = code
      this.constraint = constraint
    }
}


function onCatchError(err, res) {
    if (err.constraint) {
        switch (err.constraint) {
            case 'book_pk': {
                utils.onResponse(res, 'fail', 400,  message.book.book_pk, null, null)
                break
            }
            case 'type_constraint': {
                utils.onResponse(res, 'fail', 400, message.book.type_constraint, null, null)
                break
            }
            case 'genre_fk': {
                utils.onResponse(res, 'fail', 404, message.genre.not_found, null, null)
                break
            }
            case 'book_fk': {
                utils.onResponse(res, 'fail', 404,  message.book.not_found, null, null)
                break
            }
            default: {
                utils.onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else utils.onResponse(res, 'fail', err.code, err.message, null, null)
}

book.onGetResult = (data, req, res, next) => {
    if (data instanceof Error) {
        onCatchError(data, res)
    } else {
        utils.onResponse(res, 'success', 200, data.message, data.page, data.data)
    }
}



book.getAllBook = async (req, res, next) => {
    var page = req.query.page
    if (!page) page = 1
    var filter = utils.parseQueryParamObjToJson(req.query.filter)
    try {
        if (filter.genres && filter.genres.length > 0) {
            next({
                data: await BookModule.filter_with_genres(filter, page),
                page: page
            })
        } else {
            next({
                data: await BookModule.filter_without_genres(filter, page),
                page: page
            })
        }
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getSuggestBook = async (req, res, next) => {
    var user = req.user
    try {
        next({
            data: await BookModule.get_suggest_book(user.username)
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getTopSearch = async (req, res, next) => {
    try {
        next({
            data: await BookModule.get_top_search()
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getTopRating = async (req, res, next) => {
    try {
        next({
            data: await BookModule.get_top_rating()
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getTopDay = async (req, res, next) => {
    try {
        next({
            data: await BookModule.get_top_day()
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getTopMonth = async (req, res, next) => {
    try {
        next({
            data: await BookModule.get_top_month()
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getTopYear = async (req, res, next) => {
    try {
        next({
            data: await BookModule.get_top_year()
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getTopFollow = async (req, res, next) => {
    try {
        next({
            data: await BookModule.get_top_follow()
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getlastUpdate = async (req, res, next) => {
    try {
        next({
            data: await BookModule.get_last_update()
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getRelateBook = async (req, res, next) => {
    try {
        if (!await BookModule.get(req.params.endpoint)) return next(new Err(message.book.not_found, 404))
        next({
            data: await BookModule.get_relate_book(req.params.endpoint)
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getBookFollower = async (req, res, next) => {
    try {
        if (!await BookModule.get(req.params.endpoint)) return next(new Err(message.book.not_found, 404))
        next({
            data: await BookModule.get_user_follow(req.params.endpoint)
        })
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.getDetailBook = async (req, res, next) => {
    try {
        var book = await BookModule.get_detail(req.params.endpoint)
        if (!book) return next(new Err(message.book.not_found, 404))
        await BookModule.update_info({
            endpoint: req.params.endpoint,
            search_number: Math.min(book.search_number + 1, constants.max_int)
        }, req.params.endpoint)
        next({data: [book]})
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}   



book.addBook = async (req, res, next) => {
    var book = req.body
    try {
        if (!book.title) return next(new Err(message.book.missing_title, 400))
        else if (!book.type) return next(new Err(message.book.missing_type, 400))
        else if (!req.files['thumb']) return next(new Err(message.book.missing_thumb, 400))
        else if (!req.files['theme']) return next(new Err(message.book.missing_theme, 400))
        else if (!req.files['thumb'][0]['mimetype'].includes('image')) return next(new Err(message.book.thumb_invalid, 400))
        else if (!req.files['theme'][0]['mimetype'].includes('image')) return next(new Err(message.book.theme_invalid, 400))
        
        book.thumb = await FileModule.upload_single(req.files['thumb'][0],
            'book/' + book.endpoint + '/', 'thumb')
        book.theme = await FileModule.upload_single(req.files['theme'][0],
            'book/' + book.endpoint + '/', 'theme')
        
        book = await BookModule.add(book)
        book.view = 0
        book.follow = 0
        book.genres = []

        let genres = Array.isArray(req.body.genres) ? req.body.genres : (req.body.genres) ? [req.body.genres] : null
        if (genres) {
            let bookgenre = await BookModule.add_book_genres(book.endpoint, genres)
            for (bg of bookgenre) {
                book.genres.push(await GenreModule.get(bg.genre_endpoint))
            }
        }

        await BookModule.add_view(book.endpoint, new Date().toISOString().slice(0, 10))
        
        next({data: [book], message: message.book.add_success})
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}


book.updateBook = async (req, res, next) => {
    var book = req.body
    book.endpoint = req.params.endpoint
    try {
        if (!await BookModule.get(req.params.endpoint)) return next(new Err(message.book.not_found, 404))

        if (req.files['thumb']) {
            if (!req.files['thumb'][0]['mimetype'].includes('image')) return next(new Err(message.book.thumb_invalid, 400))
            else book.thumb = await FileModule.upload_single(req.files['thumb'][0],
                'book/' + book.endpoint + '/', 'thumb')
        } 
        if (req.files['theme']) {
            if (!req.files['theme'][0]['mimetype'].includes('image')) return next(new Err(message.book.theme_invalid, 400))
            else book.theme = await FileModule.upload_single(req.files['theme'][0],
                'book/' + book.endpoint + '/', 'theme')
        }

        book = await BookModule.update_info(book, req.params.endpoint)
        book.view = (await BookModule.get_view_all(req.params.endpoint)).length
        book.follow = (await BookModule.get_user_follow(req.params.endpoint)).length
        book.genres = []

        let genres = Array.isArray(req.body.genres) ? req.body.genres : (req.body.genres) ? [req.body.genres] : null
        if (genres) {
            await BookModule.delete_all_genres(req.params.endpoint)
            let bookgenre = await BookModule.add_book_genres(book.endpoint, genres)
            for (bg of bookgenre) {
                book.genres.push(await GenreModule.get(bg.genre_endpoint))
            }
        }
        next({data: [book], message: message.book.update_success})
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

book.finishBook = async (req, res, next) => {
    var book
    var isSendData = false
    try {
        var book = await BookModule.update_info({
            status: 1,
        }, req.params.endpoint)
        if (book) {
            book = await BookModule.get_detail(req.params.endpoint)

            var followers = await BookModule.get_user_follow(book.endpoint)
            followers.forEach(user => {
                let notify = {
                    endpoint: `+book+${book.endpoint}`,
                    username: user.username,
                    content: message.notify.book_finish_notification
                }
                NotifyModule.add(notify)
            })
            isSendData = true
            next({data: [book], message: message.book.update_success})
        } else next(new Err(message.book.not_found, 404))
    } catch (e) {
        if (e.constraint == 'notify_pk' && !isSendData) 
            return next({data: [book], message: message.book.update_success})
        next(new Err(e.message, 500,  e.constraint))
    }
}

book.rateBook = async (req, res, next) => {
    var rating = req.body.rating
    try {
        if (!rating) return next(new Err(message.book.missing_rating, 400))
        if (rating > 5.0) return next(new Err(message.book.rating_constraint, 400))

        var book = await BookModule.get_detail(req.params.endpoint)
        if (book) {
            rating = Math.max(rating, 3.5)
            rating = ((book.rating * (book.rate_count - 1)) + rating) / book.rate_count
            rating = rating.toFixed(1)
            book.rating = Number(rating)
            book.rate_count = Math.min(book.rate_count + 1, constants.max_int)
            await BookModule.update_info({
                rating: book.rating,
                rate_count: book.rate_count
            }, req.params.endpoint)
            
            next({data: [book], message: message.book.update_success})
        } else next(new Err(message.book.not_found, 404))
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}


book.deleteBook = async (req, res, next) => {
    try {
        var book = await BookModule.delete(req.params.endpoint)
        if (book) next ({data: [book], message: message.book.delete_success})
        else next(new Err(message.book.not_found, 404))
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

module.exports = book;