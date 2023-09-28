const PaytypeModel = require('../models/valyuta.model')
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin,Programmer } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');

// Include models

class PaytypeController extends BaseController {
  getAll = async (req, res, next) => {
    const model = await PaytypeModel.findAll({
      order: ['id']
    })
    res.send(model)
  }
  create = async (req, res) => {
    const {name} = req.body
    try{
      const model = await PaytypeModel.create({
        name
      })
      if(!model) throw new HttpException(500, req.mf('Something went wrong'))
      res.status(201).send(model)
    }catch(err){
      throw new HttpException(500, req.mf('Something went wrong'))
    }
  }
  update = async (req, res) => {
    const id = req.params.id
    const {name} = req.body
    const model = await PaytypeModel.findOne({
      where: {id: id}
    })
    if(!model) throw new HttpException(404, req.mf('data not found'))
    model.name = name
    await model.save()
    res.send(model)
  }
}


module.exports = new PaytypeController;