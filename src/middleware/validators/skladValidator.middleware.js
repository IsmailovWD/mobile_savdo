const Joi = require('joi'); 
const Role = require('../../utils/userRoles.utils');

exports.sklaScheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
  }),
};