const Joi = require('joi'); 

exports.rasxodScheme = {
    create: Joi.object({
        created_at: Joi.number().required(),
        updated_at: Joi.number().required(),
        sklad_id: Joi.number().required(),
        kontragent_id: Joi.number().required(),
        price_type: Joi.string().required().valid('optom', 'chakana'),
        skidka_summa: Joi.number().required(),
        summa: Joi.number().required(),
        cash_summa: Joi.number().required(),
        plastic_summa: Joi.number().required(),
        count_all: Joi.number().required(),
        comment: Joi.string().required().allow(null, ''),
        // number: Joi.number().required(),
        dollar_rate: Joi.number().required(),
        pay_type_id: Joi.number().required(),
        dollar_summa: Joi.number().required(),
        refund_money: Joi.number().required(),
        refund_money_dollar: Joi.number().required(),
        rasxod_table: Joi.array().required().min(1).items(Joi.object({
            product_id: Joi.number().required(),
            current_balance: Joi.number().required(),
            count: Joi.number().required(),
            price: Joi.number().required(),
            summa: Joi.number().required(),
        })),
    })
}