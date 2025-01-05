const Todo = require('../model/todoModel')
const bcrypt = require('bcrypt');

exports.fetchData = async function (req, res) {
    try {
      const data = await Todo.all()
      res.status(200).send(data)
    } catch (error) {
        console.error('Error executing GET request', error)
    }
}

