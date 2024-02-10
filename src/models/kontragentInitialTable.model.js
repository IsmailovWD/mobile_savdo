const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const KontragentModel = require('./kontragent.model');
const PayTypeModel = require('./payType.model');
class KontragentInitialTableModel extends Model {}

KontragentInitialTableModel.init({
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    kontragent_initial_id: {
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
    type: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.STRING(50),
    },
}, {
  sequelize, 
  modelName: 'KontragentInitialTableModel',
  tableName: 'kontragent_initial_table',
  timestamps: false,
});
KontragentInitialTableModel.belongsTo(KontragentModel, {as: 'kontragent', foreignKey: 'kontragent_id'});
KontragentInitialTableModel.belongsTo(PayTypeModel, {as: 'pay_type', foreignKey: 'pay_type_id'});
module.exports = KontragentInitialTableModel;