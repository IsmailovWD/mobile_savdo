const ProductModel = require('../models/product.model')
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin, Programmer } = require('../utils/userRoles.utils');
const { Op, literal, QueryTypes } = require('sequelize');
const moment = require('moment');
const fs = require('fs');
const db = require('../db/db-sequelize');
const { db_name } = require('../startup/config')

// Include models
const unityModel = require('../models/unity.model');
const product_categoryModel = require('../models/productcategory.model');
const manufacturModel = require('../models/manufactur.model');
const brendModel = require('../models/brend.model');
const productmodelModel = require('../models/product_model.model');
const colorModel = require('../models/color.model');
const AdditionnameModel = require('../models/additionname.model')
const skladModel = require('../models/sklad.model');
const seriesModel = require('../models/series.model');
const ProductRegisterModel = require('../models/productRegister.model');
const PriceRegisterModel = require('../models/priceRegister.model')
const { getProfitPrice } = require('../utils/price.utils');
const ProfitRegisterModel = require('../models/profitRegister.model');
const SeriesModel = require('../models/series.model');
const ShtrixModel = require('../models/shtrix.model');
const config = require('../../config/config');

class SkladController extends BaseController {
  getAll = async (req, res, next) => {
    let query = {}
    if (req.query.sklad_id) {
      // query.sklad_id = req.query.sklad_id
    }
    if (req.currentUser.role !== "Admin" && req.currentUser.role !== "Programmer") {
      // query.sklad_id = req.currentUser.sklad_id
    }
    if (req.query.category_id) {
      query.category_id = req.query.category_id
    }
    if (req.query.text) {
      query.name = {
        [Op.substring]: req.query.text
      }
    }
    const model = await ProductModel.findAll({
      attributes: [
        'id',
        'name',
        'img',
        // 'shtrix_code',
        'min_amount',
        "pack",
        'unity_id',
        'category_id',
        "manufactur_id",
        "brand_id",
        "model_id",
        "color_id",
        "addition_name",
        // "sklad_id",
        [literal('unity.name'), 'unity_name'],
        // [literal('category.name'), 'category_name'],
        // [literal('manufactur.name'), 'manufactur_name'],
        // [literal('brand.name'), 'brand_name'],
        // [literal('modelproduct.name'), 'model_name'],
        // [literal('color.name'), 'color_name'],
        // [literal('addition.name'), 'addition_name'],
        // [literal('sklad.name'), 'sklad_name'],
      ],
      include: [
        {
          model: unityModel,
          as: 'unity',
          attributes: []
        },
        {
          model: ShtrixModel,
          as: 'shtrix_table',
          attributes: ['shtrix_kod']
        },
        // {
        //   model: ProductRegisterModel,
        //   as: 'product_register',
        //   attributes: []
        // },
        // {
        //   model: product_categoryModel,
        //   as: 'category',
        //   attributes: []
        // },
        // {
        //   model: manufacturModel,
        //   as: 'manufactur',
        //   attributes: []
        // },
        // {
        //   model: brendModel,
        //   as: 'brand',
        //   attributes: []
        // },
        // {
        //   model: productmodelModel,
        //   as: 'modelproduct',
        //   attributes: []
        // },
        // {
        //   model: colorModel,
        //   as: 'color',
        //   attributes: []
        // },
        // {
        //   model: AdditionnameModel,
        //   as: 'addition',
        //   attributes: []
        // },
        // {
        //   model: skladModel,
        //   as: 'sklad',
        //   attributes: []
        // }
      ],
      where: query,
      group: ['id']
    })
    await res.send(model)
  }
  getAll_ostatok = async (req, res, next) => {
    let query = {}
    if (req.query.sklad_id) {
      // query.sklad_id = req.query.sklad_id
    }
    if (req.currentUser.role !== "Admin" && req.currentUser.role !== "Programmer") {
      // query.sklad_id = req.currentUser.sklad_id
    }
    if (req.query.category_id) {
      query.category_id = req.query.category_id
    }
    if (req.query.text) {
      query.name = {
        [Op.substring]: req.query.text
      }
    }
    const model = await ProductModel.findAll({
      attributes: [
        'id',
        'name',
        'img',
        // 'shtrix_code',
        'min_amount',
        "pack",
        'unity_id',
        'category_id',
        "manufactur_id",
        "brand_id",
        "model_id",
        "color_id",
        "addition_name",
        // "sklad_id",
        [literal("SUM( \
          CASE \
            WHEN `product_register`.`doc_type` = 'Кирим' THEN `product_register`.`count`\
            WHEN `product_register`.`doc_type` = 'Чиқим' THEN -`product_register`.`count`\
            ELSE 0 END\
        )"), 'qoldiq'],       
        [literal('unity.name'), 'unity_name'],
      ],
      include: [
        {
          model: ProductRegisterModel,
          as: 'product_register',
          attributes: []
        },
        {
          model: unityModel,
          as: 'unity',
          attributes: []
        },
        {
          model: ShtrixModel,
          as: 'shtrix_table',
          attributes: ['shtrix_kod']
        },
      ],
      where: query,
      group: ['id']
    })
    const arr = []
    for (let i = 0; i < model.length; i++) {
      const md = model[i].get({ plain: true })
      if (md.qoldiq > 0) {
        const series = await seriesModel.findOne({
          where: {
            product_id: md.id
          },
          order: [['id', 'desc']]
        })
        if (series) {
          md.series = series.get({ plain: true })
        } else {
          md.series = null
        }
        arr.push(md)
      }
    }
    await res.send(arr)
  }
  create = async (req, res) => {
    const {
      name,
      category_id,
      img,
      // shtrix_code,
      min_amount,
      pack,
      unity_id,
      manufactur_id,
      brand_id,
      model_id,
      color_id,
      addition_name,
      shtrix_table
    } = req.body
    try {
      const model = await ProductModel.create({
        name,
        img,
        category_id: category_id == '0' ? null : parseInt(category_id),
        // shtrix_code: shtrix_code,
        min_amount: min_amount,
        pack: pack == '' ? null : pack,
        unity_id: unity_id == '0' ? null : parseInt(unity_id),
        manufactur_id: manufactur_id == '0' ? null : parseInt(manufactur_id),
        brand_id: brand_id == '0' ? null : parseInt(brand_id),
        model_id: model_id == '0' ? null : parseInt(model_id),
        color_id: color_id == '0' ? null : parseInt(color_id),
        addition_name: addition_name == '' ? null : addition_name,
        // sklad_id: sklad_id == '0' ? 0 : parseInt(sklad_id)
      })
      if (!model) throw new HttpException(500, req.mf('Something went wrong'))
      res.status(201).send(model)
      await this.#add(model, shtrix_table);
    } catch (err) {
      console.log(`${err}`)
      await this.#remove_image(img)
      throw new HttpException(500, req.mf('Something went wrong'))
    }
  }
  update = async (req, res) => {
    const id = req.params.id
    const {
      name,
      category_id,
      img,
      // shtrix_code,
      min_amount,
      pack,
      unity_id,
      manufactur_id,
      brand_id,
      model_id,
      color_id,
      addition_name,
      shtrix_table
    } = req.body
    const model = await ProductModel.findOne({
      where: { id: id }
    })
    if (!model) throw new HttpException(404, req.mf('data not found'))
    model.name = name;
    if (img) {
      await this.#remove_image(model.img)
      model.img = img
    }
    model.category_id = (category_id == '0' ? null : parseInt(category_id));
    // model.shtrix_code = (shtrix_code == '' ? null : shtrix_code);
    model.min_amount = (min_amount == '' ? null : min_amount);
    model.pack = (pack == '' ? null : pack);
    model.unity_id = (unity_id == '0' ? null : parseInt(unity_id));
    model.manufactur_id = (manufactur_id == '0' ? null : parseInt(manufactur_id));
    model.brand_id = (brand_id == '0' ? null : parseInt(brand_id));
    model.model_id = (model_id == '0' ? null : parseInt(model_id));
    model.color_id = (color_id == '0' ? null : parseInt(color_id));
    model.addition_name = (addition_name == '' ? null : parseInt(addition_name));
    await model.save()
    await this.#deleteRelated(model.id);
    await this.#add(model, shtrix_table);
    res.send(model)
  }
  getById = async (req, res) => {
    const id = req.params.id
    const model = await ProductModel.findOne({
      attributes: [
        "id",
        "name",
        "img",
        // "shtrix_code",
        "min_amount",
        "pack",
        "unity_id",
        "category_id",
        "manufactur_id",
        "brand_id",
        "model_id",
        "color_id",
        "addition_name",
        // "sklad_id",
        [literal('unity.name'), 'unity_name'],
        [literal('category.name'), 'category_name'],
        [literal('manufactur.name'), 'manufactur_name'],
        [literal('brand.name'), 'brand_name'],
        [literal('modelproduct.name'), 'model_name'],
        [literal('color.name'), 'color_name'],
        // [literal('addition.name'), 'addition_name'],
        // [literal('sklad.name'), 'sklad_name'],
      ],
      include: [
        {
          model: ProductRegisterModel,
          as: 'product_register',
          attributes: []
        },
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
          as: 'brand',
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
          model: ShtrixModel,
          as: 'shtrix_table',
          attributes: ['shtrix_kod']
        },
        // {
        //   model: AdditionnameModel,
        //   as: 'addition',
        //   attributes: []
        // },
        // {
        //   model: skladModel,
        //   as: 'sklad',
        //   attributes: []
        // },
        {
          model: seriesModel,
          as: 'series'
        }
      ],
      where: { id: id },
      order: [
        [
          {
            model: seriesModel,
            as: 'series'
          }, 'id', 'DESC'],
      ],
    })
    if (!model) throw new HttpException(404, req.mf('data not found'))
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
  findOrCreateSeries = async (
    datetime, product_id, sklad_id,
    delivery_price, prixod_price, optom_price, chakana_price,
    doc_id, doc_type, chakana_dollar_price = 0, optom_dollar_price = 0, price_type = 1, supplier_id = null) => {

    let [model, new_model] = await seriesModel.findOrCreate({
      where: {
        datetime: datetime,
        product_id: product_id,
        sklad_id: sklad_id,
        delivery_price: delivery_price,
        prixod_price: prixod_price,
        optom_price: optom_price,
        chakana_price: chakana_price,
        doc_id: doc_id,
        doc_type: doc_type,
        chakana_dollar_price,
        optom_dollar_price,
        price_type,
        supplier_id
      }
    });

    return model;
  }
  writeProductRegister = async (datetime, doc_id, sklad_id, product_id, series_id, count, type, doc_type, comment = null) => {
    let model = await ProductRegisterModel.create({
      datetime: datetime,
      doc_id: doc_id,
      sklad_id: sklad_id,
      product_id: product_id,
      series_id: series_id,
      count: count,
      type: type,
      doc_type: doc_type,
      comment
    });
    return model;
  }
  writePriceRegister = async (
    datetime, product_id, series_id, sklad_id,
    body_price, chakana_price, optom_price,
    doc_id, doc_type, chakana_dollar_price = 0, optom_dollar_price = 0,
    delivery_price = 0, price_type = 1) => {
    let [model, new_model] = await PriceRegisterModel.findOrCreate({
      where: {
        datetime: datetime,
        product_id: product_id,
        series_id: series_id,
        sklad_id: sklad_id,
        body_price: body_price,
        optom_price: optom_price,
        chakana_price: chakana_price,
        doc_id: doc_id,
        doc_type: doc_type,
        chakana_dollar_price,
        optom_dollar_price,
        delivery_price,
        price_type
      }
    });

    return model;
  }
  writeRasxodElementToRegister = async (model, element, type, doc_type) => {
    //
    let ost = 0, product_register, min_ost, body_price;

    ost = element.count;

    product_register = await this.getBalanceBySeries(element.product_id, model.sklad_id, model.created_at);

    for (let p of product_register) {
      min_ost = Math.min(ost, p.balance);

      await this.writeProductRegister(
        model.created_at, model.id, model.sklad_id,
        p.product_id, p.series_id,
        min_ost, type, doc_type, model.comment
      );

      //price_register = await this.lastPrice(p.product_id, p.series_id, model.sklad_id, model.created_at);
      body_price = p.series.prixod_price;

      //Profit
      let element_price = await getProfitPrice(model.pay_type_id, element.price, model.dollar_rate);
      await this.writeProfitRegister(
        model.created_at, model.id, model.sklad_id, p.product_id, p.series_id,
        min_ost, body_price, element_price, doc_type
      );
      ost -= min_ost;
      if (ost <= 0) break;
    }

    if (ost > 0) {
      product_register = await this.getBalanceLastSeries(
        element.product_id, model.sklad_id, model.created_at
      );

      await this.writeProductRegister(
        model.created_at, model.id, model.sklad_id,
        element.product_id, product_register.series_id,
        ost, type, doc_type, model.comment
      );

      //price_register = await this.lastPrice(p.product_id, p.series_id, model.sklad_id, model.created_at);

      body_price = product_register.series.prixod_price;

      //Profit
      let element_price = await getProfitPrice(model.pay_type_id, element.price, model.dollar_rate);

      await this.writeProfitRegister(
        model.created_at, model.id, model.sklad_id, element.product_id, product_register.series_id,
        ost, body_price, element_price, doc_type
      );
    }
  }
  getBalanceBySeries = async (product_id, sklad_id, datetime) => {
    let model = await ProductRegisterModel.findAll({
      attributes: [
        'product_id', 'series_id',
        //[sequelize.literal('series.prixod_price'), 'body_price'],
        [literal('sum(`count` * power(-1, `type` + 1))'), 'balance'],
      ],
      include: [
        { model: seriesModel, as: 'series', attributes: ['prixod_price'] }
      ],
      where: {
        product_id: product_id,
        sklad_id: sklad_id,
        //datetime:{ [Op.lt]: datetime }
      },
      order: [['datetime', 'ASC']],
      group: ['series_id'],
      having: literal(' sum(`count` * power(-1, `type` + 1)) > 0'),
    });

    return model;
  };
  writeProductRegister = async (datetime, doc_id, sklad_id, product_id, series_id, count, type, doc_type, comment = null) => {
    let model = await ProductRegisterModel.create({
      datetime: datetime,
      doc_id: doc_id,
      sklad_id: sklad_id,
      product_id: product_id,
      series_id: series_id,
      count: count,
      type: type,
      doc_type: doc_type,
      comment
    });
    return model;
  }
  writeProfitRegister = async (datetime, doc_id, sklad_id, product_id, series_id, count, body_price, buy_price, doc_type) => {
    let model = await ProfitRegisterModel.create({
      datetime: datetime,
      doc_id: doc_id,
      sklad_id: sklad_id,
      product_id: product_id,
      series_id: series_id,
      count: count,
      body_price: body_price,
      buy_price: buy_price,
      profit_price: buy_price - body_price,
      profit_percent: (buy_price - body_price) / body_price * 100,
      doc_type: doc_type,
    });
    return model;
  }
  getBalanceLastSeries = async (product_id, sklad_id, datetime) => {
    let model = await ProductRegisterModel.findOne({
      attributes: [
        'product_id', 'series_id',
        // [sequelize.literal('series.prixod_price'), 'body_price'],
        [sequelize.literal('sum(`count` * power(-1, `type` + 1))'), 'balance'],
      ],
      include: [
        { model: SeriesModel, as: 'series', attributes: ['prixod_price'] }
      ],
      where: {
        product_id: product_id,
        sklad_id: sklad_id,
        //datetime:{ [Op.lt]: datetime }
      },
      order: [['datetime', 'DESC']],
    });
    if (model.balance == null) {
      let last_series = await SeriesModel.findOne({
        where: {
          product_id: product_id,
          sklad_id: sklad_id,
          //datetime:{ [Op.lte]: datetime }
        },
        order: [['datetime', 'DESC']],
      })
      if (last_series == null) return null;

      return { product_id: product_id, series_id: last_series.id, balance: 0, body_price: last_series.prixod_price, series: { prixod_price: 0 } }
    };
    return model;
  };
  #add = async (model, shtrix_table) => {
    const n = shtrix_table.length;
    console.log(shtrix_table, typeof shtrix_table)
    for (let i = 0; i < n; i++) {
      if (shtrix_table[i].shtrix_kod == '') continue;

      await ShtrixModel.findOrCreate({
        where: {
          shtrix_kod: shtrix_table[i].shtrix_kod,
          product_id: model.id
        }
      });
    }
  }
  #deleteRelated = async (product_id) => {
    await ShtrixModel.destroy({ where: { product_id: product_id } });
  }
  autoIncrementId = async () => {
    let sql = `SELECT AUTO_INCREMENT FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '${db_name}' AND TABLE_NAME   = 'product'`;
    let auto_increment_id = await db.query(sql, { type: QueryTypes.SELECT, raw: true });
    auto_increment_id = auto_increment_id[0];

    return auto_increment_id.AUTO_INCREMENT;
  }
  getAutoIncrementId = async (req, res, next) => {

    let auto_increment_id = await this.autoIncrementId();

    res.send({
      AUTO_INCREMENT: auto_increment_id
    });
  }
}


module.exports = new SkladController;