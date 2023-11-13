const Joi = require('joi'); 

exports.StatisticScheme = { 
  user_sale: Joi.object({
    sklad_id: Joi.number().allow(null),
    start_date: Joi.number().required(),
    end_date: Joi.number().required()
  }),
};