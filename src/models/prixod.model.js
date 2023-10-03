const { Model } = require('sequelize')
const Sequelize = require('sequelize')
const sequelize = require('../db/db-sequelize')

//models
const SkladModel = require('./sklad.model')
const KontragentModel = require('./kontragent.model')
const PayTypeModel = require('./payType.model')
const UserModel = require('./user.model')

class PrixodModel extends Model {}

PrixodModel.init({
    id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true
      },
      updated_at: {
        type: Sequelize.DataTypes.INTEGER,
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
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },
      pay_type_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pay_type',
          key: 'id'
        }
      },
      rasxod_summa: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
      },
      skidka_summa: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
      },
      summa: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
      },
      debit_summa: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
      },
      count_all: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
      },
      comment: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: true
      },
      number: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        unique: true
      },
      dollar_rate: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 1.000
      },
      prixod_summa: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
      }
},{
    sequelize,
    modelName: 'PrixodModel',
    tableName: 'prixod',
    timestamps: false,
    paranoid: true,
})
PrixodModel.belongsTo(SkladModel, {as: 'sklad', foreignKey: 'sklad_id'})
PrixodModel.belongsTo(KontragentModel, {as: 'kontragent', foreignKey: 'kontragent_id'})
PrixodModel.belongsTo(PayTypeModel, {as: 'pay_type', foreignKey: 'pay_type_id'})
PrixodModel.belongsTo(UserModel, {as: 'user', foreignKey: 'user_id'})
module.exports = PrixodModel;