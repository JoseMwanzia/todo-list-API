const Joi = require('joi');

const userRegistrationValidationSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(9).required()
})

const userLoginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(9).required(),
})


module.exports = { userRegistrationValidationSchema, userLoginValidationSchema };