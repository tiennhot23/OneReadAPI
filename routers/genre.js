const express = require('express')

const router = express.Router()
const GenreController = require('../controllers/GenreController')

const slugify = require('../middlewares/slugify')
const auth = require('../middlewares/auth')

router.get('/all', GenreController.getAllGenre, GenreController.onGetResult)

router.post('/', auth.verifyAdmin, slugify.get_endpoint, GenreController.addGenre, GenreController.onGetResult)

router.patch('/:endpoint', auth.verifyAdmin, slugify.get_endpoint, GenreController.updateGenre, GenreController.onGetResult)

router.delete('/:endpoint', auth.verifyAdmin, GenreController.deleteGenre, GenreController.onGetResult)

module.exports = router