const Joi = require('joi'); 

exports.KontrAgentPayScheme = { 
  createUpdate: Joi.object({
    datetime: Joi.number().required(),
    sklad_id: Joi.number().required(),
    kontragent_id: Joi.number().required(),
    summa: Joi.number().required(),
    current_total: Joi.number().required(),
    pay_type_id: Joi.number().required(),
    comment: Joi.string().required().allow(''),
    type: Joi.number().required(),
    dollar_rate: Joi.number().required(),
    pay_type_kassa: Joi.number().required(),
    kassa_summa: Joi.number().required(),
    current_total_dollar: Joi.number().required()
  }),
};
