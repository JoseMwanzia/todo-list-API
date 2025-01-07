const Joi = require('joi');

const todoValidationSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required()
})

module.exports = { todoValidationSchema }
