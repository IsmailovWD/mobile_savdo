const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class FirmaModel extends Model {

}
FirmaModel.init({
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
  modelName: 'FirmaModel',
  tableName: 'firma',
  timestamps: false,
  paranoid: true,
});
module.exports = FirmaModel;