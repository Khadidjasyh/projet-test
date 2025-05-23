const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require('fs');

// Création de la connexion à la base de données
const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Aaa!121212",
  database: process.env.DB_NAME || "mon_projet_db"
});

// Création de la table alert_files si elle n'existe pas
const createAlertFilesTable = `
CREATE TABLE IF NOT EXISTS alert_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE
)`;

// Exécuter la création de la table
(async () => {
  try {
    await connection.query(createAlertFilesTable);
    console.log('Table alert_files créée ou déjà existante');
  } catch (error) {
    console.error('Erreur lors de la création de la table alert_files:', error);
  }
})();

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite de 10MB
  }
});

// Route POST pour l'upload d'un fichier attaché à une alerte
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received:', req.body);
    console.log('File:', req.file);
    
    const { alertId } = req.body;
    const file = req.file;
    
    if (!file) {
      console.log('No file received');
      return res.status(400).json({ error: 'Aucun fichier envoyé' });
    }

    if (!alertId) {
      console.log('No alertId received');
      return res.status(400).json({ error: 'ID de l\'alerte manquant' });
    }

    console.log('Saving file to database:', {
      alertId,
      fileName: file.originalname,
      filePath: file.filename
    });

    // Enregistrer dans la base
    await connection.query(
      'INSERT INTO alert_files (alert_id, file_name, file_path) VALUES (?, ?, ?)',
      [alertId, file.originalname, file.filename]
    );

    console.log('File saved successfully');
    res.json({ message: 'Fichier uploadé', file: file.filename });
  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route GET pour récupérer les fichiers d'une alerte
router.get('/:alertId/files', async (req, res) => {
  try {
    const { alertId } = req.params;
    const [rows] = await connection.query(
      'SELECT id, file_name, file_path, uploaded_at FROM alert_files WHERE alert_id = ?',
      [alertId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Erreur SQL:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour mettre à jour le statut d'une alerte
router.put('/:alertId/status', async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Le statut est requis' });
    }

    // Vérifier si l'alerte existe
    const [alert] = await connection.query(
      'SELECT * FROM alerts WHERE id = ?',
      [alertId]
    );

    if (alert.length === 0) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }

    // Mettre à jour le statut
    await connection.query(
      'UPDATE alerts SET statut = ? WHERE id = ?',
      [status, alertId]
    );

    // Récupérer l'alerte mise à jour
    const [updatedAlert] = await connection.query(
      'SELECT * FROM alerts WHERE id = ?',
      [alertId]
    );

    res.json(updatedAlert[0]);
  } catch (err) {
    console.error('Erreur lors de la mise à jour du statut:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router; 