const Joi = require('joi'); 

exports.valyutaScheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(1).max(50),
  }),
};