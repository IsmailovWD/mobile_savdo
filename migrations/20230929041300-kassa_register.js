'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('kassa_register', {
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
        pay_type_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
        },
        comment: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true
        }
      }, { transaction }
      );

      await queryInterface.addIndex(
        'kassa_register',
        {
          name: 'idx-kassa_register-datetime',
          fields: ['datetime'],
          transaction
        }
      );

      await queryInterface.addIndex(
        'kassa_register',
        {
          name: 'idx-kassa_register-doc',
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
        'kassa_register',
        'idx-kassa_register-doc', 
        { transaction }
      );

      await queryInterface.removeIndex(
        'kassa_register',
        'idx-kassa_register-datetime', 
        { transaction }
      );

      await queryInterface.dropTable('kassa_register', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
