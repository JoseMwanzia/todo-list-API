const jwt = require('jsonwebtoken');
require('dotenv').config()
const redis = require('../config/redisConnect');
const { ACCESS_TOKEN_SECRET } = process.env;

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).send({ message: 'Unauthorized'})

    try {
        // Check blocklist for revoked tokens
        const { id, iat } = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const isRevoked = await redis.get(`Blocklist:${id}:${iat}`);
        if (isRevoked) return res.status(403).send("Access token has been revoked!");

        jwt.verify(token, ACCESS_TOKEN_SECRET, (err, data) => {
            if (err) return res.sendStatus(403)
            req.user = data
            next()
        })
    } catch (error) {
        console.error(error.message.toUpperCase())
        return res.status(401).send("Invalid or expired access token!");
    }
}

module.exports =  { authenticateToken };