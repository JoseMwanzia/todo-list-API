const pg = require('pg');
const { Pool } = pg

const pool = new Pool({
    host: 'localhost',
    user: 'josephmwanzia',
    password: '',
    database: 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

module.exports = pool
