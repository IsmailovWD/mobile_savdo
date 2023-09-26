const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ColorModel extends Model {

}
ColorModel.init({
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
  modelName: 'ColorModel',
  tableName: 'color',
  timestamps: false,
  paranoid: true,
});
module.exports = ColorModel;