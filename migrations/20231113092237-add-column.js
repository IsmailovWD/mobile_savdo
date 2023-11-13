'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('refund', 'skidka_summa', {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        defaultValue: 0
      }, { transaction });

      await queryInterface.addColumn('product', 'minimum_amount', {
        type: Sequelize.DataTypes.DECIMAL(17,3),
        defaultValue: 1
      }, { transaction });

      await queryInterface.addColumn('kontragent', 'payment_date', {
        type: Sequelize.DataTypes.INTEGER
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
      await queryInterface.removeColumn('refund', 'skidka_summa', { transaction });

      // await queryInterface.removeColumn('product', 'minimum_amount', { transaction });

      // await queryInterface.removeColumn('kontragent', 'payment_date', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
