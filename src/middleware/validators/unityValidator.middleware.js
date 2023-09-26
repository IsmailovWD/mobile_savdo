const Joi = require('joi'); 

exports.Unityscheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(1).max(50),
  }),
};