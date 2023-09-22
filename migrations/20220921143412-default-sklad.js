'use strict';

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'sklad', 
        [ 
          { 
            name: 'Asosiy sklad'
          } 
        ], 
        { transaction }
      );
      
      queryInterface.sequelize.query(
        'UPDATE sklad SET id = 0 WHERE id = 1',
        {
          type: Sequelize.QueryTypes.UPDATE
        },
        { transaction }
      );

      queryInterface.sequelize.query(
        'ALTER TABLE sklad AUTO_INCREMENT = 0',
        {
          type: Sequelize.QueryTypes.UPDATE
        },
        { transaction }
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
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
