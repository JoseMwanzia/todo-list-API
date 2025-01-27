const express = require('express')
const router = require('./routes/routes')
const cors = require('cors')
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
    windowMs: 1 * 60 * 1000, 
    delayAfter: 3, // Allow 3 requests before slowing down
    delayAfter: 3000, // Add 3000ms delay per request over the limit
});

const corsOptions = {
    origin: 'http://localhost:4000/*'
  }
app.use(cors({ origin: true }))

app.use(express.json(), limiter, speedLimiter)

app.use('/', router)
// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, 'client/build')))

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`App serving @ http://localhost:${port}`)
})