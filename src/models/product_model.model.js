const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ProductmodelModel extends Model {

}
ProductmodelModel.init({
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
  modelName: 'ProductmodelModel',
  tableName: 'product_model',
  timestamps: false,
  paranoid: true,
});
module.exports = ProductmodelModel;