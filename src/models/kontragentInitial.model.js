const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const KontragentInitialTableModel = require('./kontragentInitialTable.model');
const SkladModel = require('./sklad.model');
const UserModel = require('./user.model');
class KontragentInitialModel extends Model {}

KontragentInitialModel.init({
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
    summa: {
        type: DataTypes.DECIMAL(17, 3),
        allowNull: false,
        defaultValue: 0,
    },
    dollar_rate: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 1
    },
    dollar_summa: {
        type: DataTypes.DECIMAL(17,3),
        defaultValue: 0
    },
    comment: {
        type: DataTypes.STRING(50)
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
}, {
  sequelize, 
  modelName: 'KontragentInitialModel',
  tableName: 'kontragent_initial',
  timestamps: false,
});
KontragentInitialModel.hasMany(KontragentInitialTableModel, {as: 'kontragent_initial_table', foreignKey: 'kontragent_initial_id'})
//KontragentInitialTableModel.hasOne(KontragentInitialModel, {as: 'kontragent_initial', foreignKey: 'id', sourceKey: 'kontragent_initial_id'})
KontragentInitialModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
KontragentInitialModel.belongsTo(UserModel, {as: 'user', foreignKey: 'user_id'});
module.exports = KontragentInitialModel;