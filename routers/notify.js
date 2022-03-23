const express = require('express')

const router = express.Router()
const NotifyController = require('../controllers/NotifyController')
const auth = require('../middlewares/auth')
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
            case 'notify_pk': {
                onResponse(res, 'fail', 400, message.notify.notify_pk, null, null)
                break
            }
            case 'username_fk': {
                onResponse(res, 'fail', 400, message.notify.username_fk, null, null)
                break
            }
            case 'status_constraint': {
                onResponse(res, 'fail', 400, message.notify.status_constraint, null, null)
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
 * Lấy danh sách các thông báo của user theo từng trang
 * @query page
 * @body 
 * @return 
    data[{endpoint, username, content, status, time}]
 */
router.get('/all/:username', auth.verifyUser, async (req, res, next) => {
    var page = req.query.page
    if (!page) page = 1
    const user = req.user
    var notifys
    try {
        notifys = await NotifyController.list(user.username, page)
        onResponse(res, 'success', 200, null, page, notifys)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Lấy chi tiết thông báo và cập nhật status = 1 là đã đọc
 * @query 
 * @body 
 * @return 
    data[{endpoint, username, content, status, time}]
 */
router.get('/:endpoint/:username', auth.verifyUser, async (req, res, next) => {
    let username = req.user.username
    let endpoint = req.params.endpoint
    var notify
    try {
        if (!endpoint) {
            onResponse(res, 'fail', 400, message.notify.missing_endpoint, null, null)
        } else if (!username) {
            onResponse(res, 'fail', 400, message.notify.missing_username, null, null)
        } else {
            notify = await NotifyController.get(endpoint, username)
            if (notify) {
                onResponse(res, 'success', 200, null, null, [notify])
            } else onResponse(res, 'fail', 404, message.notify.not_found, null, null)
        }
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Thêm thông báo tới user
 * @query 
 * @body {endpoint, username, content}
 * @return 
    data[{endpoint, username, content, status, time}]
 */
router.post('/', auth.verifyAdmin, async (req, res, next) => {
    var notify = req.body
    try {
        if (!notify.endpoint) {
            onResponse(res, 'fail', 400, message.notify.missing_endpoint, null, null)
        } else if (!notify.username) {
            onResponse(res, 'fail', 400, message.notify.missing_username, null, null)
        } else if (!notify.content) {
            onResponse(res, 'fail', 400, message.notify.missing_content, null, null)
        } else {
            notify = await NotifyController.add(notify)
            onResponse(res, 'success', 200, message.notify.add_success, null, [notify])
        }
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Xóa các thông báo đã đọc
 * @query 
 * @body 
 * @return 
    data[{endpoint, username, content, status, time}]
 */
router.delete('/read-notify/:username', auth.verifyUser, async (req, res, next) => {
    let notifys
    try {
        notifys = await NotifyController.deleteRead()
        onResponse(res, 'success', 200, message.notify.delete_success, null, notifys)
    } catch (err) {
        onCatchError(err, res)
    }
})

/**
 * Xóa thông báo
 * @query 
 * @body 
 * @return 
    data[{endpoint, username, content, status, time}]
 */
router.delete('/:endpoint/:username', auth.verifyUser, async (req, res, next) => {
    let notify
    let endpoint = req.params.endpoint
    let username = req.user.username
    try {
        notify = await NotifyController.delete(endpoint, username)
        if (notify) onResponse(res, 'success', 200, message.notify.delete_success, null, [notify])
        else onResponse(res, 'fail', 404, message.notify.not_found, null, null)
    } catch (err) {
        onCatchError(err, res)
    }
})



module.exports = router