const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../db/db-sequelize');
class ValyutaModel extends Model {

}

ValyutaModel.init({
    id: { 
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    name : {
        type: Sequelize.DataTypes.STRING(25),
        allowNull: false,
        unique: true
    }
}, {
  sequelize: db,
  modelName: 'ValyutaModel',
  tableName: 'valyuta',
  timestamps: false,
  paranoid: true,
});

module.exports = ValyutaModel;