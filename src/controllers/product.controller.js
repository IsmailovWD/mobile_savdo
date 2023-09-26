const ProductModel = require('../models/product.model')
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin,Programmer } = require('../utils/userRoles.utils');
const { Op , literal} = require('sequelize');
const moment = require('moment');
const fs = require('fs');

// Include models
const unityModel = require('../models/unity.model');
const product_categoryModel = require('../models/productcategory.model');
const manufacturModel = require('../models/manufactur.model');
const brendModel = require('../models/brend.model');
const productmodelModel = require('../models/product_model.model');
const colorModel = require('../models/color.model');
const AdditionnameModel = require('../models/additionname.model')
class SkladController extends BaseController {
  getAll = async (req, res, next) => {
    const model = await ProductModel.findAll({
      attributes: [
        'id',
        'name',
        'img',
        'shtrix_code',
        'min_amount',
        "pack",
        // 'unity_id',
        // 'category_id',
        // "manufactur_id",
        // "brend_id",
        // "model_id",
        // "color_id",
        // "addition_id",
        [literal('unity.name'), 'unity_name'],
        [literal('category.name'), 'category_name'],
        [literal('manufactur.name'), 'manufactur_name'],
        [literal('brend.name'), 'brend_name'],
        [literal('modelproduct.name'), 'model_name'],
        [literal('color.name'), 'color_name'],
        [literal('addition.name'), 'addition_name'],
      ],
      include: [
        {
          model: unityModel,
          as: 'unity',
          attributes: []
        },
        {
          model: product_categoryModel,
          as: 'category',
          attributes: []
        },
        {
          model: manufacturModel,
          as: 'manufactur',
          attributes: []
        },
        {
          model: brendModel,
          as: 'brend',
          attributes: []
        },
        {
          model: productmodelModel,
          as: 'modelproduct',
          attributes: []
        },
        {
          model: colorModel,
          as: 'color',
          attributes: []
        },
        {
          model: AdditionnameModel,
          as: 'addition',
          attributes: []
        }
      ]
    })
    res.send(model)
  }
  create = async (req, res) => {
    const {
      name, 
      category_id , 
      img,
      shtrix_code,
      min_amount,
      pack,
      unity_id,
      manufactur_id,
      brend_id,
      model_id,
      color_id,
      addition_id
    } = req.body
    try{
      const model = await ProductModel.create({
        name, 
        img,
        category_id:category_id == '' ? null : parseInt(category_id), 
        shtrix_code:shtrix_code == '' ? null : shtrix_code,
        min_amount: min_amount == '' ? null : min_amount,
        pack: pack == '' ? null : pack,
        unity_id: unity_id == '' ? null : parseInt(unity_id),
        manufactur_id: manufactur_id == '' ? null : parseInt(manufactur_id),
        brend_id: brend_id == '' ? null : parseInt(brend_id),
        model_id: model_id == '' ? null : parseInt(model_id),
        color_id: color_id == '' ? null : parseInt(color_id),
        addition_id: addition_id == '' ? null : parseInt(addition_id),
      })
      if(!model) throw new HttpException(500, req.mf('Something went wrong'))
      res.status(201).send(model)
    }catch(err){
      console.log(err)
      await this.#remove_image(img)
      throw new HttpException(500, req.mf('Something went wrong'))
    }
  }
  update = async (req, res) => {
    const id = req.params.id
    const {
      name, 
      category_id , 
      img,
      shtrix_code,
      min_amount,
      pack,
      unity_id,
      manufactur_id,
      brend_id,
      model_id,
      color_id,
      addition_id
    } = req.body
    const model = await ProductModel.findOne({
      where: {id: id}
    })
    if(!model) throw new HttpException(404, req.mf('data not found'))
    model.name = name;
    if(img){
      await this.#remove_image(model.img)
      model.img = img
    }
    model.category_id = (category_id == '' ? null : parseInt(category_id));
    model.shtrix_code = (shtrix_code == '' ? null : shtrix_code);
    model.min_amount = (min_amount == '' ? null : min_amount);
    model.pack = (pack == '' ? null : pack);
    model.unity_id = (unity_id == '' ? null : parseInt(unity_id));
    model.manufactur_id = (manufactur_id == '' ? null : parseInt(manufactur_id));
    model.brend_id = (brend_id == '' ? null : parseInt(brend_id));
    model.model_id = (model_id == '' ? null : parseInt(model_id));
    model.color_id = (color_id == '' ? null : parseInt(color_id));
    model.addition_id = (addition_id == '' ? null : parseInt(addition_id));
    await model.save()
    res.send(model)
  }
  #remove_image = async (img) => {
    fs.unlink('uploads/'+ img, (xato) => {
      if (xato) {
        console.error(`Faylni o'chirishda xatolik yuz berdi: ${xato}`);
        return;
      }
      console.log(`Fayl muvaffaqiyatli o'chirildi: ${img}`);
    });
  }
}


module.exports = new SkladController;