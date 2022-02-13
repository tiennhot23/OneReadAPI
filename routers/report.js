const express = require('express')

const router = express.Router()
const ReportController = require('../controllers/ReportController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

router.get('/all', async (req, res, next) => {
    var reports
    try {
        reports = await ReportController.list()
        res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            data: reports
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

router.patch('/:type/:endpoint', async (req, res, next) => {
    var report = {
        type: req.params.type,
        endpoint: req.params.endpoint,
        status: req.body.status
    }
    try {
        if (!report.endpoint) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.report.missing_endpoint,
                data: null
            })
        } else if (!report.type) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.report.missing_type,
                data: null
            })
        } else if (!report.status) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.report.missing_status,
                data: null
            })
        } else {
            report = await ReportController.update_status(report)
            if (report) res.status(200).json({
                status: 'success',
                code: 200,
                message: null,
                data: [report]
            })
            else res.status(404).json({
                status: 'fail',
                code: 404,
                message: message.report.not_found,
                data: null
            })
        }
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'report_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.report.report_pk,
                        data: null
                    })
                    break
                }
                case 'type_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.report.type_constraint,
                        data: null
                    })
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.report.status_constraint,
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
                    break
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
 * thêm report
 * @body {endpoint, type {A,C}, reason}
 * @returns report
 */
router.post('/:username', slugify.get_endpoint, async (req, res, next) => {
    var report = req.body
    try {
        if (!report.endpoint) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.report.missing_endpoint,
                data: null
            })
        } else if (!report.type) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.report.missing_type,
                data: null
            })
        } else if (!report.reason) {
            res.status(400).json({
                status: 'fail',
                code: 400,
                message: message.report.missing_reason,
                data: null
            })
        } else {
            if (await ReportController.get(report.endpoint, report.type)) {
                report = await ReportController.add_exist(report)
            } else {
                report = await ReportController.add(report)
            }
            res.status(200).json({
                status: 'success',
                code: 200,
                message: null,
                data: [report]
            })
        }
    } catch (err) {
        if (err.constraint) {
            switch (err.constraint) {
                case 'report_pk': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.report.report_pk,
                        data: null
                    })
                    break
                }
                case 'type_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.report.type_constraint,
                        data: null
                    })
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({
                        status: 'fail',
                        code: 400,
                        message: message.report.status_constraint,
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
                    break
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
        if (report) res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            data: [report]
        })
        else res.status(404).json({
            status: 'fail',
            code: 404,
            message: message.report.not_found,
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

/**
 * xoá các report đã được xử lí
 * @body 
 * @returns reports
 */
router.delete('/read-report', async (req, res, next) => {
    let reports
    try {
        reports = await ReportController.deleteRead()
        res.status(200).json({
            status: 'success',
            code: 200,
            message: null,
            data: reports
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