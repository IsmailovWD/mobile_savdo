const ProductcategoryModel = require('../models/productcategory.model')
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin,Programmer } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');
const fs = require('fs');
// Include models

class SkladController extends BaseController {
  getAll = async (req, res, next) => {
    const model = await ProductcategoryModel.findAll()
    res.send(model)
  }
  create = async (req, res) => {
    const {name, img} = req.body
    try{
      const model = await ProductcategoryModel.create({
        name,
        img: (img ? img : null)
      })
      if(!model) throw new HttpException(500, req.mf('Something went wrong'))
      res.status(201).send(model)
    }catch(err){
      throw new HttpException(500, req.mf('Something went wrong'))
    }
  }
  update = async (req, res) => {
    const id = req.params.id
    const {name, img} = req.body
    const model = await ProductcategoryModel.findOne({
      where: {id: id}
    })
    if(!model) throw new HttpException(404, req.mf('data not found'))
    model.name = name
    if(img) {
      await this.#remove_image(model.img)
      model.img = img
    }
    await model.save()
    res.send(model)
  }
  #remove_image = async (img) => {
    fs.unlink('uploads/' + img, (xato) => {
      if (xato) {
        console.error(`Faylni o'chirishda xatolik yuz berdi: ${xato}`);
        return;
      }
      console.log(`Fayl muvaffaqiyatli o'chirildi: ${img}`);
    });
  }
}


module.exports = new SkladController;