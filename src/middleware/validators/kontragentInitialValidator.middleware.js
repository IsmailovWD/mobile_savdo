const Joi = require('joi'); 

exports.kontragentInitialSchema = { 
  createUpdate: Joi.object({
    datetime: Joi.number().required(),
    sklad_id: Joi.number().required(),
    summa: Joi.number().required(),
    kontragent_initial_table: Joi.array().required().min(1).items(Joi.object({
        kontragent_id: Joi.number().required(),
        summa: Joi.number().required(),
        pay_type_id: Joi.number().required(),
        comment: Joi.string().allow('').required(),
        type: Joi.number().required() // 0 - add, 1 - remove
    })),
    dollar_rate: Joi.number().required(),
    dollar_summa: Joi.number().required(),
  }),
};