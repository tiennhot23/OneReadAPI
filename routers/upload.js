const express = require('express')
const multer = require('multer')

const message = require('../configs/messages')
const FileController = require('../controllers/FileController')

const router = express.Router()
const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload/single', upload.any('file'), async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({
            status: 'fail',
            code: 400,
            message: message.file.not_exist,
            data: []
        })
    }

    const url = await FileController.upload(req.file, '')

    res.send(url)
})

module.exports = router 