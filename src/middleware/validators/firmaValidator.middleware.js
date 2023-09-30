const Joi = require('joi'); 

exports.Firmascheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
  }),
};