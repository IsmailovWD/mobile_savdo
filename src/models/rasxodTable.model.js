const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

const ProductModel = require('./product.model');

class RasxodTableModel extends Model {
}
RasxodTableModel.init({
  id: {
    autoIncrement: true,
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  rasxod_id: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'rasxod',
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
  price: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  summa: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  },
  shtrix_kod: {
    type: Sequelize.DataTypes.STRING(20),
    allowNull: true
  },
  current_balance: {
    type: Sequelize.DataTypes.DECIMAL(17,3),
    allowNull: true,
    defaultValue: 0.000
  }
}, {
  sequelize,
  modelName: 'RasxodTableModel',
  tableName: 'rasxod_table',
  timestamps: false,
  paranoid: true,
});

RasxodTableModel.belongsTo(ProductModel, {as: 'product', foreignKey: 'product_id'});

module.exports = RasxodTableModel;