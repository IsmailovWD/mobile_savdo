const Joi = require('joi')

exports.Kontragentscheme = { 
    createUpdate: Joi.object({
      name: Joi.string().required().min(3).max(50),
      address: Joi.string().min(3).max(50),
      phone_number: Joi.string().allow(null).max(15),
      inn: Joi.string().allow(null).max(15),
      mfo_id: Joi.number().allow(null).max(9999999),
      okonx: Joi.string().allow(null).max(15),
      firma_id: Joi.number().allow(null),
      sklad_id: Joi.number().required(),
      comment: Joi.string().allow(null).max(50)
    }),
  };