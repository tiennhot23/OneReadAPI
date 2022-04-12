const GenreModule = require('../modules/GenreModule')
const CommentModule = require('../modules/CommentModule')
const BookModule = require('../modules/BookModule')
const NotifyModule = require('../modules/NotifyModule')
const FileModule = require('../modules/FileModule')
const UserModule = require('../modules/UserModule')
const message = require('../configs/messages')
const constants = require('../configs/constants')
const utils = require('../utils/utils')


const notify = {}

class Err extends Error {
    constructor(message, code, constraint) {
      super(message)
      this.message = message
      this.code = code
      this.constraint = constraint
    }
}

function onCatchError(err, res) {
    if (err.constraint) {
        switch (err.constraint) {
            case 'notify_pk': {
                utils.onResponse(res, 'fail', 400, message.notify.notify_pk, null, null)
                break
            }
            case 'username_fk': {
                utils.onResponse(res, 'fail', 404, message.notify.username_fk, null, null)
                break
            }
            case 'status_constraint': {
                utils.onResponse(res, 'fail', 400, message.notify.status_constraint, null, null)
                break
            }
            default: {
                utils.onResponse(res, 'fail', 500, err.message, null, null)
                break
            }
        }
    } else utils.onResponse(res, 'fail', err.code, err.message, null, null)
}

notify.onGetResult = (data, req, res, next) => {
    if (data instanceof Error) {
        onCatchError(data, res)
    } else {
        utils.onResponse(res, 'success', 200, data.message, data.page, data.data)
    }
}

notify.getAllNotification = async (req, res, next) => {
    var page = req.query.page
    if (!page) page = 1
    var user = req.user
    try {
        next({data: await NotifyModule.get_all(user.username, page)})
    } catch(e) {next(new Err(e.message, 500,  e.constraint))}
}

notify.readNotification = async (req, res, next) => {
    try {
        var notify = await NotifyModule.get(req.params.endpoint, req.user.username)
        if (notify) next({data: [notify]})
        else next(new Err(message.notify.not_found, 404))
    } catch(e) {next(new Err(e.message, 500,  e.constraint))}
}

notify.addNotification =  async (req, res, next) => {
    var notify = req.body
    try {
        if (!notify.endpoint) return next(new Err(message.notify.missing_endpoint, 400))
        else if (!notify.username) return next(new Err(message.notify.missing_username, 400))
        else if (!notify.content) return next(new Err(message.notify.missing_content, 400))
        notify = await NotifyModule.add(notify)
        next({data: [notify], message: message.notify.add_success})
    } catch(e) {next(new Err(e.message, 500,  e.constraint))}
}

notify.deleteAllRead =  async (req, res, next) => {
    try {
        next({data: await NotifyModule.deleteRead(), message: message.notify.delete_success})
    } catch(e) {next(new Err(e.message, 500,  e.constraint))}
}

notify.deleteOne = async (req, res, next) => {
    try {
        var notify = await NotifyModule.delete(req.params.endpoint, req.user.username)
        if (notify) next({data: [notify], message: message.notify.delete_success})
        else next(new Err(message.notify.not_found, 404))
    } catch(e) {next(new Err(e.message, 500,  e.constraint))}
}



module.exports = notify