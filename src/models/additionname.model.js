const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class AdditionnameModel extends Model {

}
AdditionnameModel.init({
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
  modelName: 'AdditionnameModel',
  tableName: 'addition_name',
  timestamps: false,
  paranoid: true,
});
module.exports = AdditionnameModel;