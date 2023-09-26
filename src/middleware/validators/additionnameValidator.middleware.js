const Joi = require('joi'); 

exports.Additionnamescheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
  }),
};