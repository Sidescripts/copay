'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Admin", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 50],
          isAlphanumeric: true
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
      role: {
        type: Sequelize.ENUM('super_admin', 'admin', 'moderator'),
        defaultValue: 'admin',
        allowNull: false
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
    },{
      indexes: [
        {
          unique:true,
          fields: ['username','email']
        },
        {
          fields: ['role']
        },
        {
          fields: ['is_active']
        }
      ]
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Admin');
    /**
     * 
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
