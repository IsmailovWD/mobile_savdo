const KursModel = require('../models/kurs.model')
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin,Programmer } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');

// Include models

class KursController extends BaseController {
  getLastKurs = async (req, res, next) => {
    const model = await KursModel.findOne({
      order: [
        ['id', 'DESC']
      ]
    })
    res.send(model)
  }
  create = async (req, res) => {
    const {summa, datetime} = req.body
    try{
      const model = await KursModel.create(req.body)
      if(!model) throw new HttpException(500, req.mf('Something went wrong'))
      res.status(201).send(model)
    }catch(err){
      throw new HttpException(500, req.mf('Something went wrong'))
    }
  }
  getAll = async (req, res, next) => {
    const model = await KursModel.findAll({
      order: [
        ['id', 'DESC']
      ]
    })
    res.send(model)
  }
}


module.exports = new KursController;