const Redis = require('ioredis');
require('dotenv').config()
const { REDIS_URL } = process.env

const redis = new Redis(REDIS_URL)

module.exports = redis;