const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');
const FirmaModel = require('./firma.model')
const skladModel = require('./sklad.model');

class kontragentModel extends Model {

}
kontragentModel.init({
    id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    phone_number: {
        type: Sequelize.DataTypes.STRING(15),
        allowNull: true
    },
    inn: {
        type: Sequelize.DataTypes.STRING(15),
        allowNull: true
    },
    mfo_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    },
    okonx: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: true
    },
    address: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: true
    },
    firma_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    },
    // sklad_id: {
    //     type: Sequelize.DataTypes.INTEGER,
    //     allowNull: true,
    //     references: {
    //       model: 'sklad',
    //       key: 'id'
    //     },
    //     onDelete: 'RESTRICT',
    //     onUpdate: 'CASCADE',
    // },
      comment: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: true
      },
      deleted: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true
      },
      deleted_at: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
      },
}, {
  sequelize,
  modelName: 'kontragentModel',
  tableName: 'kontragent',
  timestamps: false,
  paranoid: true,
});
// kontragentModel.hasMany(KontragentRegisterModel, {as: 'kontragent_register', foreignKey: 'kontragent.id'})
kontragentModel.belongsTo(FirmaModel, {as: 'firma', foreignKey: 'firma_id'})
// kontragentModel.belongsTo(skladModel, {as: 'sklad', foreignKey: 'sklad_id'})

module.exports = kontragentModel;