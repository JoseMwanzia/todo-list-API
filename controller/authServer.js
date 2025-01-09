const User = require('../model/usersModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redis = require('../config/redisConnect');
require('dotenv').config()
const helpers = require('../helpers/helpers')
const { REFRESH_TOKEN_SECRET } = process.env

// login routes to issues tokens
async function login(req, res) {
    const { email, password } = req.body;
    try {
        // get data from the model
        const data = await User.getUserByEmail(email);
        if (data === 404) return res.sendStatus(data);

        // verify the hashed password
        const verifyPassword = await bcrypt.compare(password, data.password)
        if (!verifyPassword) return res.status(401).send('Wrong password!')

        // generate JWT tokens,store in redis and send it to client
        const generatedAccessToken = await helpers.generateAccessToken(data)
        const generatedRefreshToken = await helpers.generateRefreshTokens(data)

        res.status(200).send({ token: generatedAccessToken, refreshToken: generatedRefreshToken })
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error Login in; ${error.message}`)
    }
}

// refresh token endpoint
async function refreshTokens(req, res) {
    const { token } = req.body;

    if (!token) return res.status(401).send('Token is required!');

    try {
        const storedUser = await helpers.getCachedRefreshToken(token);

        if (!storedUser) return res.status(403).send('Invalid or expired Token!');

        jwt.verify(token, REFRESH_TOKEN_SECRET, async (err, user) => {
            if (err) return res.status(403).send('Token is not valid!');
            const accessToken = await helpers.generateAccessToken(JSON.parse(storedUser))
            res.status(200).send(accessToken)
        });
    } catch (error) {
        console.error(error)
        res.status(500).send(`Error refreshing tokens in: ${error.message}`) 
    }
}

// Delete accessToken and refreshTokens (logout)
async function logout(req, res) {
    const { token, refreshToken } = req.body;

    try {
        // revoke the accessToken
        if (token) await helpers.revokeToken(token);

        // delete refreshToken from Redis
        const cachedRefreshToken = await helpers.getCachedRefreshToken(refreshToken);
        if (cachedRefreshToken) {
            const deleteToken = await redis.del(refreshToken);
            if (deleteToken) return res.sendStatus(204)
            return res.status(403).send('Failed to delete cached Token!')
        } else {
            return res.status(404).send('Already Logged out!')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error logging out in: ${error.message}`)
    }
}

module.exports = { login, refreshTokens, logout };