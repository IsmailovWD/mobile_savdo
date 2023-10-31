'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('product', 'addition_name', {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: true,
      });
      await queryInterface.removeColumn('product','addition_id');
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('addtion_name');
      await queryInterface.addColumn('product', 'addition_id', {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'addition_name',
            key: 'id',
          }
        })
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
