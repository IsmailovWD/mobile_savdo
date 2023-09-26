const Joi = require('joi'); 

exports.productScheme = { 
  create: Joi.object({
    name: Joi.string().required().min(3).max(50),
    category_id: Joi.string().allow(''),
    img: Joi.string().required(),
    category_id: Joi.string().required(),
    shtrix_code: Joi.string().allow(''),
    min_amount: Joi.string().allow(''),
    pack: Joi.string().allow(''),
    unity_id: Joi.string().allow(''),
    manufactur_id: Joi.string().allow(''),
    brend_id: Joi.string().allow(''),
    model_id: Joi.string().allow(''),
    color_id: Joi.string().allow(''),
    addition_id: Joi.string().allow(''),
  }),
  update: Joi.object({
    name: Joi.string().required().min(3).max(50),
    category_id: Joi.string().allow(''),
    img: Joi.string(),
    category_id: Joi.string().required(),
    shtrix_code: Joi.string().allow(''),
    min_amount: Joi.string().allow(''),
    pack: Joi.string().allow(''),
    unity_id: Joi.string().allow(''),
    manufactur_id: Joi.string().allow(''),
    brend_id: Joi.string().allow(''),
    model_id: Joi.string().allow(''),
    color_id: Joi.string().allow(''),
    addition_id: Joi.string().allow(''),
  }),
};