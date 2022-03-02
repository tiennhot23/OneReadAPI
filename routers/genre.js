const express = require('express')

const router = express.Router()
const GenreController = require('../controllers/GenreController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')
const auth = require('../middlewares/auth')

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
        res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            data: genres
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
            if (genre) res.status(200).json({
                status: 'success',
                code: 200,
                message: null,
                data: [genre]
            })
            else res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.genre.not_found,
                data: null
            })
        } else {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.genre.missing_endpoint,
                data: null
            })
        }
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
            res.status(200).json({
                status: 'success',
                code: 200,
                message: message.genre.add_success,
                data: [genre]
            })
        } else {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.genre.missing_title,
                data: null
            })
        }
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'genre_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.genre.genre_pk,
                        data: null
                    })
                    break
                }
                default: {
                    res.status(500).json({
                        status: 'fail',
                        code: 500,
                        message: err.message,
                        data: null
                    })
                    break;
                }
            }
        } else res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
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
        if (genre) res.status(200).json({
            status: 'success',
            code: 200,
            message: message.genre.update_success,
            data: [genre]
        })
        else res.status(404).json({
            status: 'fail',
            code: 404,
            message: message.genre.not_found,
            data: null
        })
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'genre_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.genre.genre_pk,
                        data: null
                    })
                    break
                }
                default: {
                    res.status(500).json({
                        status: 'fail',
                        code: 500,
                        message: err.message,
                        data: null
                    })
                    break;
                }
            }
        } else res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

/**
 * Xóa thể loại
 * @query
 * @body {title, (description)}
 * @return 
    data[{endpoint, title, description}]
 */
router.delete('/:endpoint', auth.verifyAdmin, async (req, res, next) => {
    let genre
    let endpoint = req.params.endpoint
    try {
        genre = await GenreController.delete(endpoint)
        if (genre) res.status(200).json({
            status: 'success',
            code: 200,
            message: message.genre.delete_success,
            data: [genre]
        })
        else res.status(404).json({
            status: 'fail',
            code: 404,
            message: message.genre.not_found,
            data: null
        })
    } catch (err) {
        res.status(500).json({
            status: 'fail',
            code: 500,
            message: err.message,
            data: null
        })
    }
})

module.exports = router