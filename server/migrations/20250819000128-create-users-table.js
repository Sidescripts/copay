'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      fullname: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      username:{
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isAlphanumeric: true,
          len: [3, 50]
        }
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 255]
        }
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      homeAddress: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      zip: {
        type: Sequelize.STRING(20),
        allowNull: true,
        validate: {
          is: /^[a-z0-9\- ]+$/i
        }
      },
      phoneNum: {
        type: Sequelize.STRING(20),
        allowNull: true,
        validate: {
          is: /^\+?[\d\s\-]+$/i
        }
      },
      resetToken: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      resetTokenExpiry: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      walletBalance: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      totalRevenue: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      totalWithdrawal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      btcBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      ethBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      ltcBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      usdtBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      bchBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      dashBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      bnbBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      dogeBal: {
        type: Sequelize.DECIMAL(20, 8),
        defaultValue: 0.0,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  
    // Add indexes
    await queryInterface.addIndex('Users', ['email'], { unique: true });
    await queryInterface.addIndex('Users', ['username'], { unique: true });
    await queryInterface.addIndex('Users', ['country', 'state']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
    
  }
};
