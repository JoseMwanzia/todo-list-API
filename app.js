const express = require('express')
const router = require('./routes/todoRoutes')
require('dotenv').config()
const app = express()
const port = process.env.PORT

app.use(express.json())

app.use('/', router)

app.listen(port, () => {
    console.log(`App serving @ http://localhost:${port}`)
})