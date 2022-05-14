const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')

const genre = require('./routers/genre')
const book = require('./routers/book')
const user = require('./routers/user')
const notify = require('./routers/notify')
const comment = require('./routers/comment')
const chapter = require('./routers/chapter')
const upload = require('./routers/upload')


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'OneRead API',
            version: '1.0.0',
            description: 'A simple api for reader'
        },
        servers: [
            { url: 'http://localhost:3000' },
            { url: 'https://one-read-v2.herokuapp.com' }
        ]
    },
    apis: ['./swagger/*.js']
}
const docs = swaggerJsDoc(options)

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

function postTrimmer(req, res, next) {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof (value) === 'string')
            req.body[key] = value.trim()
    }
    next()
}

app.use(postTrimmer)

process.env.TZ = 'Asia/Ho_Chi_Minh'


app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(docs))
app.use('/book', book)
app.use('/genre', genre)
app.use('/user', user)
app.use('/notify', notify)
app.use('/comment', comment)
app.use('/chapter', chapter)
app.use('/file', upload)
app.use('/', (req, res, next) => {
    res.json({ message: 'ONE' })
})

app.listen(port, () => console.log(`Listening on port ${port}`))

