const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [8, 255]
      }
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    homeAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    zip: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[a-z0-9\- ]+$/i
      }
    },
    phoneNum: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^\+?[\d\s\-]+$/i
      }
    },
    resetToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    walletBalance: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    revenue: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    totalRevenue: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    totalWithdrawal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    btcBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    },
    ethBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    },
    ltcBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    },
    usdtBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    },
    bchBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    },
    dashBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    },
    bnbBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    },
    dogeBal: {
      type: DataTypes.DECIMAL(20, 8),
      defaultValue: 0.0,
      allowNull: false
    }
  }, {
    tableName: 'users', // FIXED: Single options object
    freezeTableName: true, // ADDED: Prevent automatic pluralization
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['username']
      },
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['country']
      },
      {
        fields: ['state']
      }
    ]
  });

  // FIXED: Single associate function with all relationships
  User.associate = function(models) {
    User.hasMany(models.Deposit, {
      foreignKey: 'userId',
      as: 'deposits'
    });

    User.hasMany(models.Withdrawal, {
      foreignKey: 'userId',
      as: 'withdrawals'
    });

    User.hasMany(models.Investment, {
      foreignKey: 'userId',
      as: 'investments' // FIXED: Changed to plural
    });
  };

  // Generate UUID if not provided
  User.beforeValidate((user) => {
    if (!user.id) {
      user.id = uuidv4();
    }
  });

  return User;
};