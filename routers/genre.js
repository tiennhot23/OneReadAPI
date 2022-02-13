const express = require('express')

const router = express.Router()
const GenreController = require('../controllers/GenreController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')
const auth = require('../middlewares/auth')

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
 * thêm genre
 * @body {endpoint, title, (description)}
 * @returns genre
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
                message: null,
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
 * cập nhật genre
 * @body {endpoint, (title), (description)}
 * @returns genre
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
            message: null,
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
 * xoá genre
 * @body {endpoint, title, (description)}
 * @returns genre
 */
router.delete('/:endpoint', auth.verifyAdmin, async (req, res, next) => {
    let genre
    let endpoint = req.params.endpoint
    try {
        genre = await GenreController.delete(endpoint)
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