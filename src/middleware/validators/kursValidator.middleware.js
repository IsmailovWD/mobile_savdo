const Joi = require('joi'); 

exports.Kursscheme = { 
  createUpdate: Joi.object({
    summa: Joi.number().required(),
    datetime: Joi.string().required().min(1).max(20)
  }),
};