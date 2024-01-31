const RasxodModel = require('../models/rasxod.model');
const RasxodTableModel = require('../models/rasxodTable.model');
const ProductRegisterModel = require('../models/productRegister.model');
const KassaRegisterModel = require('../models/kassaRegister.model');
const KontragentRegisterModel = require('../models/kontragentRegister.model');
// const ProfitRegisterModel = require('../models/profitRegister.model');
const SeriesModel = require('../models/series.model');
const HttpException = require('../utils/HttpException.utils');
const SkladModel = require('../models/sklad.model');
const KontragentModel = require('../models/kontragent.model');
const ProductModel = require('../models/product.model');
const DocType = require('../utils/docTypes.utils');
const PriceRegisterModel = require('../models/priceRegister.model');
const { Op }= require('sequelize');
const sequelize = require('sequelize');
const ProductController = require('./product.controller');
let moment = require('moment');
const {ValidationError} = require('sequelize');
const DocNumberController = require('./DocNumberController');
const priceTypeUtils = require('../utils/priceType.utils');
const payTypeUtils = require('../utils/payType.utils');
const UserModel = require('../models/user.model');
const actionTypeUtils = require('../utils/actionType.utils');
const PayTypeModel = require('../models/payType.model');
const UnityModel = require('../models/unity.model');
/******************************************************************************
 *                              Rasxod Controller
 ******************************************************************************/
class RasxodController extends DocNumberController {
    model = RasxodModel;
    
    getAll = async (req, res, next) => {
        // if(req.query.from){
        //     req.skladFilter.from = req.query.from;
        // }
        let query = {}
        
        if(req.query.sklad_id){
            query.sklad_id = req.query.sklad_id
        }
        let RasxodList = await RasxodModel.findAll({
            attributes: [
                "id",
                "created_at",
                "updated_at",
                "sklad_id",
                "kontragent_id",
                "user_id",
                "price_type",
                "skidka_summa",
                "summa",
                "comment",
                "cash_summa",
                "plastic_summa",
                "count_all",
                "daily_number",
                // "number",
                "dollar_rate",
                "pay_type_id",
                "dollar_summa",
                "refund_money",
                "refund_money_dollar",
                "from",
                [sequelize.literal("sklad.name"), 'sklad_name'],
                [sequelize.literal("kontragent.name"), 'kontragent_name'],
                [sequelize.literal("user.fullname"), 'user_fullname'],
                [sequelize.literal("user.phone_number"), 'user_phone_number'],
            ],
            include: [
                //{ model: RasxodTableModel, as: 'rasxod_table' },
                { model: SkladModel, as: 'sklad', attributes : [], required: false },
                { model: KontragentModel, as: 'kontragent', attributes : [], required: false },
                { model: UserModel, as: 'user', attributes : [], required: false },
            ],
            order: [
                ['created_at', 'DESC'],
                ['id', 'DESC']
            ],
            where: query
        });

        res.send(RasxodList);
    };

    getById = async (req, res, next) => {
        const Rasxod = await RasxodModel.findOne({
            attributes: [
                "id",
                "created_at",
                "updated_at",
                "sklad_id",
                "kontragent_id",
                "user_id",
                "price_type",
                "skidka_summa",
                "summa",
                "comment",
                "cash_summa",
                "plastic_summa",
                "count_all",
                "daily_number",
                "dollar_rate",
                "pay_type_id",
                "dollar_summa",
                "refund_money",
                "refund_money_dollar",
                [sequelize.literal('sklad.name'), 'sklad_name'],
                [sequelize.literal('kontragent.name'), 'kontragent_name'],
                [sequelize.literal('pay_type.name'), 'pay_type_name'],
            ],
            where:{ id: req.params.id },
            include: [
                { 
                    model: RasxodTableModel,
                    as: 'rasxod_table', 
                    attributes: [
                        "id",
                        "rasxod_id",
                        "product_id",
                        "count",
                        "price",
                        "summa",
                        "shtrix_kod",
                        "current_balance",
                        [sequelize.literal('`rasxod_table->product`.`name`'), 'product_name'],
                        [sequelize.literal('`rasxod_table->product->unity`.`name`'), 'unity_name'],
                    ],
                    include : [
                        { 
                            model: ProductModel, 
                            as: 'product', 
                            attributes: [], 
                            required: false,
                            include: [
                                {
                                    model: UnityModel,
                                    as: 'unity',
                                    attributes: []
                                }
                            ]
                        }
                    ]
                },
                { model: SkladModel,as: 'sklad', attributes : [], required: false },
                { model: KontragentModel, as: 'kontragent', attributes : [], required: false },
                { model: PayTypeModel, as: 'pay_type', attributes : [], required: false },
            ],
            order:[
                [ {model: RasxodTableModel, as: 'rasxod_table'}, 'id', 'ASC']
            ],
        });
        if (Rasxod === null) {
            throw new HttpException(404, req.mf('data not found'));
        }
        res.send(Rasxod);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        
        let {rasxod_table, ...rasxod} = req.body;
        rasxod.user_id = req.currentUser.id;
        rasxod.z_report = false;
        rasxod.daily_number = await this.#getDailyNumber(rasxod.created_at);
        if(rasxod.kontragent_id == 0) rasxod.kontragent_id = null;
        if(req.headers.mobile == '1') rasxod.from = 'mobile';

        let model = await RasxodModel.create(rasxod);

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }
        
        await this.#add(model, rasxod_table);

        model = await RasxodModel.findOne({
            where:{ id: model.id },
            include: [
                { model: RasxodTableModel,as: 'rasxod_table', 
                    include : [
                        { model: ProductModel, as: 'product', attributes: ['name']}
                    ]
                },
                { model: SkladModel, as: 'sklad', required: false },
                { model: KontragentModel, as: 'kontragent', attributes : ['name'], required: false },
            ]
        });
        
        res.status(201).send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.chiqim,
            action: actionTypeUtils.create,
            data: JSON.stringify(req.body)
        })
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        let {rasxod_table, ...rasxod} = req.body;
        let rasxod_id = parseInt(req.params.id);
        //console.log(JSON.stringify(req.body));
        let model = await RasxodModel.findOne({where:{ id: rasxod_id}});
        
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try{
            model.created_at = rasxod.created_at;
            model.updated_at = rasxod.updated_at;
            model.sklad_id = rasxod.sklad_id;
            model.kontragent_id = rasxod.kontragent_id == 0 ? null : rasxod.kontragent_id;
            model.user_id = rasxod.user_id;
            model.price_type = rasxod.price_type;
            model.skidka_summa = rasxod.skidka_summa;
            model.summa = rasxod.summa;
            model.cash_summa = rasxod.cash_summa;
            model.plastic_summa = rasxod.plastic_summa;
            model.comment = rasxod.comment;
            model.count_all = rasxod.count_all;
            // model.number = rasxod.number;
            model.daily_number = rasxod.daily_number;
            model.dollar_rate = rasxod.dollar_rate;
            model.dollar_summa = rasxod.dollar_summa;
            model.pay_type_id = rasxod.pay_type_id;
            model.refund_money = rasxod.refund_money;
            model.refund_money_dollar = rasxod.refund_money_dollar;
            // model.z_report = false;
            await model.validate();
            await model.save();
        } catch (e) {
            let message = JSON.stringify(e)
            if(!message.includes('Query was empty')){
                if(e instanceof ValidationError){
                    res.status(404).send(req.mf(e.errors[0].message));
                    return;
                }
                throw new HttpException(500, req.mf('Something went wrong'));
            }
        }
        
        await this.#add(model, rasxod_table, false);
        
        model = await RasxodModel.findOne({
            where:{ id: rasxod_id },
            include: [
                { model: RasxodTableModel,as: 'rasxod_table', 
                    include : [
                        { model: ProductModel, as: 'product', attributes: ['name']}
                    ]
                },
                { model: SkladModel, as: 'sklad', required: false },
                { model: KontragentModel, as: 'kontragent', attributes : ['name'], required: false },
            ]
        });

        res.send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.chiqim,
            action: actionTypeUtils.update,
            data: JSON.stringify(req.body)
        })
    };

    delete = async (req, res, next) => {
        const rasxod_id = req.params.id;
        
        const result = await RasxodModel.findOne({where : {id: rasxod_id}});
        if (!result) {
            throw new HttpException(404, req.mf('data not found'));
        }
        await result.destroy();
        
        await this.#deleteRelated(rasxod_id);
        
        res.send(req.mf('data has been deleted'));
        
        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: result.sklad_id,
            doc_id: result.id,
            doc_type: DocType.chiqim,
            action: actionTypeUtils.delete,
            data: JSON.stringify(result)
        })
    };
    
    #add = async(model, rasxod_table, insert = true) =>{
        if(!insert){
            await this.#deleteRelated(model.id);
        }
        let records = [];
        for(let element of rasxod_table){
            delete element.id;
            if(element.product_id == 0) continue;
            element.rasxod_id = model.id;
            
            //await ProductController.writeRasxodElementToRegister(model, element, 0, DocType.chiqim);//Chiqim
            records.push(element);
            //await RasxodTableModel.create(element);
        }
        let result = await RasxodTableModel.bulkCreate(records, {
            //returning: true
        });
        //console.log(JSON.stringify(result));
        if(model.kontragent_id !== null && model.kontragent_id !== 0){
            await KontragentRegisterModel.create({
                datetime: model.created_at,
                doc_id : model.id,
                kontragent_id : model.kontragent_id,
                summa : model.summa - model.skidka_summa,
                type: 0, //Chiqim
                doc_type : DocType.chiqim,
                sklad_id : model.sklad_id,
                dollar_rate: model.dollar_rate,
                price_type: model.pay_type_id,
                comment: model.comment
            });
            let summax = 0;
            model.cash_summa = parseFloat(model.cash_summa);
            model.refund_money = parseFloat(model.refund_money);
            model.plastic_summa = parseFloat(model.plastic_summa);
            model.dollar_summa = parseFloat(model.dollar_summa);
            model.refund_money_dollar = parseFloat(model.refund_money_dollar);
            model.cash_summa = parseFloat(model.cash_summa);
            model.dollar_rate = parseFloat(model.dollar_rate);
            if(model.pay_type_id === payTypeUtils.Dollar){
                summax = (
                        model.cash_summa 
                        - model.refund_money 
                        + model.plastic_summa
                    ) / model.dollar_rate
                    + model.dollar_summa 
                    - model.refund_money_dollar;
            }else {
                summax =
                    model.cash_summa 
                    - model.refund_money 
                    + model.plastic_summa
                + (model.dollar_summa 
                - model.refund_money_dollar) * model.dollar_rate;
            }
            if(summax > 0){
                await KontragentRegisterModel.create({
                    datetime: model.created_at,
                    doc_id : model.id,
                    kontragent_id : model.kontragent_id,
                    summa : summax,
                    type: 1, //Kirim
                    doc_type : DocType.chiqim,
                    sklad_id : model.sklad_id,
                    dollar_rate: model.dollar_rate,
                    price_type: model.pay_type_id, //Naqd
                    comment: model.comment
                });
            }
        }
        if(model.cash_summa > 0){
            await KassaRegisterModel.create({
                datetime: model.created_at,
                doc_id : model.id,
                summa : model.cash_summa,
                type: 1, //Kirim
                doc_type : DocType.chiqim,
                sklad_id: model.sklad_id,
                pay_type_id : payTypeUtils.Naqd,//Naqd summa
                comment : model.comment
            });
        }
        if(model.plastic_summa > 0){
            await KassaRegisterModel.create({
                datetime: model.created_at,
                doc_id : model.id,
                summa : model.plastic_summa,
                type: 1, //Kirim
                doc_type : DocType.chiqim,
                sklad_id: model.sklad_id,
                pay_type_id : payTypeUtils.Plastik,//Plastik summa
                comment : model.comment
            });
        }
        if(model.dollar_summa > 0){
            await KassaRegisterModel.create({
                datetime: model.created_at,
                doc_id : model.id,
                summa : model.dollar_summa,
                type: 1, //Kirim
                doc_type : DocType.chiqim,
                sklad_id: model.sklad_id,
                pay_type_id : payTypeUtils.Dollar,//Dollar summa
                comment : model.comment
            });
        }
        //Qaytim
        if(model.refund_money > 0){
            await KassaRegisterModel.create({
                datetime: model.created_at,
                doc_id : model.id,
                summa : model.refund_money,
                type: 0, //Chiqim
                doc_type : DocType.chiqim,
                sklad_id: model.sklad_id,
                pay_type_id : payTypeUtils.Naqd,//Naqd summa
                comment : model.comment
            });
        }
        if(model.refund_money_dollar > 0){
            await KassaRegisterModel.create({
                datetime: model.created_at,
                doc_id : model.id,
                summa : model.refund_money_dollar,
                type: 0, //Chiqim
                doc_type : DocType.chiqim,
                sklad_id: model.sklad_id,
                pay_type_id : payTypeUtils.Dollar,//Naqd summa
                comment : model.comment
            });
        }

        for(let element of result){
            ProductController.writeRasxodElementToRegister(model, element, 0, DocType.chiqim);//Chiqim
        }
    }

    #deleteRelated = async(doc_id) => {
        await RasxodTableModel.destroy({where:{rasxod_id: doc_id}});
        await ProductRegisterModel.destroy({where:{doc_id: doc_id, doc_type: DocType.chiqim}});
        // await ProfitRegisterModel.destroy({where:{doc_id: doc_id, doc_type: DocType.chiqim}});
        await KontragentRegisterModel.destroy({where:{doc_id: doc_id, doc_type: DocType.chiqim}});
        await KassaRegisterModel.destroy({where:{doc_id: doc_id, doc_type: DocType.chiqim}});
    }
    
    #getDailyNumber = async(datetime) => {
        let datetime1 = moment(moment.unix(datetime).format('YYYY-MM-DD') ).unix();
        let datetime2 = moment(moment.unix(datetime).format('YYYY-MM-DD') ).unix() + 86399;//23:59:59 => 86399
        
        let model = await RasxodModel.findOne({
            attributes:[
                'daily_number'
            ],
            where: {
                created_at: {
                    [Op.gte]: datetime1,
                    [Op.lte]: datetime2
                }
            },
            order: [
                ['daily_number', 'DESC']
            ]
        });

        if(model == null){ return 1;}
        if(model.daily_number == null) {return 1;}
        
        return (model.daily_number + 1);
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new RasxodController;