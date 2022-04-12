const GenreModule = require('../modules/GenreModule')
const message = require('../configs/messages')
const utils = require('../utils/utils')

const genre = {}

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
            case 'genre_pk': {
                utils.onResponse(res, 'fail', 400, message.genre.genre_pk, null, null)
                break
            }
            default: {
                utils.onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else utils.onResponse(res, 'fail', err.code, err.message, null, null)
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
    } catch(e) {next(new Err(e.message, 500,  e.constraint))}
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
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

genre.updateGenre = async (req, res, next) => {
    var genre = req.body
    try {
        genre = await GenreModule.update(genre, req.params.endpoint)
        if (genre) next({data: [genre], message: message.genre.update_success})
        else next(new Err(message.genre.not_found, 404))
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

genre.deleteGenre = async (req, res, next) => {
    try {
        var genre = await GenreModule.delete(req.params.endpoint)
        if (genre) next({data: [genre], message: message.genre.delete_success})
        else next(new Err(message.genre.not_found, 404))
    } catch (e) {next(new Err(e.message, 500,  e.constraint))}
}

module.exports = genre