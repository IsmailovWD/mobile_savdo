const InitialBalanceModel = require('../models/initialBalance.model');
const InitialBalanceTableModel = require('../models/initialBalanceTable.model');
const ProductRegisterModel = require('../models/productRegister.model');
const PriceRegisterModel = require('../models/priceRegister.model');
const HttpException = require('../utils/HttpException.utils');
const SkladModel = require('../models/sklad.model');
const ProductModel = require('../models/product.model');
const ShtrixModel = require('../models/shtrix.model');
const DocType = require('../utils/docTypes.utils');
const ProductController = require('./product.controller');
// const client = require('../startup/client');
const DocNumberController  = require('./DocNumberController');
const UserModel = require('../models/user.model');
const { getProfitPrice } = require('../utils/price.utils');
const priceTypeUtils = require('../utils/priceType.utils');
const payTypeUtils = require('../utils/payType.utils');
const {ValidationError} = require('sequelize');
const SeriesModel = require('../models/series.model');
const actionTypeUtils = require('../utils/actionType.utils');
const config = require('../startup/config');
const db_sequelize = require('../db/db-sequelize');
const sequelize = require('sequelize');

/******************************************************************************
 *                              InitialBalance Controller
 ******************************************************************************/
class InitialBalanceController extends DocNumberController {
    model = InitialBalanceModel;

    getAll = async (req, res, next) => {        
        let modelList = await InitialBalanceModel.findAll({
            attributes: [
                "id",
                "created_at",
                "updated_at",
                "sklad_id",
                "user_id",
                "summa",
                "comment",
                "count_all",
                "number",
                "dollar_rate",
                "pay_type_id",
                [sequelize.literal('`sklad`.`name`'), 'sklad_name'],
                [sequelize.literal('`user`.`fullname`'), 'user_fullname'],
            ],
            include: [
                //{ model: InitialBalanceTableModel, as: 'prixod_table' },
                { model: SkladModel, as: 'sklad', attributes : [], required: false },
                { model: UserModel, as: 'user', attributes : [], required: false },
            ],
            order: [
                ['created_at', 'DESC'],
                ['id', 'DESC']
            ],
            where: req.skladFilter
        });

        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const model = await InitialBalanceModel.findOne({
            where:{ id: req.params.id },
            include: [
                { model: InitialBalanceTableModel,as: 'initial_balance_table', 
                    include : [
                        { model: ProductModel, as: 'product', attributes: ['name'], required: false}
                    ]
                },
                { model: SkladModel,as: 'sklad', attributes : ['name'], required: false },
            ],
            order:[
                [ {model: InitialBalanceTableModel, as: 'initial_balance_table'}, 'id', 'ASC']
            ],
        });
        if (model === null) {
            throw new HttpException(404, req.mf('data not found'));
        }
        res.send(model);
        try {
            await client.setex('initial_balance_' + req.params.id, 120, JSON.stringify(model));
        } catch (error) {
            
        }

    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        
        let {initial_balance_table, ...initial_balance} = req.body;
        initial_balance.user_id = req.currentUser.id;
        
        const model = await InitialBalanceModel.create(initial_balance);
        
        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }
        
        await this.#add(model, initial_balance_table);

        res.status(201).send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.initial_balance,
            action: actionTypeUtils.create,
            data: JSON.stringify(req.body)
        })
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        let {initial_balance_table, ...initial_balance} = req.body;
        let initial_balance_id = parseInt(req.params.id);
        
        //const result = await InitialBalanceModel.update( initial_balance, {where:{ id: initial_balance_id}});
        let model = await InitialBalanceModel.findOne({where : {id: initial_balance_id}})

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        } 
        try{
            //model.created_at = initial_balance.created_at;
            model.updated_at = initial_balance.updated_at;
            model.user_id = initial_balance.user_id;
            model.sklad_id = initial_balance.sklad_id;
            model.summa = initial_balance.summa;
            model.comment = initial_balance.comment;
            model.count_all = initial_balance.count_all;
            model.number = initial_balance.number;
            model.dollar_rate = initial_balance.dollar_rate;
            model.pay_type_id = initial_balance.pay_type_id;
            await model.validate();
            await model.save();
        }catch(e){
            if(e instanceof ValidationError){
                res.status(404).send(req.mf(e.errors[0].message));
                return;
            }
            console.log(e);
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        await this.#add(model, initial_balance_table, false);

        res.send(model);
        try {
            await client.del('initial_balance_' + req.params.id, 120);
        } catch (error) {

        }

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.initial_balance,
            action: actionTypeUtils.update,
            data: JSON.stringify(req.body)
        })
    };

    delete = async (req, res, next) => {
        const initial_balance_id = req.params.id;
        
        const result = await InitialBalanceModel.findOne({where : {id: initial_balance_id } });
        if (!result) {
            throw new HttpException(404, req.mf('data not found'));
        }
        await result.destroy();

        await this.#deleteRelated(initial_balance_id);

        res.send(req.mf('data has been deleted') );

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: result.sklad_id,
            doc_id: result.id,
            doc_type: DocType.initial_balance,
            action: actionTypeUtils.delete,
            data: JSON.stringify(result)
        })
    };

    #add = async(model, initial_balance_table, insert = true) => {
        if(!insert){
            await this.#deleteRelated(model.id);
        }
        let doc_id = model.id;
        let shtrix_kod;
        let price_type = model.pay_type_id == payTypeUtils.Dollar 
                            ? priceTypeUtils.Dollar : priceTypeUtils.Sum;
        for(let element of initial_balance_table){
            if(element.product_id == 0) continue;
            delete element.id;
            element.initial_balance_id = doc_id;
            let element_debit_price = await getProfitPrice(model.pay_type_id, element.debit_price, model.dollar_rate) ;
            const series = await ProductController.findOrCreateSeries(
                    model.created_at, element.product_id, model.sklad_id, 
                    0, element_debit_price, element.optom_price, element.chakana_price, 
                    doc_id, DocType.initial_balance,
                    element.chakana_dollar_price, element.optom_dollar_price, price_type);

            await ProductController.writeProductRegister(model.created_at, doc_id, model.sklad_id,
                element.product_id, series.id, element.count, 1, DocType.initial_balance, model.comment);

            await ProductController.writePriceRegister(model.created_at, element.product_id, series.id, 
                model.sklad_id, element_debit_price, element.chakana_price, element.optom_price, doc_id, DocType.initial_balance,
                element.chakana_dollar_price, element.optom_dollar_price, 
                0, price_type);

            shtrix_kod = element.shtrix_kod;
            if(shtrix_kod != null && shtrix_kod.trim() != ''){
                await ShtrixModel.findOrCreate({
                    where : {
                        shtrix_kod : shtrix_kod,
                        product_id : element.product_id
                    }
                });
            }
            console.log(element)
            await InitialBalanceTableModel.create(element); 
        }
    }

    #deleteRelated = async(doc_id) => {
        await InitialBalanceTableModel.destroy({where: {initial_balance_id: doc_id}})
        //Dokument ma'lumotlari o'chirib tashlab
        // await SeriesModel.destroy({where: {doc_id : doc_id, doc_type: DocType.initial_balance}});
        await ProductRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.initial_balance}});
        await PriceRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.initial_balance}});
    }

    autoIncrementId = async () => {
        let sql = `SELECT AUTO_INCREMENT FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${config.db_name}' AND TABLE_NAME   = 'initial_balance'`;
        let auto_increment_id = await db_sequelize.query(sql, { type: sequelize.QueryTypes.SELECT, raw: true });

        auto_increment_id = auto_increment_id[0];

        return auto_increment_id.AUTO_INCREMENT;
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new InitialBalanceController;