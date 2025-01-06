const Todo = require('../model/todoModel')
const bcrypt = require('bcrypt');

exports.fetchData = async function (req, res) {
    const userId =req.user.id;
    const page = parseInt(req.query.page, 10) || 1; // Current page (default: 1)
    const limit = parseInt(req.query.limit, 10) || 10; // Items per page (default: 10)
    const offset = (page - 1) * limit;
    const total = parseInt(await Todo.getCount(), 10)

    try {
      const data = await Todo.all(userId, limit, offset)
      res.status(200).send({data, page, limit, total})
    } catch (error) {
        console.error('Error executing GET request', error)
    }
}
