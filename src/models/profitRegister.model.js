const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ProductModel = require('../models/product.model');
const SkladModel = require('../models/sklad.model');
class ProfitRegisterModel extends Model {}

ProfitRegisterModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    datetime: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    doc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sklad_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    series_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    count: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    body_price: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    buy_price: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    profit_price: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    profit_percent: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    doc_type: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    balance: {
        type: DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    total_body_price: {
        type: DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    total_buy_price: {
        type: DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    total_profit_price: {
        type: DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    total_profit_percent: {
        type: DataTypes.VIRTUAL,
        defaultValue : 0,
    }
}, {
  sequelize, 
  modelName: 'ProfitRegisterModel',
  tableName: 'profit_register',
  timestamps: false,
});
ProfitRegisterModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
ProfitRegisterModel.belongsTo(ProductModel, {as: 'product', foreignKey: 'product_id'});
module.exports = ProfitRegisterModel;