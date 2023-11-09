const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin, Programmer } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');
const { chiqim, kirim } = require('../utils/docTypes.utils')
const sequelize = require('../db/db-sequelize');

// Include models
const ProductModel = require('../models/product.model');
const ProductRegisterModel = require('../models/productRegister.model');
const KontagentRegisterModel = require('../models/kontragentRegister.model');
const KontagentModel = require('../models/kontragent.model');
class KursController extends BaseController {
    product_ostatok = async (req, res) => {
        const model = await ProductRegisterModel.findAll({
            attributes: [
                [sequelize.literal(`
                SUM(
                    CASE
                        WHEN \`doc_type\` = '${chiqim}' THEN -(\`count\`)
                        WHEN \`doc_type\` = '${kirim}' THEN (\`count\`)
                        ELSE 0 END
                )
            `), 'residual'],
                [sequelize.literal('`product`.`name`'), 'product_name'],
                [sequelize.literal('`product`.`id`'), 'product_id'],
                [sequelize.literal('`product`.`min_amount`'), 'product_min_amount']
            ],
            include: [
                {
                    model: ProductModel,
                    as: 'product',
                    attributes: []
                }
            ],
            group: ['product_id']
        })
        res.send(model)
    }
    kontragent_summa = async (req, res) => {
        const kontragent_id = req.body.kontragent_id;
        let datetime = req.body.datetime;
        let query = {}
        if(kontragent_id){
            query.kontragent_id = kontragent_id
        }else{
            query.kontragent_id = {
                [Op.ne]: null
            }
        }
        if(datetime == null){ datetime = moment().unix();}
        let model = await KontagentRegisterModel.findAll({
            attributes:[
                [sequelize.literal(`SUM(CASE 
                        WHEN \`price_type\` = 1 THEN \`summa\` * power(-1, \`type\`)
                        ELSE 0 END)`), 'total_sum'],
                [sequelize.literal(`SUM(CASE 
                        WHEN \`price_type\` = 2 THEN \`summa\` * power(-1, \`type\`)
                        ELSE 0 END)`), 'total_dollar'],
                [sequelize.literal('kontragent.name'), 'kontragent_name'],
                [sequelize.literal('kontragent.phone_number'), 'kontragent_phone_number'],
                [sequelize.literal('kontragent.id'), 'kontragent_id'],
            ],
            include: [
                {model: KontagentModel, as: 'kontragent', required: false, attributes: []}
            ],
            where: query,
            group: ['kontragent_id']
        });
        let model_data = await KontagentRegisterModel.findOne({
            attributes:[
                [sequelize.literal(`SUM(CASE 
                        WHEN \`price_type\` = 1 THEN \`summa\` * power(-1, \`type\`)
                        ELSE 0 END)`), 'total_sum'],
                [sequelize.literal(`SUM(CASE 
                        WHEN \`price_type\` = 2 THEN \`summa\` * power(-1, \`type\`)
                        ELSE 0 END)`), 'total_dollar'],
            ],
            where: query,
        });
        res.send({
            data: model,
            common_data: model_data 
        })
    }
}


module.exports = new KursController;