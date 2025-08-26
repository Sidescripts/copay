'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('InvestmentPlan', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      min_amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0.00000001
        }
      },
      max_amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0.00000001
        }
      },
      duration_days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1
        }
      },
      roi_percentage: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0.01
        }
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    }, {
      indexes: [
        {
          fields: ['is_active']
        }
      ]
    });  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('InvestmentPlan');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
