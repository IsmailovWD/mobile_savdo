const Joi = require('joi'); 

exports.prixodscheme = {
    create: Joi.object({
        created_at: Joi.number().required(),
        updated_at: Joi.number().required(),
        sklad_id: Joi.number().required(),
        kontragent_id: Joi.number().required(),
        pay_type_id: Joi.number().required(),
        rasxod_summa: Joi.number().required(),
        skidka_summa: Joi.number().required(),
        summa: Joi.number().required(),
        debit_summa: Joi.number().required(),
        count_all: Joi.number().required(),
        comment: Joi.string().required(),
        prixod_table: Joi.array().required().min(1).items(Joi.object({
            product_id: Joi.number().required(),
            count: Joi.number().required(),
            current_balance: Joi.number().required(),
            debit_price: Joi.number().required(),
            kontragent_price: Joi.number().required(),
            kontragent_summa: Joi.number().required(),
            chakana_percent: Joi.number().required(),
            optom_percent: Joi.number().required(),
            chakana_price: Joi.number().required(),
            optom_price: Joi.number().required(),
            chakana_summa: Joi.number().required(),
            optom_summa: Joi.number().required(),
            debit_summa: Joi.number().required(),
            chakana_dollar_price: Joi.number().required(),
            optom_dollar_price: Joi.number().required(),
        }))
    })
}