const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const db = require('../db/db-sequelize');
class SkladModel extends Model {

}

SkladModel.init({
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
    },
    valyuta_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'valyuta',
            key: 'id'
        }
    },
    date1: {
        type: Sequelize.DataTypes.STRING(256),
        defaultValue: 0
    },
    date2: {
        type: Sequelize.DataTypes.STRING(256),
        defaultValue: 0
    },
    secret_id: {
        type: Sequelize.DataTypes.STRING(256),
        defaultValue: 0
    }
}, {
  sequelize: db,
  modelName: 'SkladModel',
  tableName: 'sklad',
  timestamps: false,
  paranoid: true,
});

module.exports = SkladModel;