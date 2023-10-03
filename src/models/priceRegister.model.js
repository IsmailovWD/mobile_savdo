const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');
class PriceRegisterModel extends Model {}

PriceRegisterModel.init({
    id: { 
        type: Sequelize.DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    datetime : {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    product_id : {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    series_id : {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    sklad_id : {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
    },
    chakana_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    optom_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    doc_id:{
        type: Sequelize.DataTypes.INTEGER,
    },
    body_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        allowNull: false,
        defaultValue: 0
    },
    doc_type: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false
    },
    price: {
        type: Sequelize.DataTypes.VIRTUAL,
        get: function(){
            return  {
                retail: parseFloat(this.get('chakana_price')),
                wholesale: parseFloat(this.get('optom_price')),
                body: parseFloat(this.get('body_price')),
                retail_dollar: parseFloat(this.get('chakana_dollar_price')),
                wholesale_dollar: parseFloat(this.get('optom_dollar_price'))
            }
        }
    },
    optom_dollar_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        defaultValue: 0,
    },
    chakana_dollar_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        defaultValue: 0,
    },
    delivery_price: {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        defaultValue: 0,
    },
    price_type: {
        type: Sequelize.DataTypes.INTEGER,
        defaultValue: 1,
    }
}, {
  sequelize,
  modelName: 'PriceRegisterModel',
  tableName: 'price_register',
  timestamps: false,
});

module.exports = PriceRegisterModel;