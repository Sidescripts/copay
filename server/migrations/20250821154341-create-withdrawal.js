'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('withdrawals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(20, 8),
        allowNull: false
      },
      withdrawalMethod: {
        type: Sequelize.ENUM('BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH'),
        defaultValue: 'BTC',
        allowNull: false
      },
      transaction_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'completed', 'failed'),
        defaultValue: 'pending',
        allowNull: false
      },
      userId: {
        type: Sequelize.UUID, // Make sure this matches your User model's id type
        allowNull: false,
        references: {
          model: 'users', // This should match your users table name
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      processed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      completed_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Create indexes
    await queryInterface.addIndex('withdrawals', ['transaction_id'], {
      unique: true,
      name: 'withdrawal_transaction_id_unique'
    });

    await queryInterface.addIndex('withdrawals', ['userId'], {
      name: 'withdrawals_user_id_index'
    });

    await queryInterface.addIndex('withdrawals', ['withdrawalMethod'], {
      name: 'withdrawals_method_index'
    });

    await queryInterface.addIndex('withdrawals', ['status'], {
      name: 'withdrawals_status_index'
    });

    await queryInterface.addIndex('withdrawals', ['createdAt'], {
      name: 'withdrawals_created_at_index'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes first
    await queryInterface.removeIndex('withdrawals', 'withdrawals_transaction_id_unique');
    await queryInterface.removeIndex('withdrawals', 'withdrawals_user_id_index');
    await queryInterface.removeIndex('withdrawals', 'withdrawals_method_index');
    await queryInterface.removeIndex('withdrawals', 'withdrawals_status_index');
    await queryInterface.removeIndex('withdrawals', 'withdrawals_created_at_index');
    
    // Then drop the table
    await queryInterface.dropTable('withdrawals');

  }
};