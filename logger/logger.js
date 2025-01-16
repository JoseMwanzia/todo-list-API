const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');
require('dotenv').config()
const { LOGTAIL_TOKEN } =  process.env

const logtail = new Logtail(LOGTAIL_TOKEN);
const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
    level: 'http',
    format: combine(
        timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        json()
    ),
    transports: [ new LogtailTransport(logtail)],
});

module.exports = { logger }
