'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('sklad', 'date1', {
        type: Sequelize.DataTypes.STRING(256),
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn('sklad', 'date2', {
        type: Sequelize.DataTypes.STRING(256),
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn('sklad', 'secret_id', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false,
      }, { transaction });

      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('sklad', 'date1', { transaction });

      await queryInterface.removeColumn('sklad', 'date2', { transaction });

      await queryInterface.removeColumn('sklad', 'secret_id', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
