const Joi = require('joi'); 

exports.productScheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
    category_id: Joi.number().required()
  }),
};