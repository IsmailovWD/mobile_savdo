const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

const ProductModel = require('./product.model');
const SeriesModel = require('../models/series.model');
const SkladModel = require('../models/sklad.model');

class ProductRegisterModel extends Model {}

ProductRegisterModel.init({
    id: { 
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    datetime: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    doc_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    sklad_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    series_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    count: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0,
    },
    type: {
        type: Sequelize.DataTypes.BOOLEAN,
    },
    doc_type: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false
    },
    comment: {
        type: Sequelize.DataTypes.STRING(50),
    },
    balance: {
        type: Sequelize.DataTypes.VIRTUAL,
        defaultValue: 0
    },
    balance_kirim: {
        type: Sequelize.DataTypes.VIRTUAL,
        defaultValue: 0
    },
    balance_chiqim: {
        type: Sequelize.DataTypes.VIRTUAL,
        defaultValue: 0
    },
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'ProductRegisterModel', // We need to choose the model name
  tableName: 'product_register',
  timestamps: false,
});

ProductRegisterModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
// ProductRegisterModel.belongsTo(ProductModel, {as: 'product', foreignKey: 'product_id'});
// ProductModel.hasMany(ProductRegisterModel, {as: 'product_register', foreignKey: 'product_id'});
ProductRegisterModel.belongsTo(SeriesModel, {as: 'series', foreignKey: 'series_id'});
SeriesModel.hasMany(ProductRegisterModel, {as: 'product_register', foreignKey: 'series_id'});

module.exports = ProductRegisterModel;