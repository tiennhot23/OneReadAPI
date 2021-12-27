const express = require('express')
const cors = require('cors')

const conn = require('./connection')
const genre = require('./routers/genre')
const book = require('./routers/book')
const report = require('./routers/report')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/genre', genre)
app.use('/book', book)
app.use('/report', report)

app.listen(port, () => console.log(`Listening on port ${port}`))

