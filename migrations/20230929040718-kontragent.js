'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('kontragent', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: false,
          unique: true
        },
        phone_number: {
          type: Sequelize.DataTypes.STRING(15),
          allowNull: true
        },
        inn: {
          type: Sequelize.DataTypes.STRING(15),
          allowNull: true
        },
        mfo_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        okonx: {
          type: Sequelize.DataTypes.STRING(10),
          allowNull: true
        },
        address: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true
        },
        firma_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
        },
        sklad_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'sklad',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        comment: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true
        },
        deleted: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true
        },
        deleted_at: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
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
      await queryInterface.dropTable('kontragent', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
