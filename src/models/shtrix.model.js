const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');
const ProductModel = require('./product.model');
class ShtrixModel extends Model {}

ShtrixModel.init({
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    product_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    shtrix_kod: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'ShtrixModel',
    tableName: 'shtrix',
    timestamps: false,
});
ProductModel.hasMany(ShtrixModel, { as: 'shtrix_tables', foreignKey: 'product_id' });
ShtrixModel.belongsTo(ProductModel, { as: 'product', foreignKey: 'product_id' })
module.exports = ShtrixModel;