const PrixodModel = require('../models/prixod.model');
const PrixodTableModel = require('../models/prixodtable.model');
const ProductRegisterModel = require('../models/productRegister.model');
const PriceRegisterModel = require('../models/priceRegister.model');
const KontragentRegisterModel = require('../models/kontragentRegister.model');
const HttpException = require('../utils/HttpException.utils');
const SkladModel = require('../models/sklad.model');
const KontragentModel = require('../models/kontragent.model');
const PayTypeModel = require('../models/payType.model');
const ProductModel = require('../models/product.model');
const ShtrixModel = require('../models/shtrix.model');
const DocType = require('../utils/docTypes.utils');
const ProductController = require('./product.controller');
// const DocNumberController = require('./DocNumberController');
const { getProfitPrice } = require('../utils/price.utils');
const priceTypeUtils = require('../utils/priceType.utils');
const payTypeUtils = require('../utils/payType.utils');
const UserModel = require('../models/user.model');
const {ValidationError, literal} = require('sequelize');
const actionTypeUtils = require('../utils/actionType.utils');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');

/******************************************************************************
 *                              Prixod Controller
 ******************************************************************************/
// class PrixodController extends DocNumberController {
class PrixodController extends BaseController{
    model = PrixodModel;
    
    getAll = async (req, res, next) => {
        let PrixodList = await PrixodModel.findAll({
            attributes: [
                "id",
                "created_at",
                "updated_at",
                "sklad_id",
                "kontragent_id",
                "user_id",
                "pay_type_id",
                "rasxod_summa",
                "skidka_summa",
                "summa",
                "debit_summa",
                "count_all",
                "comment",
                "number",
                "dollar_rate",
                "prixod_summa",
                [literal('sklad.name'), 'sklad_name'],
                [literal('kontragent.name'), 'kontragent_name'],
                [literal('pay_type.name'), 'pay_type_name'],
                [literal('user.phone_number'), 'user_phone_number'],
                [literal('user.fullname'), 'user_fullname'],
            ],
            include: [
                //{ model: PrixodTableModel, as: 'prixod_table' },
                { model: SkladModel,as: 'sklad', attributes : [], required: false },
                { model: KontragentModel, as: 'kontragent', attributes : [], required: false },
                { model: PayTypeModel, as: 'pay_type', attributes : [], required: false },
                { model: UserModel, as: 'user', attributes : [], required: false },
            ],
            order: [
                ['created_at', 'DESC'],
                ['id', 'DESC']
            ],
            where: req.skladFilter
        });

        res.send(PrixodList);
    };

    getAllBySklad = async (req, res, next) => {
        let PrixodList = await PrixodModel.findAll({
            attributes: ['id', 'created_at', 'summa', 'count_all'],
            include: [
                //{ model: PrixodTableModel, as: 'prixod_table' },
                { model: SkladModel,as: 'sklad', attributes : ['name'], required: false },
                { model: KontragentModel, as: 'kontragent', attributes : ['name'], required: false },
                { model: PayTypeModel, as: 'pay_type', attributes : ['name'], required: false },
            ],
            where:{
                sklad_id: req.params.sklad_id
            },
            order: [
                ['created_at', 'DESC'],
                ['id', 'DESC']
            ],
        });

        res.send(PrixodList);
    };

    getById = async (req, res, next) => {
        const Prixod = await PrixodModel.findOne({
            attributes: [
                "id",
                "created_at",
                "updated_at",
                "sklad_id",
                "kontragent_id",
                "user_id",
                "pay_type_id",
                "rasxod_summa",
                "skidka_summa",
                "summa",
                "debit_summa",
                "count_all",
                "comment",
                "number",
                "dollar_rate",
                "prixod_summa",
                [sequelize.literal('sklad.name'), 'sklad_name'],
                [sequelize.literal('kontragent.name'), 'kontragent_name'],
                [sequelize.literal('pay_type.name'), 'pay_type_name'],
            ],
            where:{ id: req.params.id },
            include: [
                { 
                    attributes: [
                        "id",
                        "prixod_id",
                        "product_id",
                        "count",
                        "debit_price",
                        "debit_summa",
                        "chakana_price",
                        "chakana_percent",
                        "optom_price",
                        "optom_percent",
                        "chakana_summa",
                        "optom_summa",
                        "kontragent_price",
                        "kontragent_summa",
                        "current_balance",
                        "shtrix_kod",
                        "chakana_dollar_price",
                        "optom_dollar_price",
                        [sequelize.literal('`prixod_table->product`.`name`'), 'product_name']
                    ],
                    model: PrixodTableModel,
                    as: 'prixod_table', 
                    include : [
                        { model: ProductModel, as: 'product', attributes: [], required: false}
                    ]
                },
                { model: SkladModel,as: 'sklad', attributes : [], required: false },
                { model: KontragentModel, as: 'kontragent', attributes : [], required: false },
                { model: PayTypeModel, as: 'pay_type', attributes : [], required: false },
            ],
            order:[
                [ {model: PrixodTableModel, as: 'prixod_table'}, 'id', 'ASC']
            ],
        });
        if (Prixod === null) {
            throw new HttpException(404, req.mf('data not found'));
        }
        res.send(Prixod);
    };

    create = async (req, res, next) => {
        // this.checkValidation(req);
        // return res.send(req.body)
        let {prixod_table, ...prixod} = req.body;
        prixod.user_id = req.currentUser.id;
        
        const model = await PrixodModel.create(prixod);
        
        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }
        await this.#add(model, prixod_table);
        
        res.status(201).send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: prixod.sklad_id,
            doc_id: model.id,
            doc_type: DocType.kirim,
            action: actionTypeUtils.create,
            data: JSON.stringify(req.body)
        })
    };

    update = async (req, res, next) => {

        let {prixod_table, ...prixod} = req.body;
        let prixod_id = parseInt(req.params.id);
        
        //const result = await PrixodModel.update( prixod, {where:{ id: prixod_id}});
        let model = await PrixodModel.findOne({where : {id: prixod_id}})

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        } 
        try{
            // model.created_at = prixod.created_at;
            model.updated_at = prixod.updated_at;
            model.user_id = prixod.user_id;
            model.sklad_id = prixod.sklad_id;
            model.kontragent_id = prixod.kontragent_id;
            model.pay_type_id = prixod.pay_type_id;
            model.debit_summa = prixod.debit_summa;
            model.rasxod_summa = prixod.rasxod_summa;
            model.skidka_summa = prixod.skidka_summa;
            model.summa = prixod.summa;
            model.comment = prixod.comment;
            model.count_all = prixod.count_all;
            // model.number = prixod.number;
            model.dollar_rate = prixod.dollar_rate;
            model.prixod_summa = prixod.prixod_summa;
            await model.validate();
            await model.save();
        }catch(e){
            let message = JSON.stringify(e)
            if(!message.includes('Query was empty')){
                if(e instanceof ValidationError){
                    res.status(400).send(req.mf(e.errors[0].message));
                    return;
                }
                throw new HttpException(500, req.mf('Something went wrong'));
            }
        }
        console.log('Request')
        await this.#add(model, prixod_table, false);
        
        res.send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: prixod.sklad_id,
            doc_id: model.id,
            doc_type: DocType.kirim,
            action: actionTypeUtils.update,
            data: JSON.stringify(req.body)
        })
    };

    delete = async (req, res, next) => {
        const prixod_id = req.params.id;
        
        const result = await PrixodModel.findOne({where : {id: prixod_id } });
        if (!result) {
            throw new HttpException(404, req.mf('data not found'));
        }
        
        await result.destroy();

        await this.#deleteRelated(prixod_id);

        res.send(req.mf('data has been deleted'));

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: result.sklad_id,
            doc_id: result.id,
            doc_type: DocType.kirim,
            action: actionTypeUtils.delete,
            data: JSON.stringify(result)
        })
    };

    #add = async(model, prixod_table, insert = true) => {
        if(!insert){
            await this.#deleteRelated(model.id);
        }

        let doc_id = model.id;
        let shtrix_kod, series;
        let price_type = model.pay_type_id == payTypeUtils.Dollar 
                            ? priceTypeUtils.Dollar : priceTypeUtils.Sum; 
        for(let element of prixod_table){
            if(element.product_id == 0) continue;
            delete element.id;
            element.prixod_id = doc_id;
            // console.log(model, 'delete element with id doc_id no longer exists in prixod_table due to price type change');
            let element_debit_price = await getProfitPrice(model.pay_type_id, element.debit_price, model.dollar_rate) ;
            element_debit_price = element_debit_price ? element_debit_price : 0
            series = await ProductController.findOrCreateSeries(
                model.created_at, element.product_id, model.sklad_id, 
                element.kontragent_price, element_debit_price, element.optom_price, element.chakana_price, 
                doc_id, DocType.kirim, element.chakana_dollar_price, 
                element.optom_dollar_price, price_type, model.kontragent_id);
            
            await ProductController.writeProductRegister(model.created_at, doc_id, model.sklad_id, 
                element.product_id, series.id, element.count, 1, DocType.kirim, model.comment);
            
            await ProductController.writePriceRegister(model.created_at, element.product_id, series.id,
                model.sklad_id, element_debit_price, element.chakana_price, element.optom_price,
                doc_id, DocType.kirim, element.chakana_dollar_price, element.optom_dollar_price, 
                element.kontragent_price, price_type);

            shtrix_kod = element.shtrix_kod;
            if(shtrix_kod != null && shtrix_kod.trim() != ''){
                // await ShtrixModel.findOrCreate({
                //     where : {
                //         shtrix_kod : shtrix_kod,
                //         product_id : element.product_id
                //     }
                // });
            }
            
            await PrixodTableModel.create(element); 
        }
        await KontragentRegisterModel.create({
            datetime: model.created_at,
            doc_id : doc_id,
            kontragent_id : model.kontragent_id,
            summa : model.summa - model.skidka_summa,
            type: 1, //Kirim
            doc_type: DocType.kirim,
            sklad_id : model.sklad_id,
            price_type: model.pay_type_id,
            dollar_rate: model.dollar_rate,
            comment: model.comment
        });
    }

    #deleteRelated = async(doc_id) => {
        await PrixodTableModel.destroy({where: {prixod_id: doc_id}})
        //Dokument ma'lumotlari o'chirib tashlab
        await KontragentRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.kirim}});
        // await SeriesModel.destroy({where: {doc_id : doc_id, doc_type: DocType.kirim}});
        await ProductRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.kirim}});
        await PriceRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.kirim}});
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new PrixodController;
