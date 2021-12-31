const express = require('express')

const router = express.Router()
const ReportController = require('../controllers/ReportController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

router.get('/all', async (req, res, next) => {
    var reports
    try {
        reports = await ReportController.list()
        res.status(200).json(reports)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.patch('/:type/:endpoint', async (req, res, next) => {
    var report = {
        type: req.params.type,
        endpoint: req.params.endpoint,
        status: req.body.status
    }
    try {
        if (!report.endpoint) {
            res.status(400).json({message: message.report.missing_endpoint})
        } else if (!report.type) {
            res.status(400).json({message: message.report.missing_type})
        } else if (!report.status) {
            res.status(400).json({message: message.report.missing_status})
        } else {
            report = await ReportController.update_status(report)
            if (report) res.status(200).json(report)
            else res.status(404).json({message: message.report.not_found})
        }
    } catch (err) {
        if (err.constraint){
            switch (err.constraint) {
                case 'report_pk': {
                    res.status(400).json({message: message.report.report_pk})
                    break
                }
                case 'type_constraint': {
                    res.status(400).json({message: message.report.type_constraint})
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({message: message.report.status_constraint})
                    break
                }
                default: {
                    res.status(500).json({message: err.message})
                    break
                }
            }
        } else res.status(500).json({message: err.message})
    }
})



/**
 * thêm report
 * @body {endpoint, type {A,C}, reason}
 * @returns report
 */
router.post('/:username', slugify.get_endpoint, async (req, res, next) => {
    var report = req.body
    try {
        if (!report.endpoint) {
            res.status(400).json({message: message.report.missing_endpoint})
        } else if (!report.type) {
            res.status(400).json({message: message.report.missing_type})
        } else if (!report.reason) {
            res.status(400).json({message: message.report.missing_reason})
        } else {
            if (await ReportController.get(report.endpoint, report.type)) {
                report = await ReportController.add_exist(report)
            } else {
                report = await ReportController.add(report)
            }
            res.status(200).json(report)
        }
    } catch (err) {
        if (err.constraint){
            switch (err.constraint) {
                case 'report_pk': {
                    res.status(400).json({message: message.report.report_pk})
                    break
                }
                case 'type_constraint': {
                    res.status(400).json({message: message.report.type_constraint})
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({message: message.report.status_constraint})
                    break
                }
                default: {
                    res.status(500).json({message: err.message})
                    break
                }
            }
        } else res.status(500).json({message: err.message})
    }
})

/**
 * xoá report
 * @body 
 * @returns report
 */
 router.delete('/:type/:endpoint', async (req, res, next) => {
    let report
    let endpoint = req.params.endpoint
    let type = req.params.type
    try {
        report = await ReportController.delete(endpoint, type)
        if (report) res.status(200).json(report)
        else res.status(404).json({message: message.report.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

/**
 * xoá các report đã được xử lí
 * @body 
 * @returns reports
 */
 router.delete('/read-report', async (req, res, next) => {
    let reports
    try {
        reports = await ReportController.deleteRead()
        res.status(200).json(reports)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router