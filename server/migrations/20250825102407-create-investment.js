'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Investment", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0.00000001
        }
      },
      expected_roi: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false,
        validate: {
          min: 0
        }
      },
      actual_roi: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: true,
        validate: {
          min: 0
        }
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'pending'),
        defaultValue: 'pending',
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      payout_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      InvestmentPlanId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'InvestmentPlan',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
          fields: ['userId']
        },
        {
          fields: ['InvestmentPlanId']
        },
        {
          fields: ['status']
        },
        {
          fields: ['end_date']
        }
      ]
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Investment');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
