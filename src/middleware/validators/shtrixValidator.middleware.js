const Joi = require('joi'); 
const Role = require('../../utils/userRoles.utils');

exports.shtrixScheme = { 
  createUpdate: Joi.object({
    shtrix_kod: Joi.string().required().min(10).max(20),
    product_id: Joi.number().required()
  }),
};