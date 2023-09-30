const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class SeriesModel extends Model {

}
SeriesModel.init({
    id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    datetime: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true
    },
    product_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'product',
            key: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
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
    delivery_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true
    },
    prixod_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true
    },
    optom_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true
    },
    chakana_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true
    },
    doc_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    doc_type: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false
    },
    chakana_dollar_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
    },
    optom_dollar_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: true,
        defaultValue: 0.000
    },
    price_type: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    }
}, {
  sequelize,
  modelName: 'SeriesModel',
  tableName: 'series',
  timestamps: false,
  paranoid: true,
});
module.exports = SeriesModel;