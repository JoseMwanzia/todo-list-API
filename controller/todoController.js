const Todo = require('../model/todoModel')
const {logger} = require('../logger/logger')

exports.fetchData = async function (req, res) {
    const term = req.query.term
    const userId =req.user.id;
    let page = parseInt(req.query.page, 10) || 1; // Current page (default: 1)
    let limit = parseInt(req.query.limit, 10) || 10; // Items per page (default: 10)
    let offset = (page - 1) * limit;

    try {
        const total = parseInt(await Todo.getCount(userId), 10)
        const data = await Todo.all(userId, limit, offset)

        if (!term) {
            res.status(200).send({data, page, limit, total}) // if no search term is provided return all the posts
        } else {
            const allData = await Todo.all(userId, limit=null, offset=null)
            const filterdTodos = allData.filter((todo) => {
                return todo.title.toLowerCase().includes(term.toLowerCase()) ||
                todo.description.toLowerCase().includes(term.toLowerCase())
            })
    
           filterdTodos.length === 0 ?
            res.sendStatus(404) // if filterd posts is not present send not found status 
            : res.status(200).send({filterdTodos, page, limit, total}) // send the filterd posts
        }

    } catch (error) {
        logger.error(`Error executing GET request, ${error.message}`);
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
       logger.error(`Error posting data, ${error.message}`);
        res.status(500).send(`Error posting data, ${error.message}`)
    }
}

exports.updateTodos = async function name(req, res) {
    // get the required data 
    const { title, description } = req.body;
    const {todoId} = req.params;
    const userId = req.user.id;
    try {
        // do a database query for update
        const result = await Todo.updateTodo(title, description, todoId, userId)
        if (result == null) return res.sendStatus(404);
        res.status(201).send(result)
    } catch (error) {
       logger.error(error.message);
        res.status(500).send(`Error updating todo; ${error.message}`)
    }
}