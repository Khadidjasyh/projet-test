const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const AuditReport = sequelize.define('AuditReport', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true
  },
  test_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('En cours', 'Validé', 'Rejeté'),
    allowNull: true,
    defaultValue: 'En cours'
  },
  created_by: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  validated_by: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  total_operators: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  total_issues: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  camel_issues: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  gprs_issues: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  threeg_issues: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  lte_issues: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  results_data: {
    type: DataTypes.JSON,
    allowNull: true
  },
  solutions: {
    type: DataTypes.JSON,
    allowNull: true
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true
  },
  validation_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  implemented_changes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'audit_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = AuditReport; 