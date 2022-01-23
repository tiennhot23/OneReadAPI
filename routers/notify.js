const express = require('express')

const router = express.Router()
const NotifyController = require('../controllers/NotifyController')
const auth = require('../middlewares/auth')
const slugify = require('../middlewares/slugify')
const message = require('../configs/messages')

router.get('/all/:username', auth.verifyUser, async (req, res, next) => {
    const user = req.user
    var notifys
    try {
        notifys = await NotifyController.list(user.username)
        res.status(200).json({notifys: notifys})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:endpoint/:username', auth.verifyUser, async (req, res, next) => {
    let username = req.user.username
    let endpoint = req.params.endpoint
    var notify
    try {
        if (!endpoint) {
            res.status(400).json({message: message.notify.missing_endpoint})
        } else if (!username) {
            res.status(400).json({message: message.notify.missing_username})
        } else {
            notify = await NotifyController.get(endpoint, username)
            if (notify) {
                res.status(200).json({notify: notify})
            }
            else res.status(404).json({message: message.notify.not_found})
        }
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})



/**
 * thêm notify
 * @body {endpoint, username, content}
 * @returns notify
 */
router.post('/', auth.verifyAdmin, async (req, res, next) => {
    var notify = req.body
    try {
        if (!notify.endpoint) {
            res.status(400).json({message: message.notify.missing_endpoint})
        } else if (!notify.username) {
            res.status(400).json({message: message.notify.missing_username})
        } else if (!notify.content) {
            res.status(400).json({message: message.notify.missing_content})
        } else {
            notify = await NotifyController.add(notify)
            res.status(200).json({notify: notify})
        }
    } catch (err) {
        if (err.constraint){
            switch (err.constraint) {
                case 'notify_pk': {
                    res.status(400).json({message: message.notify.notify_pk})
                    break
                }
                case 'username_fk': {
                    res.status(400).json({message: message.notify.username_fk})
                    break
                }
                case 'status_constraint': {
                    res.status(400).json({message: message.notify.status_constraint})
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
 * xoá các notify đã đọc
 * @body 
 * @returns notifys
 */
 router.delete('/read-notify/:username', auth.verifyUser, async (req, res, next) => {
    let notifys
    try {
        notifys = await NotifyController.deleteRead()
        res.status(200).json({notifys: notifys})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

/**
 * xoá notify
 * @body 
 * @returns notify
 */
 router.delete('/:endpoint/:username', auth.verifyUser, async (req, res, next) => {
    let notify
    let endpoint = req.params.endpoint
    let username = req.user.username
    try {
        notify = await NotifyController.delete(endpoint, username)
        if (notify) res.status(200).json({notify: notify})
        else res.status(404).json({message: message.notify.not_found})
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})



module.exports = router