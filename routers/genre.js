const express = require('express')

const router = express.Router()
const GenreController = require('../controllers/GenreController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

router.get('/all', async (req, res, next) => {
    var genres
    try {
        genres = await GenreController.list()
        res.status(200).json(genres)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:endpoint', async (req, res, next) => {
    let endpoint = req.params.endpoint
    var genre
    try {
        if (endpoint) {
            genre = await GenreController.get(endpoint)
            res.status(200).json(genre)
        } else {
            res.status(400).json({message: message.genre.missing_endpoint})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})



/**
 * thêm genre
 * @body {endpoint, title, (description)}
 * @returns genre
 */
router.post('/', slugify.get_endpoint, async (req, res, next) => {
    var genre = {
        endpoint: req.body.endpoint,
        title: req.body.title,
        description: req.body.description
    }
    try {
        if (genre.title) {
            genre = await GenreController.add(genre)
            res.status(200).json(genre)
        } else {
            res.status(400).json({message: message.genre.missing_title})
        }
    } catch (err) {
        if (err.constraint){
            switch (err.constraint) {
                case 'genre_pk': {
                    res.status(400).json({message: message.genre.genre_pk})
                    break
                }
            }
        }
        res.status(500).json({message: err.message})
    }
})

/**
 * cập nhật genre
 * @body {endpoint, (title), (description)}
 * @returns genre
 */
 router.patch('/:endpoint', slugify.get_endpoint, async (req, res, next) => {
    var genre = {
        endpoint: req.body.endpoint,
        title: req.body.title,
        description: req.body.description
    }
    let endpoint = req.params.endpoint
    try {
        genre = await GenreController.update(genre, endpoint)
        if (genre) res.status(200).json(genre)
        else res.status(404).json({message: message.genre.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

/**
 * xoá genre
 * @body {endpoint, title, (description)}
 * @returns genre
 */
 router.delete('/:endpoint', async (req, res, next) => {
    let genre
    let endpoint = req.params.endpoint
    try {
        genre = await GenreController.delete(endpoint)
        if (genre) res.status(200).json(genre)
        else res.status(404).json({message: message.genre.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router