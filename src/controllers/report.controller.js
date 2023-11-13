const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin, Programmer } = require('../utils/userRoles.utils');
const { Op, QueryTypes } = require('sequelize');
const moment = require('moment');
const { chiqim, kirim } = require('../utils/docTypes.utils')
const sequelize = require('../db/db-sequelize');
const db = require('../db/db-sequelize')
const _ = require('lodash');
// Include models
const ProductModel = require('../models/product.model');
const ProductRegisterModel = require('../models/productRegister.model');
const KontagentRegisterModel = require('../models/kontragentRegister.model');
const KontagentModel = require('../models/kontragent.model');
const userRolesUtils = require('../utils/userRoles.utils');
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
        const kontragent_id = req.query.kontragent_id;
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
        res.send(model)
    }
    dailyRasxodFun = async (sklad_id, datetime1, datetime2) => {
        let query1 = `SELECT 
            created_at, summa, (cash_summa - refund_money) as cash_summa, plastic_summa, skidka_summa, 
            (dollar_summa - refund_money_dollar) as dollar_summa, pay_type_id, dollar_rate, sklad_id
            FROM rasxod WHERE created_at >= ${ datetime1 } AND created_at <= ${ datetime2 }`;
        
        let query2 = `SELECT 
            created_at, summa * (-1), cash_summa * (-1), plastic_summa * (-1), skidka_summa * (-1) as skidka_summa,
            dollar_summa, pay_type_id, dollar_rate, sklad_id
            FROM refund WHERE created_at >= ${ datetime1 } AND created_at <= ${ datetime2 } `;
        
        if(sklad_id !== null && sklad_id !== userRolesUtils.MainSklad){
            query1 += `AND sklad_id = ${ sklad_id }`; 
            query2 += `AND sklad_id = ${ sklad_id }`; 
        }

        let sql = `
        SELECT 
            sklad.id,
            sklad.name as sklad_name,
            temp.* 
        FROM sklad LEFT JOIN
            (SELECT 
                pay_type_id, dollar_rate, sklad_id, created_at,
                UNIX_TIMESTAMP(FROM_UNIXTIME(created_at, '%Y-%m-%d')) AS unix_day, 
                FROM_UNIXTIME(created_at, '%Y-%m-%d') AS day, 
                FROM_UNIXTIME(created_at, '%Y-%m') AS month, 
                sum(summa) AS total,
                sum(dollar_summa) as total_dollar,
                sum(cash_summa) AS total_cash,
                sum(plastic_summa) AS total_plastic,
                sum(skidka_summa) AS total_skidka, 
                sum(CASE 
                    WHEN pay_type_id < 3 THEN 
                        summa - skidka_summa - cash_summa - plastic_summa - dollar_summa * dollar_rate
                    ELSE 
                        summa - skidka_summa - dollar_summa - (cash_summa + plastic_summa) / dollar_rate
                    END
                ) AS total_credit 
            FROM
            (${ query1 } UNION ALL ${ query2 }) subquery
            GROUP BY sklad_id, pay_type_id, day ) temp
            ON sklad.id = temp.sklad_id
        `
        if(sklad_id !== null && sklad_id !== userRolesUtils.MainSklad){
            sql += `WHERE sklad_id = ${ sklad_id }`;
        }
        sql += ` ORDER BY sklad.id, created_at, pay_type_id ASC`;

        let result = await db.query(
            sql,
            {
                type: QueryTypes.SELECT,
                //model: RasxodModel,
                // mapToModel: true,
                // bind: ['product'],
                nest: true
            }
        );
        console.log(result)
        // res.send(rasxod);
        //_.groupBy(rasxod, 'month')
        //res.send(_.groupBy(rasxod, 'sklad_name'));

        result = _(result).groupBy('sklad_name').map((value, id)=>({
            id: value[0].id,
            name: id, 
            months: _(value).groupBy('month')
        })).value();

        return result;
    }
}


module.exports = new KursController;