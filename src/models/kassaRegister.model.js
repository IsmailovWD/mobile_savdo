const {  Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');
// const SkladModel = require('../models/sklad.model');
// const PayTypeModel = require('./payType.model');
class KassaRegisterModel extends Model {}

KassaRegisterModel.init({
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
    pay_type_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    sklad_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
    },
    comment : {
        type: Sequelize.DataTypes.STRING(50),
    },
    total:{
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
    }
}, {
  sequelize, 
  modelName: 'KassaRegisterModel',
  tableName: 'kassa_register',
  timestamps: false,
});
// KassaRegisterModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
// KassaRegisterModel.belongsTo(PayTypeModel, {as: 'pay_type', foreignKey: 'pay_type_id'});
module.exports = KassaRegisterModel;