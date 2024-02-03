const Joi = require('joi'); 
const Role = require('../../utils/userRoles.utils');

exports.sklaScheme = { 
  create: Joi.object({
    name: Joi.string().required().min(3).max(50),
    valyuta_id: Joi.number().required()
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(50),
  }),
  check: Joi.object({
    secret_ID: Joi.string().min(3).max(50).required(),
    date1: Joi.string().min(3).max(50).required(),
    date2: Joi.string().min(3).max(50).required(),
  })
};