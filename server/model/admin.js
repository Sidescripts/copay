const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Admin = sequelize.define('Admin', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50],
        isAlphanumeric: true
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
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'moderator'),
      defaultValue: 'admin',
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['username', 'email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['is_active']
      }
    ]
  });

  // Generate UUID if not provided
  Admin.beforeValidate((admin) => {
    if (!admin.id) {
      admin.id = uuidv4();
    }
  });

  return Admin;
};