'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'revenue', {
      type: Sequelize.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false,
      validate: {
        min: 0
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'revenue');
  }
};