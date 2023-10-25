'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('rasxod_table', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        rasxod_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'rasxod',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
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
        count: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        summa: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        shtrix_kod: {
          type: Sequelize.DataTypes.STRING(20),
          allowNull: true
        },
        current_balance: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
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
      await queryInterface.dropTable('rasxod_table', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
