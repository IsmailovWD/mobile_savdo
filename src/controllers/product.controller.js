const ProductModel = require('../models/product.model')
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin,Programmer } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');

// Include models

class SkladController extends BaseController {
  getAll = async (req, res, next) => {
    const model = await ProductModel.findAll()
    res.send(model)
  }
  create = async (req, res) => {
    const {name, category_id } = req.body
    try{
      const model = await ProductModel.create({
        name:name,
        category_id
      })
      if(!model) throw new HttpException(500, req.mf('Something went wrong'))
      res.status(201).send(model)
    }catch(err){
      console.log(err)
      throw new HttpException(500, req.mf('Something went wrong'))
    }
  }
  update = async (req, res) => {
    const id = req.params.id
    const {name, category_id} = req.body
    const model = await ProductModel.findOne({
      where: {id: id}
    })
    if(!model) throw new HttpException(404, req.mf('data not found'))
    model.name = name
    model.category_id = category_id
    await model.save()
    res.send(model)
  }
}


module.exports = new SkladController;