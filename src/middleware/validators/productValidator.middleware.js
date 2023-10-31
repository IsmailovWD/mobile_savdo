const Joi = require('joi'); 

exports.productScheme = { 
  create: Joi.object({
    name: Joi.string().required().min(3).max(50),
    category_id: Joi.string().allow('').required(),
    img: Joi.string().allow(null),
    category_id: Joi.string().required().required(),
    shtrix_code: Joi.string().allow('').required(),
    min_amount: Joi.string().allow('').required(),
    pack: Joi.string().allow('').required(),
    unity_id: Joi.string().allow('').required(),
    manufactur_id: Joi.string().allow('').required(),
    brand_id: Joi.string().allow('').required(),
    model_id: Joi.string().allow('').required(),
    color_id: Joi.string().allow('').required(),
    addition_name: Joi.string().allow('').required(),
  }),
  update: Joi.object({
    name: Joi.string().required().min(3).max(50),
    category_id: Joi.string().allow('').required(),
    img: Joi.string().allow(null),
    category_id: Joi.string().required(),
    shtrix_code: Joi.string().allow('').required(),
    min_amount: Joi.string().allow('').required(),
    pack: Joi.string().allow('').required(),
    unity_id: Joi.string().allow('').required(),
    manufactur_id: Joi.string().allow('').required(),
    brand_id: Joi.string().allow('').required(),
    model_id: Joi.string().allow('').required(),
    color_id: Joi.string().allow('').required(),
    addition_name: Joi.string().allow('').required(),
  }),
};