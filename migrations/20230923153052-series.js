'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('series', {
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        datetime: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true
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
        delivery_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true
        },
        prixod_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true
        },
        optom_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true
        },
        chakana_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true
        },
        doc_id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0
        },
        doc_type: {
          type: Sequelize.DataTypes.STRING(20),
          allowNull: false
        },
        chakana_dollar_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        optom_dollar_price: {
          type: Sequelize.DataTypes.DECIMAL(17,3),
          allowNull: true,
          defaultValue: 0.000
        },
        price_type: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1
        }
      }, { transaction }
      );

      await queryInterface.addIndex(
        'series',
        {
          name: 'idx-series-doc',
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
        'series',
        'idx-series-doc', 
        { transaction }
      );

      await queryInterface.dropTable('series', { transaction });
      
      transaction.commit();
    } catch (errors) {
      transaction.rollback();
      throw errors;
    }
  }
};
