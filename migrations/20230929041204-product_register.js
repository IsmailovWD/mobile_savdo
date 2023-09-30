'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('product_register', {
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
        doc_type: {
          type: Sequelize.DataTypes.STRING(20),
          allowNull: false
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
        product_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'product',
            key: 'id'
          },
          onDelete: 'RESTRICT',
          onUpdate: 'CASCADE',
        },
        series_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'series',
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
        },
        count: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: false,
          defaultValue: 0.000
        },
        type: {
          type: Sequelize.DataTypes.BOOLEAN,
          allowNull: true
        },
        comment: {
          type: Sequelize.DataTypes.STRING(50),
          allowNull: true
        }
      }, { transaction }
      );

      await queryInterface.addIndex(
        'product_register',
        {
          name: 'idx-product_register-datetime',
          fields: ['datetime'],
          transaction
        }
      );

      await queryInterface.addIndex(
        'product_register',
        {
          name: 'idx-product_register-doc',
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
        'product_register',
        'idx-product_register-doc', 
        { transaction }
      );

      await queryInterface.removeIndex(
        'product_register',
        'idx-product_register-datetime', 
        { transaction }
      );

      await queryInterface.dropTable('product_register', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
