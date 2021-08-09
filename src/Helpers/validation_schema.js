const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.ref("password"),
}).with("password", "confirm_password");

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});

module.exports = { loginSchema, registerSchema };
