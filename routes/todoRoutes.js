const express = require('express')
const router = express.Router()
const todoController = require('../controller/todoController')
router.get('/todos', authenticateToken, todoController.fetchData)
router.post('/todos', validationMiddleware(todoValidationSchema), authenticateToken, todoController.createTodos)

module.exports = router;

