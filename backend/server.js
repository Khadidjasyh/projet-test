require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path"); 
// Configuration de la journalisation
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  logStream.write(logMessage);
};

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log('📁 Dossier de destination:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Garder le nom de fichier original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('🔍 Vérification du fichier:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // Vérifier les types de fichiers acceptés
    const allowedTypes = ['.xml', '.pdf', '.ir21'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      console.log('✅ Type de fichier accepté:', ext);
      cb(null, true);
    } else {
      console.error('❌ Type de fichier non supporté:', ext);
      cb(new Error('Format de fichier non supporté. Utilisez un fichier XML, PDF ou IR21.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
}); 
// External routes
const huaweiRoutes = require('./routes/huaweiRoutes');

const app = express();
const PORT = process.env.PORT || 5177;

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD || "isill3",
  database: "mon_projet_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL");
  }
});

// Nodemailer config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/ir21', async (req, res) => {
  try {
    // Utiliser connection au lieu de db
    connection.query('SELECT * FROM ir21_data', (err, results) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données IR21' });
      }
      console.log('Données IR21 envoyées:', results);
      res.json(results);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données IR21 :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// Route pour récupérer les données IR85
app.get('/ir85', async (req, res) => {
  try {
    // Utiliser connection au lieu de db
    connection.query('SELECT * FROM ir85_data', (err, results) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données IR85' });
      }
      console.log('Données IR85 envoyées:', results.length);
      res.json(results);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données IR85 :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
// Email Contact Form
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return res.status(400).json({ error: "L'adresse e-mail est invalide." });
  }

  const query = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  connection.query(query, [name, email, message], (error) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement." });
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "sayahkhadidja7@gmail.com",
      subject: "Nouveau message de contact",
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Erreur Nodemailer :", error);
        return res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
      }
      res.status(200).json({ message: "Message enregistré et e-mail envoyé avec succès." });
    });
  });
});

// Récupération des messages
app.get("/messages", (req, res) => {
  const query = "SELECT * FROM contacts ORDER BY created_at DESC";
  connection.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Erreur récupération messages." });
    res.status(200).json(results);
  });
});

// Roaming partners
app.get("/roaming-partners", (req, res) => {
  const query = "SELECT * FROM roaming_partners";
  connection.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Erreur récupération des partenaires." });
    res.status(200).json(results);
  });
});

// Situation globale
app.get('/situation-globale', (req, res) => {
  const query = "SELECT id, pays, operateur, plmn, gsm, camel, gprs, troisg, lte FROM situation_globales";
  connection.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: 'Erreur récupération des données' });
    res.json(results);
  });
});

// Network nodes
app.get("/network-nodes", (req, res) => {
  const query = "SELECT * FROM network_nodes ORDER BY node_type, node_name";
  connection.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: "Erreur récupération des nœuds réseau" });
    res.status(200).json(results);
  });
});

// MSS IMSI Analysis
app.get("/mss/imsi-analysis", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const node = req.query.node || '';

  let query = "SELECT * FROM mss_imsi_analysis";
  let countQuery = "SELECT COUNT(*) as total FROM mss_imsi_analysis";
  if (node) {
    query += " WHERE node_name = ?";
    countQuery += " WHERE node_name = ?";
  }
  query += " ORDER BY node_name, imsi_series LIMIT ? OFFSET ?";
  const queryParams = node ? [node, limit, offset] : [limit, offset];

  connection.query(countQuery, node ? [node] : [], (error, countResults) => {
    if (error) return res.status(500).json({ error: "Error counting IMSI records" });

    connection.query(query, queryParams, (error, results) => {
      if (error) return res.status(500).json({ error: "Error fetching IMSI data" });
      res.json({
        data: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit),
      });
    });
  });
});

// MSS B-Number Analysis
app.get('/mss/bnumber-analysis', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const node = req.query.node || '';

  let query = "SELECT node_name, b_number, miscell, f_n, route, charge, l_value as l, a_value, created_at FROM mss_bnumber_analysis";
  let countQuery = "SELECT COUNT(*) as total FROM mss_bnumber_analysis";
  if (node) {
    query += " WHERE node_name = ?";
    countQuery += " WHERE node_name = ?";
  }
  query += " ORDER BY node_name, b_number LIMIT ? OFFSET ?";
  const queryParams = node ? [node, limit, offset] : [limit, offset];

  connection.query(countQuery, node ? [node] : [], (error, countResults) => {
    if (error) return res.status(500).json({ error: "Error counting B-Number records" });

    connection.query(query, queryParams, (error, results) => {
      if (error) return res.status(500).json({ error: "Error fetching B-Number data" });
      res.json({
        data: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit),
      });
    });
  });
});

// MSS GT Series
app.get("/mss/gt-series", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const node = req.query.node || '';

  let query = "SELECT * FROM mss_gt_series";
  let countQuery = "SELECT COUNT(*) as total FROM mss_gt_series";
  if (node) {
    query += " WHERE node_name = ?";
    countQuery += " WHERE node_name = ?";
  }
  query += " ORDER BY node_name, tt LIMIT ? OFFSET ?";
  const queryParams = node ? [node, limit, offset] : [limit, offset];

  connection.query(countQuery, node ? [node] : [], (error, countResults) => {
    if (error) return res.status(500).json({ error: "Error counting GT Series records" });

    connection.query(query, queryParams, (error, results) => {
      if (error) return res.status(500).json({ error: "Error fetching GT Series data" });
      res.json({
        data: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit),
      });
    });
  });
});

// MSS unique node names
app.get('/mss/nodes', (req, res) => {
  const query = `
    SELECT DISTINCT node_name 
    FROM (
      SELECT node_name FROM mss_imsi_analysis
      UNION
      SELECT node_name FROM mss_bnumber_analysis
      UNION
      SELECT node_name FROM mss_gt_series
    ) AS combined_nodes
    ORDER BY node_name;
  `;

  connection.query(query, (error, results) => {
    if (error) return res.status(500).json({ error: 'Error fetching node names' });
    res.json(results.map(row => row.node_name));
  });
});

// Partie à modifier dans server.js
app.get('/api/firewall-ips', (req, res) => {
  try {
    connection.query(
      'SELECT identifiant, nom, cidr_complet FROM firewall_ips ORDER BY identifiant DESC',
      (error, results) => {
        if (error) {
          console.log('Erreur récupération firewall IPs:', error);
          return res.status(500).json({ error: error.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    console.log('Erreur récupération firewall IPs:', err);
    res.status(500).json({ error: err.message });
  }
});

// Test
app.get("/test", (req, res) => {
  res.json({ message: "Le serveur fonctionne correctement" });
});
// Add this to your existing server.js routes section
// Add this to your existing server.js routes section

// MME IMSI Analysis
app.get("/api/mme-imsi", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.search || '';

  let query = `
    SELECT * FROM mme_imsi_analysis 
    WHERE imsi LIKE ? OR misc_info1 LIKE ? 
    ORDER BY imsi 
    LIMIT ? OFFSET ?
  `;

  let countQuery = `
    SELECT COUNT(*) as total FROM mme_imsi_analysis 
    WHERE imsi LIKE ? OR misc_info1 LIKE ?
  `;

  const searchParam = `%${searchTerm}%`;
  const queryParams = [searchParam, searchParam, limit, offset];
  const countParams = [searchParam, searchParam];

  connection.query(countQuery, countParams, (error, countResults) => {
    if (error) return res.status(500).json({ error: "Error counting MME IMSI records" });

    connection.query(query, queryParams, (error, results) => {
      if (error) return res.status(500).json({ error: "Error fetching MME IMSI data" });
      res.json({
        data: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit),
      });
    });
  });
});
// Routes externes
app.use('/api/huawei', huaweiRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
