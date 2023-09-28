const Joi = require('joi'); 
const Role = require('../../utils/userRoles.utils');

exports.sklaScheme = { 
  create: Joi.object({
    name: Joi.string().required().min(3).max(50),
    valyuta_id: Joi.number().required()
  }),
  update: Joi.object({
    name: Joi.string().min(3).max(50),
  })
};