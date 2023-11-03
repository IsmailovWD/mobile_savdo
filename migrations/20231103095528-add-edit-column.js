'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('unity','edit', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      });
      await queryInterface.addColumn('manufactur','edit', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      });
      await queryInterface.addColumn('color','edit', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      });
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('unity','edit');
      await queryInterface.removeColumn('manufactur','edit');
      await queryInterface.removeColumn('color','edit');
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
