const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const KontragentModel = require('./kontragent.model');
const PayTypeModel = require('./payType.model');
const RefundTableModel = require('./refundTable.model');
const SkladModel = require('./sklad.model');
const UserModel = require('./user.model');
class RefundModel extends Model {}

RefundModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    created_at: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    updated_at: {
        type: DataTypes.INTEGER,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sklad_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kontragent_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
    },
    price_type:{
        type: DataTypes.ENUM('optom', 'chakana'),
    },
    summa: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    comment : {
        type: DataTypes.STRING(50),
    },
    cash_summa: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    plastic_summa: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    count_all: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    number: {
        type: DataTypes.INTEGER,
        unique: true
    },
    dollar_rate: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 1
    },
    pay_type_id: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    dollar_summa: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 0
    },
    z_report: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    skidka_summa: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 0
    },
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'RefundModel', // We need to choose the model name
  tableName: 'refund',
  timestamps: false,
});

RefundModel.hasMany(RefundTableModel,{as: 'refund_table',foreignKey: 'refund_id' });
RefundModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
RefundModel.belongsTo(KontragentModel, {as: 'kontragent', foreignKey: 'kontragent_id'});
RefundModel.belongsTo(UserModel, {as: 'user', foreignKey: 'user_id'});
RefundModel.belongsTo(PayTypeModel, {as: 'pay_type', foreignKey: 'pay_type_id'});
module.exports = RefundModel;