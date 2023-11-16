'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('initial_balance', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        created_at: {
          type: Sequelize.Sequelize.DataTypes.INTEGER,
          allowNull: false,
          unique: true
        },
        updated_at: {
          type: Sequelize.Sequelize.DataTypes.INTEGER,
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
        summa: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        comment: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true
        },
        count_all: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        // number: {
        //   type: Sequelize.DataTypes.INTEGER,
        //   allowNull: true,
        //   unique: true
        // },
        dollar_rate: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 1.000
        },
        pay_type_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1
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
      await queryInterface.dropTable('initial_balance', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
