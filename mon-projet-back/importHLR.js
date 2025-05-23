const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const multer = require('multer');
const express = require('express');
const router = express.Router();

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Aaa!121212",
  database: process.env.DB_NAME || "mon_projet_db"
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'HLR');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'hlr_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers .log sont acceptés'));
    }
  }
});

// Fonction pour parser le fichier HLR
async function parseHLRFile(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    const hlrData = [];

    for (const line of lines) {
      if (line.trim()) {
        // Supposons que le format est: TT NP NA NS GTRC
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          hlrData.push({
            tt: parts[0],
            np: parts[1],
            na: parts[2],
            ns: parts[3],
            gtrc: parts[4]
          });
        }
      }
    }

    return hlrData;
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error);
    throw error;
  }
}

// Route pour l'importation du fichier HLR
router.post('/api/upload-hlr', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Aucun fichier n\'a été uploadé' });
  }

  try {
    // Parser le fichier
    const hlrData = await parseHLRFile(req.file.path);

    // Connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);

    // Insérer les données dans la base
    for (const data of hlrData) {
      await connection.execute(
        'INSERT INTO hlr (tt, np, na, ns, gtrc) VALUES (?, ?, ?, ?, ?)',
        [data.tt, data.np, data.na, data.ns, data.gtrc]
      );
    }

    await connection.end();

    // Supprimer le fichier après import
    await fs.promises.unlink(req.file.path);

    res.json({
      success: true,
      message: `${hlrData.length} enregistrements HLR ont été importés avec succès`
    });
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'import du fichier HLR: ' + error.message
    });
  }
});

// Route pour récupérer les données HLR
router.get('/hlrr', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM hlr ORDER BY id DESC');
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des données HLR:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données HLR' });
  }
});

module.exports = router; 