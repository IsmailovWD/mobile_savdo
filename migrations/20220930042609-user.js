'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('user', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        phone_number: {
          type: Sequelize.DataTypes.STRING(25),
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.DataTypes.STRING(60),
          allowNull: false
        },
        fullname: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: false
        },
        role: {
          type: Sequelize.DataTypes.ENUM('Admin', 'User', 'Programmer', 'Hodim'),
          allowNull: true,
          defaultValue: 'Admin'
        },
        sklad_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'sklad',
            key: 'id'
          }
        },
        loginAt: {
          type: Sequelize.DataTypes.STRING(20)
        },
        createdAt: {
          type: Sequelize.DataTypes.DATE
        },
        updatedAt: {
          type: Sequelize.DataTypes.DATE
        },
        deletedAt: {
          type: Sequelize.DataTypes.DATE,
        },
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
      await queryInterface.dropTable('user', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
