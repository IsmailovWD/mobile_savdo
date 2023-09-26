const Joi = require('joi'); 

exports.Productmodelscheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
  }),
};