const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const InvestmentPlan = sequelize.define('InvestmentPlan', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    min_amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      validate: {
        min: 0.00000001
      }
    },
    max_amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      validate: {
        min: 0.00000001
      }
    },
    duration_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    roi_percentage: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'investmentplans', // FIXED: Single options object, plural table name
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['is_active']
      },
      {
        fields: ['name'] // Added index for name if you'll search by it
      }
    ]
  });

  // Fixed association
  InvestmentPlan.associate = function(models) {
    InvestmentPlan.hasMany(models.Investment, {
      foreignKey: 'InvestmentPlanId',
      as: 'investments' // FIXED: Changed to plural for hasMany
    });
  };

  InvestmentPlan.beforeValidate((plan) => {
    if (!plan.id) {
      plan.id = uuidv4();
    }
  });

  return InvestmentPlan;
};