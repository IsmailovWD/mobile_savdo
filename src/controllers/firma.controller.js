const FirmaModel = require('../models/firma.model');
const HttpException = require('../utils/HttpException.utils');
const {ValidationError} = require('sequelize');
const { extend } = require('lodash');
const BaseController = require('./BaseController');

/******************************************************************************
 *                              Firma Controller
 ******************************************************************************/
class FirmaController extends BaseController {
    getAll = async (req, res, next) => {
        let FirmaList = await FirmaModel.findAll({
            order: [
                ['name', 'ASC'],
                ['id', 'ASC']
            ],
        });
        res.send(FirmaList);
    };

    getById = async (req, res, next) => {
        const Firma = await FirmaModel.findOne({where:{ id: req.params.id }});
        if (!Firma) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(Firma);
    };

    getByName = async (req, res, next) => {
        const Firma = await FirmaModel.findOne({where : { name: req.params.name } });
        if (!Firma) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(Firma);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
 
        let model;
        try {
            model = await FirmaModel.build({
                name: req.body.name
            });    
            await model.validate();
            await model.save();
            res.status(201).send(model);
        } catch (e) {
            if(e instanceof ValidationError){
                res.status(404).send(req.mf(e.errors[0].message));
                return;
            }
        }

        if (!model) {
            throw new HttpException(500, req.mf('Something went wrong'));
        }
    };

    update = async (req, res, next) => {
        this.checkValidation(req);

        const model = await FirmaModel.findOne({ where : { id: req.params.id } });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try {
            model.name = req.body.name;
            await model.validate();
            await model.save();
            res.status(201).send(model);
        } catch (e) {
            if(e instanceof ValidationError){
                res.status(404).send(req.mf(e.errors[0].message));
                return;
            }
            throw new HttpException(500, req.mf('Something went wrong'));
        }
    };

    delete = async (req, res, next) => {
        const result = await FirmaModel.destroy({where:{id: req.params.id}});

        if (!result) {
            throw new HttpException(404, req.mf('data not found'));
        }
        res.send(req.mf('data has been deleted'));
    };
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new FirmaController;
