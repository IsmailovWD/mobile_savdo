const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');
const KontagentModel = require('./kontragent.model');

class KontragentRegisterModel extends Model {

}
KontragentRegisterModel.init({
    id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      datetime: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      doc_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      kontragent_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'kontragent',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      type: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true
      },
      summa: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
      },
      doc_type: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: true
      },
      sklad_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'sklad',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      price_type: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
      },
      dollar_rate: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 1.000
      },
      comment: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: true
      }
}, {
  sequelize,
  modelName: 'KontragentRegisterModel',
  tableName: 'kontragent_register',
  timestamps: false,
  paranoid: true,
});
KontragentRegisterModel.belongsTo(KontagentModel, {as: 'kontragent', foreignKey: 'kontragent_id'})
module.exports = KontragentRegisterModel;