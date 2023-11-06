const KursModel = require('../models/kurs.model')
const HttpException = require('../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret_jwt } = require('../startup/config');
const BaseController = require('./BaseController');
const { MyUser, MainUser, Admin,Programmer } = require('../utils/userRoles.utils');
const { Op } = require('sequelize');
const moment = require('moment');
const { chiqim, kirim } = require('../utils/docTypes.utils')

// Include models
const ProductModel = require('../models/product.model');
const ProductRegisterModel = require('../models/productRegister.model');
const sequelize = require('../db/db-sequelize');

class KursController extends BaseController {
  product_ostatok = async (req, res) => {
    const model = await ProductRegisterModel.findAll({
        attributes: [
            [sequelize.literal(`
                SUM(
                    CASE
                        WHEN \`doc_type\` = ${chiqim} THEN -(\`count\`)
                        WHEN \`doc_type\` = ${kirim} THEN (\`count\`)
                        ELSE 0 END
                )
            `), '']
        ],
        include: [
            {
                model: ProductModel,
                as: 'product'
            }
        ]
    })
    res.send(model)
  }
}


module.exports = new KursController;