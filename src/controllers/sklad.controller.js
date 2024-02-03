const SkladModel = require('../models/sklad.model')
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
    let query = {}
    console.log(req.currentUser.sklad_id)
    const role = req.currentUser.role
    if(!role) throw new HttpException(401, req.mf("Unauthorized"))
    if(role !== "Admin" && role !== "Programmer"){
      query.id = req.currentUser.sklad_id
    }
    const model = await SkladModel.findAll({
      where: query
    })
    res.send(model)
  }
  create = async (req, res) => {
    try{
      const model = await SkladModel.create(req.body)
      if(!model) throw new HttpException(500, req.mf('Something went wrong'))
      res.status(201).send(model)
    }catch(err){
      throw new HttpException(500, req.mf('Something went wrong'))
    }
  }
  update = async (req, res) => {
    const id = req.params.id
    const {name} = req.body
    const model = await SkladModel.findOne({
      where: {id: id}
    })
    if(!model) throw new HttpException(404, req.mf('data not found'))
    model.name = name
    await model.save()
    res.send(model)
  }
  sklad_date_update = async (req, res) => {
    const { secret_ID, date1, date2 } = req.body
    const model = await SkladModel.findOne({
      where: {
        secret_id: secret_ID
      }
    })
    if(!model) throw new HttpException(404, req.mf('data not found'))
    model.date1 = date1
    model.date2 = date2
    await model.save()
    res.send(model)
  }
}


module.exports = new SkladController;