const express = require('express');
const router = express.Router();
const db = require('../config/db.config');

// Route pour les statistiques du dashboard
router.get('/dashboard/stats', async (req, res) => {
    try {
        const [stats] = await db.query('SELECT * FROM dashboard_stats ORDER BY id DESC LIMIT 1');
        res.json(stats[0] || {
            total_audits: 0,
            errors_detected: 0,
            partners_connected: 0,
            pending_tasks: 0
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des statistiques' });
    }
});

// Route pour les événements roaming
router.get('/roaming-events', async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM roaming_events ORDER BY timestamp DESC');
        res.json(events);
    } catch (error) {
        console.error('Error fetching roaming events:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
});

// Route pour les alertes critiques
router.get('/critical-alerts', async (req, res) => {
    try {
        const [alerts] = await db.query('SELECT * FROM critical_alerts WHERE status = "active" ORDER BY created_at DESC');
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching critical alerts:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des alertes' });
    }
});

// Route pour les audits
router.get('/audits', async (req, res) => {
    try {
        const [audits] = await db.query('SELECT * FROM audits ORDER BY date DESC');
        res.json(audits);
    } catch (error) {
        console.error('Error fetching audits:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des audits' });
    }
});

// Route pour la couverture roaming
router.get('/roaming-coverage', async (req, res) => {
    try {
        const [coverage] = await db.query('SELECT * FROM roaming_coverage ORDER BY id DESC LIMIT 1');
        res.json(coverage[0] || {
            total_operators: 0,
            total_countries: 0,
            network_availability: 0
        });
    } catch (error) {
        console.error('Error fetching roaming coverage:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données de couverture' });
    }
});

// Route pour les partenaires roaming
router.get('/roaming-partners', async (req, res) => {
    try {
        const [partners] = await db.query('SELECT * FROM roaming_partners ORDER BY operateur');
        res.json(partners);
    } catch (error) {
        console.error('Error fetching roaming partners:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des partenaires' });
    }
});

// Route pour les IPs du firewall
router.get('/api/firewall-ips', async (req, res) => {
    try {
        const [ips] = await db.query('SELECT * FROM firewall_ips ORDER BY created_at DESC');
        res.json(ips);
    } catch (error) {
        console.error('Error fetching firewall IPs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des IPs du firewall' });
    }
});

module.exports = router; 