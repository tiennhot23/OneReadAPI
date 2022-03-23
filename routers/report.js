const express = require('express')

const router = express.Router()
const ReportController = require('../controllers/ReportController')

const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

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
            case 'report_pk': {
                onResponse(res, 'fail', 400, message.report.report_pk, null, null)
                break
            }
            case 'type_constraint': {
                onResponse(res, 'fail', 400, message.report.type_constraint, null, null)
                break
            }
            case 'status_constraint': {
                onResponse(res, 'fail', 400, message.report.status_constraint, null, null)
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
 * Lấy danh sách các báo cáo xắp xếp theo mới nhất
 * @query 
 * @body 
 * @return 
    data[{endpoint (id for type C, username for type A), 
        type (A: account, C: comment), num, reason, status, time}]
 */
router.get('/all', async (req, res, next) => {
    var reports
    try {
        reports = await ReportController.list()
        onResponse(res, 'success', 200, null, null, reports)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Cập nhật trạng thái của thông báo
 * @query 
 * @body {status}
 * @return 
    data[{endpoint (id for type C, username for type A), 
        type (A: account, C: comment), num, reason, status, time}]
 */
router.patch('/:type/:endpoint', async (req, res, next) => {
    var report = {
        type: req.params.type,
        endpoint: req.params.endpoint,
        status: req.body.status
    }
    try {
        if (!report.endpoint) {
            onResponse(res, 'fail', 400, message.report.missing_endpoint, null, null)
        } else if (!report.type) {
            onResponse(res, 'fail', 400, message.report.missing_type, null, null)
        } else if (!report.status) {
            onResponse(res, 'fail', 400, message.report.missing_status, null, null)
        } else {
            report = await ReportController.update_status(report)
            if (report) onResponse(res, 'success', 200, message.report.update_success, null, [report])
            else onResponse(res, 'fail', 404, message.report.not_found, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
    }
})



/**
 * Thêm báo cáo, cập nhật số lần báo cáo num nếu trùng
 * @query 
 * @body {endpoint, type (A hoặc C), reason}
 * @return 
    data[{endpoint (id for type C, username for type A), 
        type (A: account, C: comment), num, reason, status, time}]
 */
router.post('/:username', async (req, res, next) => {
    var report = req.body
    try {
        if (!report.endpoint) {
            onResponse(res, 'fail', 400, message.report.missing_endpoint, null, null)
        } else if (!report.type) {
            onResponse(res, 'fail', 400, message.report.missing_type, null, null)
        } else if (!report.reason) {
            onResponse(res, 'fail', 400, message.report.missing_reason, null, null)
        } else {
            if (await ReportController.get(report.endpoint, report.type)) {
                report = await ReportController.add_exist(report)
            } else {
                report = await ReportController.add(report)
            }
            onResponse(res, 'success', 200, message.report.add_success, null, [report])
        }
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Xóa hoàn toàn báo cáo
 * @query 
 * @body
 * @return 
    data[{endpoint (id for type C, username for type A), 
        type (A: account, C: comment), num, reason, status, time}]
 */
router.delete('/:type/:endpoint', async (req, res, next) => {
    let report
    let endpoint = req.params.endpoint
    let type = req.params.type
    try {
        report = await ReportController.delete(endpoint, type)
        if (report) onResponse(res, 'success', 200, message.report.delete_success, null, [report])
        else onResponse(res, 'fail', 404, message.report.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Xóa các báo cáo đã đọc
 * @query 
 * @body
 * @return 
    data[{endpoint (id for type C, username for type A), 
        type (A: account, C: comment), num, reason, status, time}]
 */
router.delete('/read-report', async (req, res, next) => {
    let reports
    try {
        reports = await ReportController.deleteRead()
        onResponse(res, 'success', 200, message.report.delete_success, null, reports)
    } catch (err) {
        onCatchError(err, res)
    }
})

module.exports = router