'use strict';

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'valyuta', 
        [ 
          { 
            id: 1,
            name: "So'm"
          },
          { 
            id: 2,
            name: "Dollar"
          } 
        ], 
        { transaction }
      );
      
      // queryInterface.sequelize.query(
      //   'UPDATE valyuta SET id = 1 WHERE `name` = "So\'m"',
      //   {
      //     type: Sequelize.QueryTypes.UPDATE
      //   },
      //   { transaction }
      // );
      // queryInterface.sequelize.query(
      //   'UPDATE valyuta SET id = 2 WHERE name = `Dollar`',
      //   {
      //     type: Sequelize.QueryTypes.UPDATE
      //   },
      //   { transaction }
      // );

      // queryInterface.sequelize.query(
      //   'ALTER TABLE valyuta AUTO_INCREMENT = 1',
      //   {
      //     type: Sequelize.QueryTypes.UPDATE
      //   },
      //   { transaction }
      // );

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
