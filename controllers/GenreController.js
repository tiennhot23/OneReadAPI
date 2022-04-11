const GenreModule = require('../modules/GenreModule')
const CommentModule = require('../modules/CommentModule')
const BookModule = require('../modules/BookModule')
const NotifyModule = require('../modules/NotifyModule')
const FileModule = require('../modules/FileModule')
const UserModule = require('../modules/UserModule')
const message = require('../configs/messages')
const constants = require('../configs/constants')
const utils = require('../utils/utils')

const genre = {}

class Err extends Error {
    constructor(message, code) {
      super(message);
      this.message = message;
      this.code = code;
    }
}

function onCatchError(err, res) {
    if (err.constraint) {
        switch (err.constraint) {
            case 'genre_pk': {
                onResponse(res, 'fail', 400, message.genre.genre_pk, null, null)
                break
            }
            default: {
                onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else onResponse(res, 'fail', 500, err.message, null, null)
}

genre.onGetResult = (data, req, res, next) => {
    if (data instanceof Error) {
        onCatchError(data, res)
    } else {
        utils.onResponse(res, 'success', 200, data.message, data.page, data.data)
    }
}

genre.getAllGenre = async (req, res, next) => {
    try {
        next({data: await GenreModule.get_all()})
    } catch(e) {next(new Err(e.message, 500))}
}

genre.addGenre = async (req, res, next) => {
    var genre = {
        endpoint: req.body.endpoint,
        title: req.body.title,
        description: req.body.description
    }
    try {
        if (!genre.title) return next(new Err(message.genre.missing_title, 400))
        next({data: await GenreModule.add(genre)})
    } catch (e) {next(new Err(e.message, 500))}
}

genre.updateGenre = async (req, res, next) => {
    var genre = req.body
    try {
        genre = await GenreModule.update(genre, req.params.endpoint)
        if (genre) next({data: [genre], message: message.genre.update_success})
        else next(new Err(message.genre.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

genre.deleteGenre = async (req, res, next) => {
    try {
        var genre = await GenreModule.delete(req.params.endpoint)
        if (genre) next({data: [genre], message: message.genre.delete_success})
        else next(new Err(message.genre.not_found, 404))
    } catch (e) {next(new Err(e.message, 500))}
}

module.exports = genre