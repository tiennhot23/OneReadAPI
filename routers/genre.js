const express = require('express')

const router = express.Router()
const GenreController = require('../controllers/GenreController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')
const auth = require('../middlewares/auth')

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

/**
 * Lấy toàn bộ tag thể loại
 * @query
 * @body 
 * @return 
    data[{endpoint, title,description}]
 */
router.get('/all', async (req, res, next) => {
    var genres
    try {
        genres = await GenreController.list()
        onResponse(res, 'success', 200, null, null, genres)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Chi tiết thể loại
 * @query
 * @body 
 * @return 
    data[{endpoint, title, description}]
 */
router.get('/detail/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var genre
    try {
        if (endpoint) {
            genre = await GenreController.get(endpoint)
            if (genre) onResponse(res, 'success', 200, null, null, [genre])
            else onResponse(res, 'fail', 404, message.genre.not_found, null, null)
        } else {
            onResponse(res, 'fail', 400, message.genre.missing_endpoint, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
    }
})



/**
 * Thêm thể loại
 * @query
 * @body {title, (description)}
 * @return 
    data[{endpoint, title, description}]
 */
router.post('/', auth.verifyAdmin, slugify.get_endpoint, async (req, res, next) => {
    var genre = {
        endpoint: req.body.endpoint,
        title: req.body.title,
        description: req.body.description
    }
    try {
        if (genre.title) {
            genre = await GenreController.add(genre)
            onResponse(res, 'success', 200, message.genre.add_success, null, [genre])
        } else {
            onResponse(res, 'fail', 400, message.genre.missing_title, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Cập nhật thể loại
 * @query
 * @body {title, (description)}
 * @return 
    data[{endpoint, title, description}]
 */
router.patch('/:endpoint', auth.verifyAdmin, slugify.get_endpoint, async (req, res, next) => {
    var genre = {
        endpoint: req.body.endpoint,
        title: req.body.title,
        description: req.body.description
    }
    let endpoint = req.params.endpoint
    try {
        genre = await GenreController.update(genre, endpoint)
        if (genre) onResponse(res, 'success', 200, message.genre.update_success, null, [genre])
        else onResponse(res, 'fail', 404, message.genre.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Xóa thể loại
 * @query
 * @body 
 * @return 
    data[{endpoint, title, description}]
 */
router.delete('/:endpoint', auth.verifyAdmin, async (req, res, next) => {
    let genre
    let endpoint = req.params.endpoint
    try {
        genre = await GenreController.delete(endpoint)
        if (genre) onResponse(res, 'success', 200, message.genre.delete_success, null, [genre])
        else onResponse(res, 'fail', 404, message.genre.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})

module.exports = router