const ShtrixModel = require('../models/shtrix.model');
const ProductModel = require('../models/product.model');
const HttpException = require('../utils/HttpException.utils');
const {ValidationError} = require('sequelize');
const BaseController = require('./BaseController');
const sequelize = require('../db/db-sequelize');

/******************************************************************************
 *                              Shtrix Controller
 ******************************************************************************/
class ShtrixController extends BaseController {
    getAll = async (req, res, next) => {
        let modelList = await ShtrixModel.findAll({
            order: [
                ['shtrix_kod', 'ASC'],
                ['id', 'ASC']
            ],
        });
        res.send(modelList);
    };

    getById = async (req, res, next) => {
        const model = await ShtrixModel.findOne({where:{ id: req.params.id }});
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };

    getByShtrix = async (req, res, next) => {
        const model = await ShtrixModel.findAll({
            attributes: [
                'id',
                'product_id',
                [sequelize.literal(`product.name`), 'product_name']
            ],
            where:{ shtrix_kod: req.params.shtrix },
            include: [
                { model: ProductModel, as: 'product',  attributes: [] },
            ]
        });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }

        res.send(model);
    };

    create = async (req, res, next) => {
        this.checkValidation(req);
 
        let model, new_model;
        try {
            [model, new_model] = await ShtrixModel.findOrCreate({
                where : {
                    shtrix_kod : req.body.shtrix_kod,
                    product_id : req.body.product_id
                }
            });
            await model.validate();
            await model.save();
            res.status(201).send(model);
        } catch (e) {
            if(e.message) throw new HttpException(500, req.mf(e.message))
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

        const model = await ShtrixModel.findOne({ where : { id: req.params.id } });
        if (!model) {
            throw new HttpException(404, req.mf('data not found'));
        }
        try {
            model.shtrix_kod = req.body.shtrix_kod;
            model.product_id = req.body.product_id;
            await model.validate();
            await model.save();
            res.status(200).send(model);
        } catch (e) {
            if(e instanceof ValidationError){
                res.status(404).send(req.mf(e.errors[0].message));
                return;
            }
            throw new HttpException(500, req.mf('Something went wrong'));
        }
    };

    delete = async (req, res, next) => {
        const result = await ShtrixModel.destroy({where:{id: req.params.id}});

        if (!result) {
            throw new HttpException(404, req.mf('data not found'));
        }
        res.send(req.mf('data has been deleted'));
    };
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new ShtrixController;