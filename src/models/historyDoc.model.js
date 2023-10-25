const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db/db-sequelize');
class HistoryDocModel extends Model {}

HistoryDocModel.init({
  id: {
    autoIncrement: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  datetime: {
    type: DataTypes.INTEGER,
  },
  sklad_id: {
    type: DataTypes.INTEGER,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  doc_id: {
    type: DataTypes.INTEGER,
  },
  doc_type: {
    type: DataTypes.STRING(50),
  },
  action: {
    type: DataTypes.STRING(10),
  },
  data: {
    type: DataTypes.TEXT,
  },
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'HistoryDocModel', // We need to choose the model name
  tableName: 'history_doc',
  timestamps: false
});

module.exports = HistoryDocModel;