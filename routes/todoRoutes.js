const express = require('express')
const router = express.Router()
const todoController = require('../controller/todoController')

router.get('/', todoController.fetchData)

module.exports = router;

