const { DataTypes, Model } = require('sequelize');
const PayTypeModel = require('./payType.model');
const InitialBalanceTableModel = require('./initialBalanceTable.model');
const SkladModel = require('./sklad.model');
const sequelize = require('../db/db-sequelize');
const UserModel = require('./user.model');
class InitialBalanceModel extends Model {}

InitialBalanceModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  created_at: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  updated_at: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  sklad_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  summa: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  comment: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  count_all: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: false,
    defaultValue: 0
  },
  // number: {
  //   type: DataTypes.INTEGER,
  //   unique: true
  // },
  dollar_rate: {
    type: DataTypes.DECIMAL(17,3),
    defaultValue: 1
  },
  pay_type_id: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
}, {
  sequelize,
  tableName: 'initial_balance',
  modelName: 'InitialBalanceModel',
  timestamps: false,
});

InitialBalanceModel.hasMany(InitialBalanceTableModel,{as: 'initial_balance_table',foreignKey: 'initial_balance_id' });
InitialBalanceModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'});
InitialBalanceModel.belongsTo(UserModel, {as: 'user', foreignKey: 'user_id'});
InitialBalanceModel.belongsTo(PayTypeModel, {as: 'pay_type', foreignKey: 'pay_type_id'});

module.exports = InitialBalanceModel;