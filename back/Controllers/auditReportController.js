const AuditReport = require('../models/AuditReport');
const User = require('../models/User');
const notificationController = require('./notificationController');

// Assigner des utilisateurs à un rapport
const assignUsersToReport = async (reportId, userIds) => {
  try {
    const report = await AuditReport.findByPk(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Mettre à jour les utilisateurs assignés
    report.assignedUsers = userIds;
    await report.save();

    // Créer des notifications pour chaque utilisateur assigné
    const users = await User.findAll({
      where: {
        id: userIds
      }
    });

    for (const user of users) {
      await notificationController.createNotification(
        user.id,
        reportId,
        `Vous avez été assigné au rapport "${report.title}"`
      );
    }

    return report;
  } catch (error) {
    console.error('Error assigning users to report:', error);
    throw error;
  }
};

// Obtenir tous les rapports
const getAllReports = async () => {
  try {
    const reports = await AuditReport.findAll({
      order: [['createdAt', 'DESC']]
    });
    return reports;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

// Obtenir un rapport par ID
const getReportById = async (reportId) => {
  try {
    const report = await AuditReport.findByPk(reportId);
    return report;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

// Créer un nouveau rapport
const createReport = async (reportData) => {
  try {
    const report = await AuditReport.create(reportData);
    return report;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

// Mettre à jour un rapport
const updateReport = async (reportId, updateData) => {
  try {
    const report = await AuditReport.findByPk(reportId);
    if (!report) {
      throw new Error('Report not found');
    }
    await report.update(updateData);
    return report;
  } catch (error) {
    console.error('Error updating report:', error);
    throw error;
  }
};

// Supprimer un rapport
const deleteReport = async (reportId) => {
  try {
    const report = await AuditReport.findByPk(reportId);
    if (!report) {
      throw new Error('Report not found');
    }
    await report.destroy();
    return true;
  } catch (error) {
    console.error('Error deleting report:', error);
    throw error;
  }
};

module.exports = {
  assignUsersToReport,
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  deleteReport
}; 