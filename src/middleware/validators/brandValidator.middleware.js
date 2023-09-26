const Joi = require('joi'); 

exports.Brandscheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
  }),
};