const jwt = require('jsonwebtoken');
const redis = require('../config/redisConnect');
require('dotenv').config()

// retrieve refreshTokens from Redis
const getCachedRefreshToken = async (key) => {
    const cache = redis.get(key, (err, data) => {
        if (err) console.log('Redis get err: ', err);
        return data;
    })
    return cache
}

async function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });
}

async function generateRefreshTokens(user) {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES })
    // store token in Redis with an expiry
    const saveToken = await redis.set(refreshToken, JSON.stringify(user), 'EX', 7 * 24 * 60 * 60) // 7 days
    if (!saveToken) return console.error('Refresh Token not Stored in Redis!');
    return refreshToken
}

async function revokeToken(token) {
    // decode the accessToken
    const { id, iat, exp } = jwt.decode(token);

    // Add the userId (id) and issuedAt (iat) to a blocklist with expiration time
    redis.set(`Blocklist:${id}:${iat}`, 'revoked', 'EX', exp - Math.floor(Date.now() / 1000))
}

module.exports = { getCachedRefreshToken, generateAccessToken, generateRefreshTokens, revokeToken }