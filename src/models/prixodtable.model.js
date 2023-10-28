const { Model } = require('sequelize')
const Sequelize = require('sequelize')
const sequelize = require('../db/db-sequelize')
const ProductModel = require('./product.model')

class PrixodtableModel extends Model {}

PrixodtableModel.init({
  id: {
    autoIncrement: true,
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  prixod_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'prixod',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  product_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'product',
      key: 'id'
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  },
  count: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  debit_price: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  debit_summa: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  chakana_price: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  chakana_percent: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  optom_price: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  optom_percent: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  chakana_summa: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  optom_summa: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  kontragent_price: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  kontragent_summa: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  current_balance: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  shtrix_kod: {
    type: Sequelize.DataTypes.STRING(20),
    allowNull: true
  },
  chakana_dollar_price: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  optom_dollar_price: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  }
},{
    sequelize,
    modelName: 'PrixodtableModel',
    tableName: 'prixod_table',
    timestamps: false,
    paranoid: true,
})
PrixodtableModel.belongsTo(ProductModel, {as: 'product', foreignKey: 'product_id'})
module.exports = PrixodtableModel;