const User = require('../model/usersModel')
const bcrypt = require('bcrypt');



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
        console.error("Error posting data: " + error);
    }
}

