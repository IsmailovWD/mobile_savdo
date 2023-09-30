'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('kontragent_register', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        datetime: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        },
        doc_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        },
        kontragent_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'kontragent',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        type: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true
        },
        summa: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        doc_type: {
          type: Sequelize.DataTypes.STRING(20),
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
        price_type: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1
        },
        dollar_rate: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 1.000
        },
        comment: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true
        }
      }, { transaction }
      );

      await queryInterface.addIndex(
        'kontragent_register',
        {
          name: 'idx-kontragent_register-datetime',
          fields: ['datetime'],
          transaction
        }
      );

      await queryInterface.addIndex(
        'kontragent_register',
        {
          name: 'idx-kontragent_register-doc',
          fields: ['doc_id', 'doc_type'],
          transaction
        }
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
      await queryInterface.removeIndex(
        'kontragent_register',
        'idx-kontragent_register-doc', 
        { transaction }
      );

      await queryInterface.removeIndex(
        'kontragent_register',
        'idx-kontragent_register-datetime', 
        { transaction }
      );

      await queryInterface.dropTable('kontragent_register', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
