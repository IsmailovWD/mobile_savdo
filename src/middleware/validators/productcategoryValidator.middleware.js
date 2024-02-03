const Joi = require('joi'); 

exports.productcategoryScheme = { 
  createUpdate: Joi.object({
    name: Joi.string().required().min(3).max(50),
    img: Joi.string().allow(null), 
  }),
};