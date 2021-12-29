const express = require('express')
const cors = require('cors')

const conn = require('./connection')
const genre = require('./routers/genre')
const book = require('./routers/book')
const report = require('./routers/report')
const user = require('./routers/user')
const notify = require('./routers/notify')
const comment = require('./routers/comment')
const chapter = require('./routers/chapter')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

function postTrimmer(req, res, next) {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof(value) === 'string')
            req.body[key] = value.trim()
    }
    next()
}
  
app.use(postTrimmer)

app.use('/genre', genre)
app.use('/book', book)
app.use('/report', report)
app.use('/user', user)
app.use('/notify', notify)
app.use('/comment', comment)
app.use('/chapter', chapter)

app.listen(port, () => console.log(`Listening on port ${port}`))

