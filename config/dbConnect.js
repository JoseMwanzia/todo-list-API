const { Pool } = require('pg');
require('dotenv').config()
const { DB_HOST, DB_USER,DB_PASSWORD,DB_DATABASE } = process.env

const pool = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    max: 20,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 20000
})

module.exports = pool
