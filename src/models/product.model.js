const { Model } = require('sequelize');
const Sequelize = require('sequelize');
const sequelize = require('../db/db-sequelize');

class ProductModel extends Model {

}
ProductModel.init({
    id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.DataTypes.STRING(64),
        allowNull: false,
    },
    img: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
    },
    shtrix_code: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: false
    },
    min_amount: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: false
    },
    pack: {
        type: Sequelize.DataTypes.STRING(32),
        allowNull: false
    },
    unity_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'unity',
            key: 'id'
        }
    },
    category_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'product_category',
            key: 'id',
        }
    },
    manufactur_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'manufactur',
            key: 'id',
        }
    },
    brend_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'brend',
            key: 'id',
        }
    },
    model_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'model',
            key: 'id',
        }
    },
    color_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'color',
            key: 'id',
        }
    },
    addition_name: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: true
    }
}, {
  sequelize,
  modelName: 'ProductModel',
  tableName: 'product',
  timestamps: false,
  paranoid: true,
});
module.exports = ProductModel;