const express = require('express')

const router = express.Router()
const ChapterController = require('../controllers/ChapterController')
const TransactionController = require('../controllers/TransactionContoller')
const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

router.get('/:book_endpoint/all', async (req, res, next) => {
    let book_endpoint = req.params.book_endpoint
    var chapters
    try {
        chapters = await ChapterController.list(book_endpoint)
        res.status(200).json(chapters)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:book_endpoint/:chapter_endpoint', async (req, res, next) => {
    let chapter_endpoint = req.params.chapter_endpoint
    let book_endpoint = req.params.book_endpoint
    var chapter
    try {
        if (chapter_endpoint) {
            chapter = await ChapterController.get(book_endpoint, chapter_endpoint)
            if (chapter) res.status(200).json(chapter)
            else res.status(404).json({message: message.chapter.not_found})
        } else {
            res.status(400).json({message: message.chapter.missing_chapter_endpoint})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


router.post('/', slugify.get_endpoint, async (req, res, next) => {
    var chapter = {
        chapter_endpoint: req.body.endpoint,
        book_endpoint: req.body.book_endpoint,
        title: req.body.title,
        images: req.body.images
    }
    try {
        if (!chapter.title) {
            res.status(400).json({message: message.chapter.missing_title})
        } else if (!chapter.images || chapter.images.length == 0) {
            res.status(400).json({message: message.chapter.missing_images})
        } else if (!chapter.book_endpoint) {
            res.status(400).json({message: message.chapter.missing_book_endpoint})
        } else {
            await TransactionController.begin()
            chapter = await ChapterController.add(chapter)
            chapter.images = req.body.images
            let images = await ChapterController.add_chapter_detail(chapter)
            chapter.images = images.images
            await TransactionController.commit()
            return res.status(200).json(chapter)
        }
    } catch (err) {
        await TransactionController.rollback()
        if (err.constraint){
            switch (err.constraint) {
                case 'chapter_pk': {
                    res.status(400).json({message: message.chapter.chapter_pk})
                    break
                }
                case 'chapter_detail_fk': {
                    res.status(400).json({message: message.chapter.chapter_detail_fk})
                    break
                }
                case 'book_fk': {
                    res.status(400).json({message: message.chapter.book_fk})
                    break
                }
                default: {
                    res.status(500).json({message: err.message})
                    break;
                }
            }
        }
        else res.status(500).json({message: err.message})
    }
})

/**
 * cập nhật chapter
 * @body {chapter_endpoint, (title), (description)}
 * @returns chapter
 */
 router.patch('/:chapter_endpoint', slugify.get_endpoint, async (req, res, next) => {
    let chapter_endpoint = req.params.chapter_endpoint
    var chapter = {
        chapter_endpoint: req.body.endpoint,
        book_endpoint: req.body.book_endpoint,
        title: req.body.title,
        images: req.body.images
    }
    try {
        if (!chapter.book_endpoint) {
            return res.status(400).json({message: message.chapter.missing_book_endpoint})
        }
        await TransactionController.begin()
        if (chapter.title) {
            chapter = await ChapterController.update(chapter, chapter_endpoint)
        } 
        if (chapter) {
            if (chapter.images && chapter.images.length != 0) {
                chapter.images = req.body.images
                chapter.images = await ChapterController.update_chapter_images(chapter)
            }
            await TransactionController.commit()
            return res.status(200).json(chapter)
        } else {
            await TransactionController.commit()
            return res.status(404).json({message: message.chapter.not_found})
        }
    } catch (err) {
        await TransactionController.rollback()
        if (err.constraint){
            switch (err.constraint) {
                case 'chapter_pk': {
                    res.status(400).json({message: message.chapter.chapter_pk})
                    break
                }
                case 'chapter_detail_fk': {
                    res.status(400).json({message: message.chapter.chapter_detail_fk})
                    break
                }
                case 'book_fk': {
                    res.status(400).json({message: message.chapter.book_fk})
                    break
                }
                default: {
                    res.status(500).json({message: err.message})
                    break;
                }
            }
        }
        else res.status(500).json({message: err.message})
    }
})

/**
 * xoá chapter
 * @body {chapter_endpoint, title, (description)}
 * @returns chapter
 */
 router.delete('/:book_endpoint/:chapter_endpoint', async (req, res, next) => {
    var chapter
    let chapter_endpoint = req.params.chapter_endpoint
    let book_endpoint = req.params.book_endpoint
    try {
        chapter = await ChapterController.delete(book_endpoint, chapter_endpoint)
        if (chapter) res.status(200).json(chapter)
        else res.status(404).json({message: message.chapter.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router