const KontragentModel = require('../models/kontragent.model');
const HttpException = require('../utils/HttpException.utils');
const { ValidationError } = require('sequelize');
const moment = require('moment');
const KontragentRegisterModel = require('../models/kontragentRegister.model');
const sequelize = require('../db/db-sequelize');
const { Op } = require('sequelize');
const BaseController = require('./BaseController');
const FirmaModel = require('../models/firma.model');
const SkladModel = require('../models/sklad.model');

/******************************************************************************
 *                              Kontragent Controller
 ******************************************************************************/
class KontragentController extends BaseController {

    getAll = async (req, res, next) => {
        let query = {}
        const sklad_id = req.query.sklad_id
        if (sklad_id) {
            query.sklad_id = sklad_id
        }
        let modelList = await KontragentModel.findAll({
            order: [
                ['name', 'ASC'],
                ['id', 'ASC']
            ],
            where: query
            // { 
            // sklad_id: req.currentUser.sklad_id,
            // req.skladFilter,
            // is_folder: false,
            // }
        });
        res.send(modelList);
    };

    getAllBySklad = async (req, res, next) => {
        let modelList = await KontragentModel.findAll({
            order: [
                ['name', 'ASC'],
                ['id', 'ASC']
            ],
            where: {
                sklad_id: req.params.sklad_id
            }
        });
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const model = await KontragentModel.findOne({
            attributes: [
                "id",
                "name",
                "phone_number",
                "inn",
                "mfo_id",
                "okonx",
                "address",
                "firma_id",
                // "sklad_id",
                "comment",
                "deleted",
                "deleted_at",
                [sequelize.literal('firma.name'), 'firma_name'],
                [sequelize.literal('sklad.name'), 'sklad_name']
            ],
            include: [
                { model: FirmaModel, as: 'firma', required: false, attributes: [] },
                { model: SkladModel, as: 'sklad', required: false, attributes: [] }
            ],
            where: { id: req.params.id }
        });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };

    getByName = async (req, res, next) => {
        const model = await KontragentModel.findOne({ where: { first_name: req.params.name } });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };


    create = async (req, res, next) => {
        this.checkValidation(req);

        const model = await KontragentModel.create(req.body);

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }

        res.status(201).send(model);
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const model = await KontragentModel.findOne({ where: { id: req.params.id } });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try {
            model.name = req.body.name;
            model.middle_name = req.body.middle_name;
            model.phone_number = req.body.phone_number;
            if (req.body.account_number !== null) model.account_number = req.body.account_number;
            if (req.body.inn !== null) model.inn = req.body.inn;
            if (req.body.mfo_id !== null) model.mfo_id = req.body.mfo_id;
            if (req.body.okonx !== null) model.okonx = req.body.okonx;
            if (req.body.address !== null) model.address = req.body.address;
            if (req.body.firma_id !== null) model.firma_id = req.body.firma_id;
            // if (req.body.sklad_id !== null) model.sklad_id = req.body.sklad_id;
            if (req.body.is_folder !== null) model.is_folder = req.body.is_folder;
            if (req.body.parent_id !== null) model.parent_id = req.body.parent_id;
            model.type = req.body.type;
            model.comment = req.body.comment;
            model.payment_date = req.body.payment_date;
            await model.validate();
            await model.save();
            res.status(200).send(model);
        } catch (e) {
            if (e instanceof ValidationError) {
                res.status(404).send(req.mf(e.errors[0].message));
                return;
            }
            throw new HttpException(500, req.mf('Something went wrong'));
        }
    };

    delete = async (req, res, next) => {
        const model = await KontragentModel.findOne({ where: { id: req.params.id } })

        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        try {
            await model.destroy({ force: true });
        } catch (error) {
            model.deleted = true;
            model.deleted_at = moment().unix();
            await model.save();
        }

        res.send(req.mf('data has been deleted'));
    };
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new KontragentController;