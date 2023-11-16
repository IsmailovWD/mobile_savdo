const { DataTypes, Model } = require('sequelize');
const ProductModel = require('./product.model');
const sequelize = require('../db/db-sequelize');
class InitialBalanceTableModel extends Model {}

InitialBalanceTableModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  initial_balance_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  count: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  debit_price: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  chakana_percent: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  optom_percent: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  chakana_price: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  optom_price: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  chakana_summa: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  optom_summa: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  debit_summa: {
    type: DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0
  },
  shtrix_kod: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  chakana_dollar_price: {
    type: DataTypes.DECIMAL(17,3),
    defaultValue: 0
  },
  optom_dollar_price: {
      type: DataTypes.DECIMAL(17,3),
      defaultValue: 0
  },
  pack_count: {
    type: DataTypes.DECIMAL(12,3),
    allowNull: false,
    defaultValue: 0
  },
  pack_price: {
      type: DataTypes.DECIMAL(12,3),
      allowNull: false,
      defaultValue: 0
  },
  pack_norma: {
      type: DataTypes.DECIMAL(12,3),
      allowNull: false,
      defaultValue: 0
  },
}, {
  sequelize,
  tableName: 'initial_balance_table',
  modelName: 'InitialBalanceTableModel',
  timestamps: false,
});

InitialBalanceTableModel.belongsTo(ProductModel, {as: 'product', foreignKey: 'product_id'});

module.exports = InitialBalanceTableModel;