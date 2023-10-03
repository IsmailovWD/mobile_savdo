const { Model } = require('sequelize');
const Sequilize = require('sequelize');
const sequelize = require('../db/db-sequelize');
class PayTypeModel extends Model {}

PayTypeModel.init({
    id: { 
        type: Sequilize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    name : {
        type: Sequilize.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'PayTypeModel', // We need to choose the model name
  tableName: 'pay_type',
  timestamps: false,
});

module.exports = PayTypeModel;