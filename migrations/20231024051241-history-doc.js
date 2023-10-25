'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('history_doc', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        datetime: {
          type: Sequelize.DataTypes.INTEGER,
        },
        sklad_id: {
          type: Sequelize.DataTypes.INTEGER,
        },
        user_id: {
          type: Sequelize.DataTypes.INTEGER,
        },
        doc_id: {
          type: Sequelize.DataTypes.INTEGER,
        },
        doc_type: {
          type: Sequelize.DataTypes.STRING(50),
        },
        action: {
          type: Sequelize.DataTypes.STRING(10),
        },
        data: {
          type: Sequelize.DataTypes.TEXT,
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
      await queryInterface.dropTable('history_doc', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
