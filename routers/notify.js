const express = require('express')

const router = express.Router()
const NotifyController = require('../controllers/NotifyController')
const auth = require('../middlewares/auth')

router.get('/all', auth.verifyUser, NotifyController.getAllNotification, NotifyController.onGetResult)

router.get('/:endpoint', auth.verifyUser, NotifyController.readNotification, NotifyController.onGetResult)

router.delete('/all-read', auth.verifyUser, NotifyController.deleteAllRead, NotifyController.onGetResult)

router.delete('/:endpoint', auth.verifyUser, NotifyController.deleteOne, NotifyController.onGetResult)

module.exports = router