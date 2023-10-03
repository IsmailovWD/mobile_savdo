const { Model } = require('sequelize');
const Sequelize= require('sequelize');
const sequelize = require('../db/db-sequelize');
// const KontragentModel = require('../models/kontragent.model');
// const PayTypeModel = require('./payType.model');
class KontragentRegisterModel extends Model {}

KontragentRegisterModel.init({
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
    kontragent_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    sklad_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    summa: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
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
    total:{
        type: Sequelize.DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    total_dollar:{
        type: Sequelize.DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    total_kirim:{
        type: Sequelize.DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    total_chiqim:{
        type: Sequelize.DataTypes.VIRTUAL,
        defaultValue : 0,
    },
    price_type: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue : 1,
    },
    dollar_rate: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        defaultValue: 1
    },
}, {
  sequelize, 
  modelName: 'KontragentRegisterModel',
  tableName: 'kontragent_register',
  timestamps: false,
});
//KontragentRegisterModel.belongsTo(KontragentModel, {as: 'kontragent', foreignKey: 'kontragent_id'});
// KontragentModel.hasMany(KontragentRegisterModel, {as: 'kontragent_register', foreignKey: 'kontragent_id'});
// KontragentRegisterModel.belongsTo(PayTypeModel, {as: 'pay_type', foreignKey: 'price_type'});

module.exports = KontragentRegisterModel;