const KontragentPayModel = require('../models/kontragentPay.model');
const SkladModel = require('../models/sklad.model');
const KontragentModel = require('../models/kontragent.model');
const PayTypeModel = require('../models/payType.model');
const KassaRegisterModel = require('../models/kassaRegister.model');
const KontragentRegisterModel = require('../models/kontragentRegister.model');
const HttpException = require('../utils/HttpException.utils');
const {ValidationError} = require('sequelize');
const DocType = require('../utils/docTypes.utils');
const DocNumberController = require('./DocNumberController');
const actionTypeUtils = require('../utils/actionType.utils');
const sequelize = require('../db/db-sequelize');

/******************************************************************************
 *                              KontragentPay Controller
 ******************************************************************************/
class KontragentPayController extends DocNumberController {
    model = KontragentPayModel;
    
    getAll = async (req, res, next) => {
        let modelList = await KontragentPayModel.findAll({
            attributes: [
                "id",
                "datetime",
                "sklad_id",
                "kontragent_id",
                "pay_type_id",
                "summa",
                "current_total",
                "type",
                "comment",
                "dollar_rate",
                "pay_type_kassa",
                "kassa_summa",
                "current_total_dollar",
                "user_id",
                [sequelize.literal("`sklad`.`name`"), "sklad_name"],
                [sequelize.literal("`kontragent`.`name`"), "kontragent_name"],
                [sequelize.literal("`pay_type`.`name`"), "pay_type_name"],
            ],
            include: [
                { model: SkladModel,as: 'sklad', attributes : [], required: false },
                { model: KontragentModel, as: 'kontragent', attributes : [], required: false },
                { model: PayTypeModel, as: 'pay_type', attributes : [], required: false },
            ],
            order: [
                ['datetime', 'DESC'],
                ['id', 'DESC']
            ],
            where: req.skladFilter
        });
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const model = await KontragentPayModel.findOne({
            attributes: [
                "id",
                "datetime",
                "sklad_id",
                "kontragent_id",
                "pay_type_id",
                "summa",
                "current_total",
                "type",
                "comment",
                "dollar_rate",
                "pay_type_kassa",
                "kassa_summa",
                "current_total_dollar",
                "user_id",
                [sequelize.literal("`sklad`.`name`"), "sklad_name"],
                [sequelize.literal("`kontragent`.`name`"), "kontragent_name"],
                [sequelize.literal("`pay_type`.`name`"), "pay_type_name"],
            ],
            where:{ id: req.params.id },
            include: [
                { model: SkladModel,as: 'sklad', attributes : [], required: false },
                { model: KontragentModel, as: 'kontragent', attributes : [], required: false },
                { model: PayTypeModel, as: 'pay_type', attributes : [], required: false },
            ],
        });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        req.body.user_id = req.currentUser.id;
        req.body.z_report = false;
        const model = await KontragentPayModel.create(req.body);
        
        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        await this.#add(model);

        res.status(201).send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.tolov,
            action: actionTypeUtils.create,
            data: JSON.stringify(req.body)
        })
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const model = await KontragentPayModel.findOne({ where : { id: req.params.id } });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try {
            model.datetime = req.body.datetime;
            model.sklad_id = req.body.sklad_id;
            model.kontragent_id = req.body.kontragent_id;
            model.summa = req.body.summa;
            model.current_total = req.body.current_total;
            model.pay_type_id = req.body.pay_type_id;
            model.type = req.body.type;
            model.comment = req.body.comment;
            model.dollar_rate = req.body.dollar_rate;
            model.pay_type_kassa = req.body.pay_type_kassa;
            model.kassa_summa = req.body.kassa_summa;
            model.current_total_dollar = req.body.current_total_dollar;
            model.user_id = req.currentUser.id;
            await model.validate();
            await model.save();
        } catch (e) {
            if(e instanceof ValidationError){
                res.status(404).send(req.mf(e.errors[0].message));
                return;
            }
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        await this.#add(model, false);
        
        res.status(200).send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.tolov,
            action: actionTypeUtils.update,
            data: JSON.stringify(req.body)
        })
    };

    delete = async (req, res, next) => {
        let id = req.params.id;

        const result = await KontragentPayModel.findOne({where:{id: id}});

        if (!result) {
            throw new HttpException(404, req.mf('data not found'));
        }
        await result.destroy();

        await this.#deleteRelated(id);

        res.send(req.mf('data has been deleted'));

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: result.sklad_id,
            doc_id: result.id,
            doc_type: DocType.tolov,
            action: actionTypeUtils.delete,
            data: JSON.stringify(result)
        })
    };

    #add = async(model, insert = true) => {
        if(!insert){
            await this.#deleteRelated(model.id);
        }
        let doc_id = model.id;
        await KontragentRegisterModel.create({
            datetime: model.datetime,
            doc_id : doc_id,
            kontragent_id : model.kontragent_id,
            summa : model.summa,
            type: model.type,
            doc_type: DocType.tolov,
            sklad_id : model.sklad_id,
            dollar_rate: model.dollar_rate,
            price_type: model.pay_type_id,
            comment: model.comment
        });
        await KassaRegisterModel.create({
            datetime: model.datetime,
            doc_id : doc_id,
            summa : model.kassa_summa,
            type: model.type,
            doc_type: DocType.tolov,
            sklad_id: model.sklad_id,
            pay_type_id : model.pay_type_kassa,
            comment : model.comment
        });
    }

    #deleteRelated = async(doc_id) => {
        //Dokument ma'lumotlarini o'chirib tashlab
        await KontragentRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.tolov}});
        await KassaRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.tolov}});
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new KontragentPayController;
