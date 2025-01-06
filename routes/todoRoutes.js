const express = require('express')
const router = express.Router()
const todoController = require('../controller/todoController')
router.get('/todos', authenticateToken , todoController.fetchData)

module.exports = router;

