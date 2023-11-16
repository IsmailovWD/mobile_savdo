'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('initial_balance_table', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        initial_balance_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'initial_balance',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        product_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'product',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE'
        },
        count: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        debit_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        chakana_percent: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        optom_percent: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        chakana_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        optom_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        chakana_summa: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        optom_summa: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        shtrix_kod: {
          type: Sequelize.DataTypes.STRING(20),
          allowNull: true
        },
        debit_summa: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
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
      await queryInterface.dropTable('initial_balance_table', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
