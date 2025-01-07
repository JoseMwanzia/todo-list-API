const express = require('express')
const router = require('./routes/todoRoutes')
require('dotenv').config()
const app = express()
const port = process.env.PORT
const slowDown = require('express-slow-down')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
})

const speedLimiter = slowDown({
    windowMs: 1 * 60 * 1000, // 15 sec
    delayAfter: 3, // Allow 30 requests before slowing down
    delayAfter: 3000, // Add 3000ms delay per request over the limit
  });

app.use(express.json(), limiter, speedLimiter)

app.use('/', router)

app.listen(port, () => {
    console.log(`App serving @ http://localhost:${port}`)
})