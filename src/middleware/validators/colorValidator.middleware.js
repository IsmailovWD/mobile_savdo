const Joi = require('joi'); 

exports.Colorscheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
  }),
};