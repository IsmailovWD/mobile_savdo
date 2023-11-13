const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ProductModel = require('./product.model');

class RefundTableModel extends Model {}

RefundTableModel.init({
    refund_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    count: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    current_balance: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    price: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    summa: {
        type: DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    shtrix_kod : {
        type: DataTypes.STRING(50),
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'RefundTableModel', // We need to choose the model name
  tableName: 'refund_table',
  timestamps: false,
});

RefundTableModel.belongsTo(ProductModel, {as: 'product', foreignKey: 'product_id'});

module.exports = RefundTableModel;