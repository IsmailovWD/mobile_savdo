const Joi = require('joi');

exports.InitialBalanceScheme = {
    createUpdate: Joi.object({
        created_at: Joi.number().required(),
        updated_at: Joi.number().required(),
        sklad_id: Joi.number().required(),
        summa: Joi.number().required(),
        count_all: Joi.number().required(),
        comment: Joi.string().required().allow(null,''),
        pay_type_id: Joi.number().required(),
        dollar_rate: Joi.number().required(),
        initial_balance_table: Joi.array().required().min(1).items(Joi.object({
            product_id: Joi.number().required(),
            count: Joi.number().required(),
            debit_price: Joi.number().required(),
            chakana_percent: Joi.number().required(),
            optom_percent: Joi.number().required(),
            chakana_price: Joi.number().required(),
            optom_price: Joi.number().required(),
            chakana_summa: Joi.number().required(),
            optom_summa: Joi.number().required(),
            debit_summa: Joi.number().required(),
            chakana_dollar_price: Joi.number().required(),
            optom_dollar_price: Joi.number().required(),
            // pack_count: Joi.number().required(),
            // pack_price: Joi.number().required(),
            // pack_norma: Joi.number().required()
        }))
    }),
};