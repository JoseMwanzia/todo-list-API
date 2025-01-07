const express = require('express')
const router = express.Router()
const todoController = require('../controller/todoController')
const usersController = require('../controller/usersController')
const authenticateToken = require('../middlewares/auth')
const { userRegistrationValidationSchema, userLoginValidationSchema } = require('../validations/userValidation')
const { todoValidationSchema } = require('../validations/todoValidation')
const validationMiddleware = require('../middlewares/validationMiddleware')

router.post('/signup', validationMiddleware(userRegistrationValidationSchema), usersController.signUpUser)
router.post('/login', validationMiddleware(userLoginValidationSchema), usersController.login)
router.get('/todos', authenticateToken, todoController.fetchData)
router.post('/todos', validationMiddleware(todoValidationSchema), authenticateToken, todoController.createTodos)

module.exports = router;

