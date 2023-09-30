'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('product', {
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
          allowNull: true
        },
        min_amount: {
          type: Sequelize.DataTypes.STRING(32),
          allowNull: true
        },
        pack: {
          type: Sequelize.DataTypes.STRING(32),
          allowNull: true
        },
        unity_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'unity',
            key: 'id'
          }
        },
        category_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'product_category',
            key: 'id',
          }
        },
        manufactur_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'manufactur',
            key: 'id',
          }
        },
        brand_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'brend',
            key: 'id',
          }
        },
        model_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'product_model',
            key: 'id',
          }
        },
        color_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'color',
            key: 'id',
          }
        },
        addition_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'addition_name',
            key: 'id',
          }
        },
        sklad_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model:'sklad',
            key: 'id',
          }
        }
      }, { transaction }
      );

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('product', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
