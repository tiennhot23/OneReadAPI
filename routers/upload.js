const express = require('express')
const multer = require('multer')

const message = require('../configs/messages')
const FileModule = require('../modules/FileModule')

const router = express.Router()
const upload = multer({
    storage: multer.memoryStorage()
})

router.post('/upload/single', upload.any('file'), async (req, res, next) => {
    if (!req.files || req.files.length == 0 || req.files[0].fieldname !== 'file') {
        return res.status(400).json({
            status: 'fail',
            code: 400,
            message: message.file.not_exist,
            data: []
        })
    }

    const url = await FileModule.upload_single(req.files[0], '')

    res.send(url)
})

module.exports = router 