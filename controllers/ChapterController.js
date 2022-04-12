const ChapterModule = require('../modules/ChapterModule')
const UserModule = require('../modules/UserModule')
const HistoryModule = require('../modules/HistoryModule')
const NotifyModule = require('../modules/NotifyModule')
const BookModule = require('../modules/BookModule')
const FileModule = require('../modules/FileModule')
const message = require('../configs/messages')
const utils = require('../utils/utils')


const chapter = {}

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
            case 'chapter_pk': {
                utils.onResponse(res, 'fail', 400, message.chapter.chapter_pk, null, null)
                break
            }
            case 'book_fk': {
                utils.onResponse(res, 'fail', 404, message.chapter.book_fk, null, null)
                break
            }
            default: {
                utils.onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else utils.onResponse(res, 'fail', err.code, err.message, null, null)
}

chapter.onGetResult = (data, req, res, next) => {
    if (data instanceof Error) {
        onCatchError(data, res)
    } else {
        utils.onResponse(res, 'success', 200, data.message, data.page, data.data)
    }
}



chapter.getAllChapter = async (req, res, next) => {
    try {
        if (!await BookModule.get(req.params.book_endpoint)) return next(new Err(message.book.not_found, 404))
        next({data: await ChapterModule.get_all(req.params.book_endpoint)})
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

chapter.getDetailChapter = async (req, res, next) => {
    var chapter
    try {
        if (!await BookModule.get(req.params.book_endpoint)) return next(new Err(message.book.not_found, 404))
        chapter = await ChapterModule.get_detail(req.params.book_endpoint, req.params.chapter_endpoint)
        if (chapter) {
            let authHeader = req.headers['authorization']
            let token = authHeader && authHeader.split(' ')[1]
            if (token) {
                let user = await UserModule.get_data_from_token(token)
                let history = {
                    book_endpoint: req.params.book_endpoint,
                    chapter_endpoint: req.params.chapter_endpoint,
                    username: user.username
                }
                if (await HistoryModule.get(history)) 
                    await HistoryModule.update(history, new Date())
                else await HistoryModule.add(history)
            }

            let time = new Date().toISOString().slice(0, 10)
            if (await BookModule.get_view(req.params.book_endpoint, time))
                await BookModule.update_view(req.params.book_endpoint, time)
            else await BookModule.add_view(req.params.book_endpoint, time)

            next({data: [chapter]})
        } else next(new Err(message.chapter.not_found, 404))
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}


chapter.addComicChapter = async (req, res, next) => {
    var chapter = {
        chapter_endpoint: req.body.endpoint,
        book_endpoint: req.params.book_endpoint,
        title: req.body.title
    }
    var isSendData = false
    try {
        var book = await BookModule.get(chapter.book_endpoint)
        if (!book) return next(new Err(message.book.not_found, 404))
        else if (book.type != 'Comic') return next(new Err(message.book.only_comic_allowed, 400))
        else if (!chapter.title) return next(new Err(message.chapter.missing_title, 400))
        else if (!req.files || req.files.length == 0) return next(new Err(message.chapter.missing_images, 400))

        let images = Array.isArray(req.body.images) ? req.body.images : (req.body.images) ? [req.body.images] : null
        
        chapter.images = await FileModule.upload_multi_with_index(req.files, 
            'chapter/' + chapter.book_endpoint + '/' + chapter.chapter_endpoint + '/')

        chapter = await ChapterModule.add(chapter)
        
        var followers = await BookModule.get_user_follow(chapter.book_endpoint)
        followers.forEach(user => {
            let notify = {
                endpoint: `+chapter+${chapter.book_endpoint}+${chapter.chapter_endpoint}`,
                username: user.username,
                content: message.notify.new_chapter_notification
            }
            NotifyModule.add(notify)
        })
        isSendData = true
        next({data: [chapter], message: message.chapter.add_success})
    } catch (e) {
        if (e.constraint == 'notify_pk' && !isSendData) 
            return next({data: [chapter], message: message.chapter.add_success})
        next(new Err(e.message, 500,  e.constraint))
    }
}

chapter.addNovelChapter = async (req, res, next) => {
    var chapter = {
        chapter_endpoint: req.body.endpoint,
        book_endpoint: req.params.book_endpoint,
        title: req.body.title,
        images: images = Array.isArray(req.body.images) ? req.body.images : (req.body.images) ? [req.body.images] : null
    }
    var isSendData = false
    try {
        var book = await BookModule.get(chapter.book_endpoint)
        if (!book) return next(new Err(message.book.not_found, 404))
        else if (book.type == 'Comic') return next(new Err(message.book.only_novel_allowed, 400))
        else if (!chapter.title) return next(new Err(message.chapter.missing_title, 400))
        else if (!chapter.images || chapter.images.length == 0) return next(new Err(message.chapter.missing_images, 400))

        chapter = await ChapterModule.add(chapter)
        
        var followers = await BookModule.get_user_follow(chapter.book_endpoint)
        followers.forEach(user => {
            let notify = {
                endpoint: `+chapter+${chapter.book_endpoint}+${chapter.chapter_endpoint}`,
                username: user.username,
                content: message.notify.new_chapter_notification
            }
            NotifyModule.add(notify)
        })
        isSendData = true
        next({data: [chapter], message: message.chapter.add_success})
    } catch (e) {
        if (e.constraint == 'notify_pk' && !isSendData) 
            return next({data: [chapter], message: message.chapter.add_success})
        next(new Err(e.message, 500,  e.constraint))
    }
}



chapter.deleteChapter = async (req, res, next) => {
    try {
        var chapter = await ChapterModule.delete(req.params.book_endpoint, req.params.chapter_endpoint)
        if (chapter) next ({data: [chapter], message: message.chapter.delete_success})
        else next(new Err(message.chapter.not_found, 404))
    } catch (e) {
        next(new Err(e.message, 500,  e.constraint))
    }
}


module.exports = chapter;