const express = require('express');
const router = express.Router();
const { AuditReport } = require('../models'); // Assurez-vous que le modèle est correctement importé
const PDFDocument = require('pdfkit');

// Récupérer tous les rapports
router.get('/audit-reports', async (req, res) => {
  try {
    const reports = await AuditReport.findAll({ order: [['date', 'DESC'], ['time', 'DESC']] });
    res.json(reports);
  } catch (error) {
    console.error('Erreur lors de la récupération des rapports:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des rapports' });
  }
});

// Récupérer un rapport spécifique
router.get('/audit-reports/:id', async (req, res) => {
  try {
    const report = await AuditReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }
    res.json(report);
  } catch (error) {
    console.error('Erreur lors de la récupération du rapport:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du rapport' });
  }
});

// Créer un nouveau rapport
router.post('/audit-reports', async (req, res) => {
  try {
    const {
      id,
      test_id,
      title,
      date,
      time,
      status,
      created_by,
      validated_by,
      total_operators,
      total_issues,
      camel_issues,
      gprs_issues,
      threeg_issues,
      lte_issues,
      results_data,
      solutions,
      attachments,
      validation_notes,
      implemented_changes
    } = req.body;

    const newReport = await AuditReport.create({
      id,
      test_id,
      title,
      date,
      time,
      status: status || 'En cours',
      created_by,
      validated_by,
      total_operators,
      total_issues,
      camel_issues,
      gprs_issues,
      threeg_issues,
      lte_issues,
      results_data,
      solutions,
      attachments,
      validation_notes,
      implemented_changes
    });

    res.status(201).json(newReport);
  } catch (error) {
    console.error('Erreur lors de la création du rapport:', error);
    res.status(500).json({ error: 'Erreur lors de la création du rapport' });
  }
});

// Mettre à jour un rapport
router.put('/audit-reports/:id', async (req, res) => {
  try {
    const {
      test_id,
      title,
      date,
      time,
      status,
      created_by,
      validated_by,
      critical_issues,
      major_issues,
      minor_issues,
      results_data,
      solutions,
      attachments
    } = req.body;

    const report = await AuditReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }

    report.test_id = test_id;
    report.title = title;
    report.date = date;
    report.time = time;
    report.status = status;
    report.created_by = created_by;
    report.validated_by = validated_by;
    report.critical_issues = critical_issues;
    report.major_issues = major_issues;
    report.minor_issues = minor_issues;
    report.results_data = results_data;
    report.solutions = solutions;
    report.attachments = attachments;

    await report.save();

    res.json(report);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rapport:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du rapport' });
  }
});

// Supprimer un rapport
router.delete('/audit-reports/:id', async (req, res) => {
  try {
    const report = await AuditReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }
    await report.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du rapport:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du rapport' });
  }
});

// Valider un rapport
router.put('/audit-reports/:id/validate', async (req, res) => {
  try {
    const { validated_by, status } = req.body;
    const report = await AuditReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }
    report.status = status;
    report.validated_by = validated_by;
    await report.save();
    res.json(report);
  } catch (error) {
    console.error('Erreur lors de la validation du rapport:', error);
    res.status(500).json({ error: 'Erreur lors de la validation du rapport' });
  }
});

// Télécharger un rapport en PDF
router.get('/audit-reports/:id/download', async (req, res) => {
  try {
    const report = await AuditReport.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ error: 'Rapport non trouvé' });
    }

    const doc = new PDFDocument();

    // Configuration du PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=rapport_${report.id}.pdf`);
    doc.pipe(res);

    // En-tête du rapport
    doc.fontSize(20).text('Rapport d\'Audit', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Titre: ${report.title}`);
    doc.text(`Date: ${report.date}`);
    doc.text(`Heure: ${report.time}`);
    doc.text(`Statut: ${report.status}`);
    doc.moveDown();

    // Statistiques
    doc.fontSize(14).text('Statistiques', { underline: true });
    doc.fontSize(12)
      .text(`Total des opérateurs: ${report.total_operators}`)
      .text(`Total des problèmes: ${report.total_issues}`)
      .text(`Problèmes CAMEL: ${report.camel_issues}`)
      .text(`Problèmes GPRS: ${report.gprs_issues}`)
      .text(`Problèmes 3G: ${report.threeg_issues}`)
      .text(`Problèmes LTE: ${report.lte_issues}`);
    doc.moveDown();

    // Résultats détaillés
    doc.fontSize(14).text('Résultats détaillés', { underline: true });
    const results = report.results_data;
    results.forEach(operator => {
      doc.fontSize(12)
        .text(`Pays: ${operator.country}`)
        .text(`Opérateur: ${operator.operator}`)
        .text(`PLMN: ${operator.plmn}`);
      if (operator.issues.length > 0) {
        doc.text('Problèmes:');
        operator.issues.forEach(issue => {
          doc.text(`- ${issue}`, { indent: 20 });
        });
      }
      doc.moveDown();
    });

    // Solutions proposées
    if (report.solutions && report.solutions.length > 0) {
      doc.fontSize(14).text('Solutions proposées', { underline: true });
      report.solutions.forEach(solution => {
        doc.fontSize(12).text(`- ${solution}`, { indent: 20 });
      });
      doc.moveDown();
    }

    // Notes de validation
    if (report.validation_notes) {
      doc.fontSize(14).text('Notes de validation', { underline: true });
      doc.fontSize(12).text(report.validation_notes);
      doc.moveDown();
    }

    // Changements implémentés
    if (report.implemented_changes) {
      doc.fontSize(14).text('Changements implémentés', { underline: true });
      doc.fontSize(12).text(report.implemented_changes);
    }

    // Finalisation du PDF
    doc.end();
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' });
  }
});

module.exports = router; 