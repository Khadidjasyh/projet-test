const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Notification = sequelize.define('Notification', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  reportId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'audit_reports',
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
    defaultValue: 'unread'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'report_assignment'
  }
}, {
  timestamps: true,
  tableName: 'notifications'
});

module.exports = Notification; 