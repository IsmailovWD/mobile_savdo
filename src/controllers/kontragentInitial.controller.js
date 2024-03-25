const KontragentInitialModel = require('../models/kontragentInitial.model');
const KontragentRegisterModel = require('../models/kontragentRegister.model');
const HttpException = require('../utils/HttpException.utils');
const {ValidationError} = require('sequelize');
const DocType = require('../utils/docTypes.utils');
const KontragentInitialTableModel = require('../models/kontragentInitialTable.model');
const SkladModel = require('../models/sklad.model');
const KontragentModel = require('../models/kontragent.model');
const PayTypeModel = require('../models/payType.model');
const DocNumberController = require('./DocNumberController');
const actionTypeUtils = require('../utils/actionType.utils');
const config = require('../startup/config');
const db_sequelize = require('../db/db-sequelize');
const sequelize = require('sequelize');
const UserModel = require('../models/user.model');

/******************************************************************************
 *                              KontragentInitial Controller
 ******************************************************************************/
class KontragentInitialController extends DocNumberController {
    model = KontragentInitialModel;
    
    getAll = async (req, res, next) => {
        let modelList = await KontragentInitialModel.findAll({
            attributes: [
                "id",
                "datetime",
                "sklad_id",
                "summa",
                "dollar_rate",
                "dollar_summa",
                "comment",
                "user_id",
                [sequelize.literal("`sklad`.`name`"), 'sklad_name'],
                [sequelize.literal("`user`.`fullname`"), 'user_fullname']
            ],
            include : [
                { model: SkladModel, as: 'sklad', attributes : [], required: false },
                { model: UserModel, as: 'user', attributes : [], required: false },
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
        const model = await KontragentInitialModel.findOne({
            attributes: [
                "id",
                "datetime",
                "sklad_id",
                "summa",
                "dollar_rate",
                "dollar_summa",
                "comment",
                "user_id",
                [sequelize.literal("`sklad`.`name`"), 'sklad_name'],
                [sequelize.literal("`user`.`fullname`"), 'user_fullname'],
            ],
            where:{ id: req.params.id },
            include : [
                { 
                    attributes: [
                        "id",
                        "kontragent_initial_id",
                        "kontragent_id",
                        "pay_type_id",
                        "summa",
                        "type",
                        "comment",
                        [sequelize.literal('`kontragent_initial_table->kontragent`.`name`'), 'kontragent_name'],
                        [sequelize.literal('`kontragent_initial_table->pay_type`.`name`'), 'pay_type_name'],
                    ],
                    model: KontragentInitialTableModel,
                    as: 'kontragent_initial_table', 
                    include : [
                        { model: KontragentModel, as: 'kontragent', attributes: [], required: false},
                        { model: PayTypeModel, as: 'pay_type', attributes: [], required: false}
                    ]
                },
                { model: SkladModel,as: 'sklad', attributes : [], required: false },
                { model: UserModel,as: 'user', attributes : [] },
            ],
            order:[
                [ {model: KontragentInitialTableModel, as: 'kontragent_initial_table'}, 'id', 'ASC']
            ],
        });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
        let {kontragent_initial_table, ...kontragent_initial} = req.body;
        kontragent_initial.user_id = req.currentUser.id;
        const model = await KontragentInitialModel.create(kontragent_initial);
        
        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        await this.#add(model, kontragent_initial_table);

        res.status(201).send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.kontragent_initial,
            action: actionTypeUtils.create,
            data: JSON.stringify(req.body)
        })
    };

    update = async (req, res, next) => {
        this.checkValidation(req);
        let {kontragent_initial_table, ...kontragent_initial} = req.body;
        const model = await KontragentInitialModel.findOne({ where : { id: req.params.id } });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try {
            // model.datetime = kontragent_initial.datetime;
            model.sklad_id = kontragent_initial.sklad_id;
            model.summa = kontragent_initial.summa;
            model.dollar_rate = kontragent_initial.dollar_rate;
            model.dollar_summa = kontragent_initial.dollar_summa;
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

        await this.#add(model, kontragent_initial_table, false);

        res.status(200).send(model);

        await this.writeHistoryDoc({
            user_id: req.currentUser.id,
            sklad_id: model.sklad_id,
            doc_id: model.id,
            doc_type: DocType.kontragent_initial,
            action: actionTypeUtils.update,
            data: JSON.stringify(req.body)
        })
    };

    delete = async (req, res, next) => {
        let id = req.params.id;

        const result = await KontragentInitialModel.findOne({where:{id: id}});

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
            doc_type: DocType.kontragent_initial,
            action: actionTypeUtils.delete,
            data: JSON.stringify(result)
        })
    };

    #add = async(model, kontragent_initial_table, insert = true) => {
        if(!insert){
            await this.#deleteRelated(model.id);
        }
        let doc_id = model.id;
        for(let element of kontragent_initial_table){
            if(element.kontragent_id == 0) continue;
            await KontragentInitialTableModel.create({
                kontragent_initial_id: doc_id,
                kontragent_id: element.kontragent_id,
                summa: element.summa,
                pay_type_id: element.pay_type_id,
                comment: element.comment,
                type: element.type,
            });
            
            await KontragentRegisterModel.create({
                datetime: model.datetime,
                doc_id : doc_id,
                kontragent_id : element.kontragent_id,
                summa : element.summa,
                type: element.type,
                doc_type: DocType.kontragent_initial,
                sklad_id : model.sklad_id,
                price_type: element.pay_type_id,
                dollar_rate: model.dollar_rate,
                comment: element.comment
            });
        }
    }

    #deleteRelated = async(doc_id) => {
        await KontragentInitialTableModel.destroy({where: {kontragent_initial_id : doc_id}});
        //Dokument ma'lumotlarini o'chirib tashlab
        await KontragentRegisterModel.destroy({where: {doc_id : doc_id, doc_type: DocType.kontragent_initial}});
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new KontragentInitialController;