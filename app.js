const express = require('express')
const cors = require('cors')

const conn = require('./connection')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.listen(port, () => console.log(`Listening on port ${port}`))

