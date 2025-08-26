const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Deposit = sequelize.define('Deposit', {
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
        min: 200.00
      }
    },
    asset: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['BTC', 'ETH', 'USDT', 'LTC', 'BCH', 'BNB', 'DOGE', 'DASH']]
      }
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
      type: DataTypes.UUID, // or DataTypes.INTEGER if using integers
      allowNull: false,
      references: {
        model: 'users', // This should match your User model name
        key: 'id'
      }
    },
    processed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE, // Fixed casing to be consistent
      allowNull: true
    }
  }, {
    tableName: 'deposits', // Explicit table name
    freezeTableName: true,
    timestamps: true,
    paranoid: true, // Enables soft deletion
    indexes: [
      {
        unique: true,
        fields: ['transaction_id']
      },
      {
        fields: ['userId']
      },
      {
        fields: ['asset']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Associations (add this if you have relationships)
  Deposit.associate = function(models) {
    Deposit.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  // Generate UUID if not provided
  Deposit.beforeValidate((deposit) => {
    if (!deposit.id) {
      deposit.id = uuidv4();
    }
  });

  // Additional hooks if needed
  Deposit.beforeUpdate((deposit) => {
    if (deposit.changed('status') && deposit.status === 'completed') {
      deposit.completed_at = new Date();
    }
  });

  return Deposit;
};