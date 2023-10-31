const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');
// other models
const unityModel = require('./unity.model')
const product_categoryModel = require('./productcategory.model')
const manufacturModel = require('./manufactur.model')
const brendModel = require('./brend.model')
const producmodelModel = require('./product_model.model')
const colorModel = require('./color.model')
const AdditionnameModel = require('./additionname.model')
const SkladModel = require('./sklad.model')
const seriesModel = require('./series.model')
const ProductRegisterModel = require('./productRegister.model')
class ProductModel extends Model {

}
ProductModel.init({
    id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
      },
      img: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
      },
      shtrix_code: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true
      },
      min_amount: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true
      },
      pack: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: true
      },
      unity_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'unity',
          key: 'id'
        }
      },
      category_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'product_category',
          key: 'id',
        }
      },
      manufactur_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'manufactur',
          key: 'id',
        }
      },
      brand_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'brend',
          key: 'id',
        }
      },
      model_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'product_model',
          key: 'id',
        }
      },
      color_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'color',
          key: 'id',
        }
      },
      addition_name: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      },
      // sklad_id: {
      //   type: Sequelize.DataTypes.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model:'sklad',
      //     key: 'id',
      //   }
      // }
}, {
  sequelize,
  modelName: 'ProductModel',
  tableName: 'product',
  timestamps: false,
  paranoid: true,
});
ProductModel.belongsTo(unityModel, {as: 'unity', foreignKey: 'unity_id'});
ProductModel.belongsTo(product_categoryModel, {as: 'category', foreignKey: 'category_id'});
ProductModel.belongsTo(manufacturModel, {as: 'manufactur', foreignKey: 'manufactur_id'});
ProductModel.belongsTo(brendModel, {as: 'brand', foreignKey: 'brand_id'});
ProductModel.belongsTo(producmodelModel, {as: 'modelproduct', foreignKey: 'model_id'});
ProductModel.belongsTo(colorModel, {as: 'color', foreignKey: 'color_id'});
ProductModel.belongsTo(AdditionnameModel, {as: 'addition', foreignKey: 'addition_id'});
// ProductModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
ProductModel.hasOne(seriesModel, {as: 'series', foreignKey: 'product_id'});
ProductModel.hasMany(ProductRegisterModel, {as: 'product_register', foreignKey: 'product_id'});
module.exports = ProductModel;
