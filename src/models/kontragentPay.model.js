const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const KontragentModel = require('./kontragent.model');
const PayTypeModel = require('./payType.model');
const SkladModel = require('./sklad.model');
const UserModel = require('./user.model');
class KontragentPayModel extends Model {}

KontragentPayModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    datetime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    sklad_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kontragent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pay_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    summa: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    current_total: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    type: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.STRING(50),
    },
    dollar_rate: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 1
    },
    pay_type_kassa: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    kassa_summa: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 0
    },
    current_total_dollar: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 0
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
}, {
  sequelize, 
  modelName: 'KontragentPayModel',
  tableName: 'kontragent_pay',
  timestamps: false,
});
KontragentPayModel.belongsTo(KontragentModel, {as: 'kontragent', foreignKey: 'kontragent_id'});
KontragentPayModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
KontragentPayModel.belongsTo(PayTypeModel, {as: 'pay_type', foreignKey: 'pay_type_id'});
KontragentPayModel.belongsTo(UserModel, {as: 'user', foreignKey: 'user_id'});
module.exports = KontragentPayModel;