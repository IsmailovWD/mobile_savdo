'use strict';

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'unity', 
        [ 
          { 
            name: "Dona",
            edit: 0
          },
          { 
            name: "Kg",
            edit: 0
          },
          { 
            name: "Metr",
            edit: 0
          },
        ], 
        { transaction }
      );
      await queryInterface.bulkInsert(
        'manufactur', 
        [ 
          { 
            name: "O'zbekiston",
            edit: 0
          }
        ], 
        { transaction }
      );
      await queryInterface.bulkInsert(
        'color', 
        [ 
          { 
            name: "Oq",
            edit: 0
          },
          {
            name: 'Qora',
            edit: 0
          }
        ], 
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
