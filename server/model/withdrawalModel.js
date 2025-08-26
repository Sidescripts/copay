const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Withdrawal = sequelize.define('Withdrawal', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(20, 8),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 1000.00
      }
    },
    withdrawalMethod: {
      type: DataTypes.ENUM('BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH'),
      defaultValue: 'BTC',
      allowNull: false
      // Removed duplicate validation since ENUM already restricts values
    },
    transaction_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'failed'),
      defaultValue: 'pending',
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users', // FIXED: Changed to lowercase table name
        key: 'id'
      }
    },
    walletAddress: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'withdrawals',
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['transaction_id']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['withdrawalMethod']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Fixed association
  Withdrawal.associate = function(models) {
    Withdrawal.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user' // FIXED: Changed to singular for belongsTo
    });
  };

  // Generate UUID if not provided
  Withdrawal.beforeValidate((wth) => {
    if (!wth.id) {
      wth.id = uuidv4();
    }
  });

  // Additional hooks if needed
  Withdrawal.beforeUpdate((wth) => {
    if (wth.changed('status') && wth.status === 'completed') {
      wth.completed_at = new Date();
    }
  });

  return Withdrawal;
};