const Todo = require('../model/todoModel')
const bcrypt = require('bcrypt');

exports.fetchData = async function (req, res) {
    const term = req.query.term
    const userId =req.user.id;
    const page = parseInt(req.query.page, 10) || 1; // Current page (default: 1)
    const limit = parseInt(req.query.limit, 10) || 10; // Items per page (default: 10)
    const offset = (page - 1) * limit;
    const total = parseInt(await Todo.getCount(userId), 10)

    try {
        const data = await Todo.all(userId, limit, offset)

        if (!term) {
            res.status(200).send({data, page, limit, total}) // if no search term is provided return all the posts
        } else {
            const filterdTodos = data.filter((todo) => {
                return todo.title.toLowerCase().includes(term.toLowerCase()) ||
                todo.description.toLowerCase().includes(term.toLowerCase())
            })
    
           filterdTodos.length === 0 ?
            res.sendStatus(404) // if filterd posts is not present send not found status 
            : res.status(200).send({filterdTodos, page, limit, total}) // send the filterd posts
        }

    } catch (error) {
        console.error(`Error executing GET request, ${error.message}`);
        res.status(500).send(`Error executing GET request, ${error.message}\n`)
    }
}

exports.createTodos = async (req, res) => {
    const userId = req.user.id;
    const { title, description } = req.body;
    try {
        const result = await Todo.createTodo(title, description, userId)
        res.status(200).send(result)
    } catch (error) {
        console.error(`Error posting data, ${error.message}`);
        res.status(500).send(`Error posting data, ${error.message}`)
    }
}
