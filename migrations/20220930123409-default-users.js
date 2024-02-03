'use strict';

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert(
        'user', 
        [ 
          { 
            phone_number: '+998916544327',
            password: '$2a$08$YLZ7gtHc5KgiF3TlX/12r.boof4dIvGSoViUYxaRL8f7yHhKjPh0i', 
            fullname: 'Dasturchi',
            sklad_id: 1, 
            role: `Programmer`,
            deletedAt: null
          } 
        ], 
        { transaction }
      );

      await queryInterface.bulkInsert(
        'user', 
        [ 
          { 
            phone_number: '+998123456789',
            password: '$2a$08$YLZ7gtHc5KgiF3TlX/12r.boof4dIvGSoViUYxaRL8f7yHhKjPh0i', 
            fullname: 'Admin',  
            sklad_id: 1, 
            role: `Admin`,
            deletedAt: null
          } 
        ], 
        { transaction }
      );
      
      queryInterface.sequelize.query(
        'UPDATE user SET id = 0 WHERE id = 1',
        {
          type: Sequelize.QueryTypes.UPDATE
        },
        { transaction }
      );

      queryInterface.sequelize.query(
        'UPDATE user SET id = 1 WHERE id = 2',
        {
          type: Sequelize.QueryTypes.UPDATE
        },
        { transaction }
      );

      queryInterface.sequelize.query(
        'ALTER TABLE user AUTO_INCREMENT = 1',
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
