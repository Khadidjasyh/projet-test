const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UserReport = sequelize.define('UserReport', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'nouveau'
  }
}, {
  timestamps: true
});

module.exports = UserReport; 