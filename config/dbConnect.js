const { Pool } = require('pg');
require('dotenv').config()

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    max: 20,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 2000
})

module.exports = pool
