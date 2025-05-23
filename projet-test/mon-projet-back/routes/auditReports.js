const express = require('express');
const router = express.Router();

// Assigner des utilisateurs à un rapport
router.post('/:reportId/assign-users', async (req, res) => {
  try {
    const { userIds } = req.body;
    const report = await auditReportController.assignUsersToReport(req.params.reportId, userIds);
    res.json(report);
  } catch (error) {
    console.error('Error assigning users to report:', error);
    res.status(500).json({ error: 'Failed to assign users to report' });
  }
});

// Obtenir tous les rapports
router.get('/', async (req, res) => {
  try {
    const reports = await auditReportController.getAllReports();
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Obtenir un rapport par ID
router.get('/:reportId', async (req, res) => {
  try {
    const report = await auditReportController.getReportById(req.params.reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Créer un nouveau rapport
router.post('/', async (req, res) => {
  try {
    const report = await auditReportController.createReport(req.body);
    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

// Mettre à jour un rapport
router.put('/:reportId', async (req, res) => {
  try {
    const report = await auditReportController.updateReport(req.params.reportId, req.body);
    res.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// Supprimer un rapport
router.delete('/:reportId', async (req, res) => {
  try {
    await auditReportController.deleteReport(req.params.reportId);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

module.exports = router; 