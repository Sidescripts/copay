const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Investment = sequelize.define('Investment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    planName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      validate: {
        min: 0.00000001
      }
    },
    expected_roi: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    actual_roi: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'completed'), // FIXED: Added 'pending'
      defaultValue: 'active',
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    payout_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    // ADDED: Missing foreign key fields
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // Should match your User table name
        key: 'id'
      }
    },
    InvestmentPlanId: {
      type: DataTypes.UUID, // or whatever type your InvestmentPlan uses
      allowNull: false,
      references: {
        model: 'investmentplans', // Should match your InvestmentPlan table name
        key: 'id'
      }
    }
  }, {
    tableName: 'investments', // FIXED: Single options object, plural table name
    timestamps: true,
    paranoid: true,
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

  // Fixed associations
  Investment.associate = function(models) {
    Investment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user' // FIXED: Changed to singular
    });

    Investment.belongsTo(models.InvestmentPlan, {
      foreignKey: 'InvestmentPlanId',
      as: 'investmentPlan' // FIXED: Changed to camelCase
    });
  };

  Investment.beforeValidate((investment) => {
    if (!investment.id) {
      investment.id = uuidv4();
    }
  });

  return Investment;
};