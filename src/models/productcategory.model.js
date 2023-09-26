const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ProductcategoryModel extends Model {

}
ProductcategoryModel.init({
    id: { 
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    name : {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
    },
}, {
  sequelize,
  modelName: 'ProductcategoryModel',
  tableName: 'product_category',
  timestamps: false,
  paranoid: true,
});
module.exports = ProductcategoryModel;