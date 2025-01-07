const User = require('../model/usersModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.signUpUser = async function(req, res) {
    const {name, email, password} = req.body;
    try {
        // hash and salt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        // register the user to the db        
        const userData = {name, email, password: hashedPassword};
        const sentData = await User.register(userData); 
        return res.status(201).send(sentData);
    } catch (error) {
        res.status(400).send(error.message)
        console.error("Error posting data: " + error.message);
    }
}

exports.login = async function (req, res) {
    const {email, password} = req.body;
    try {
        // get data from the model
        const data = await User.getUserByEmail(email);
        if (data === 404) {
            return res.sendStatus(data);
        }

        // verify the hashed password
        const verifyPassword = await bcrypt.compare(password, data.password)

        // create a JWT token and send it to client after passwordVerified
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
        verifyPassword ? res.status(200).send({ token: accessToken }) : res.status(401).send('Wrong password!');
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error Login in; ${error.message}`)
    }
}
