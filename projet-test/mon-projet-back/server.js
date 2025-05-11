require('dotenv').config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); 

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");

// Initialisation de l'application Express
const app = express();
const PORT = 5178;

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

// Connexion à MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "mon_projet_db"
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL");
  }
});

// Configuration de Nodemailer pour Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Utilisation de la variable d'environnement
    pass: process.env.GMAIL_PASSWORD, // Utilisation de la variable d'environnement
  },
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: '*', // Permettre toutes les origines pendant le développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Fonction de validation d'e-mail
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Route pour gérer l'envoi du formulaire
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Validation des données
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "L'adresse e-mail est invalide." });
  }

  // Enregistrer le message dans MySQL
  const query = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  connection.query(query, [name, email, message], (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement du message dans la base de données." });
    }

    console.log("Message enregistré avec succès dans MySQL");

    // Envoyer un e-mail via Gmail
    const mailOptions = {
      from: process.env.GMAIL_USER, // Utilisation de la variable d'environnement
      to: "sayahkhadidja7@gmail.com", // Destinataire de l'e-mail
      subject: "Nouveau message de contact",
      text: `
        Nom: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur Nodemailer :", error);
        return res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
      }
      console.log("E-mail envoyé :", info.response);
      res.status(200).json({ message: "Message enregistré et e-mail envoyé avec succès." });
    });
  });
});

// Route pour récupérer tous les messages (optionnel)
app.get("/messages", (req, res) => {
  const query = "SELECT * FROM contacts ORDER BY created_at DESC";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des messages." });
    }
    res.status(200).json(results);
  });
});

// Route de test
app.get("/test", (req, res) => {
  console.log("Route /test appelée");
  res.json({ message: "Le serveur fonctionne correctement" });
});

// Route pour récupérer les partenaires roaming
app.get("/roaming-partners", (req, res) => {
  console.log("Route /roaming-partners appelée");
  
  // Vérifier si la connexion est active
  if (!connection) {
    console.error("❌ La connexion MySQL n'est pas initialisée");
    return res.status(500).json({ 
      error: "Erreur de connexion à la base de données",
      details: "La connexion MySQL n'est pas initialisée"
    });
  }

  const query = "SELECT id, imsi_prefix, gt, operateur, mcc, mnc, country, bilateral FROM roaming_partners WHERE imsi_prefix IS NOT NULL AND gt IS NOT NULL AND operateur IS NOT NULL ORDER BY id";
  console.log("Exécution de la requête SQL:", query);
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL:", error);
      return res.status(500).json({ 
        error: "Erreur lors de la récupération des partenaires",
        details: error.message
      });
    }

    console.log(`✅ Nombre de partenaires trouvés: ${results.length}`);
    if (results.length > 0) {
      console.log("Premier partenaire:", results[0]);
    }
    res.status(200).json(results);
  });
});

// Endpoint pour récupérer les données de la situation globale
app.get('/situation-globale', (req, res) => {
  const query = `
    SELECT 
      id,
      pays,
      operateur,
      plmn,
      gsm,
      camel,
      gprs,
      troisg,
      lte
    FROM situation_globales
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
    res.json(results);
  });
});

// Route pour récupérer les nœuds réseau
app.get("/network-nodes", (req, res) => {
  console.log("Route /network-nodes appelée");
  
  // Vérifier si la connexion est active
  if (!connection) {
    console.error("❌ La connexion MySQL n'est pas initialisée");
    return res.status(500).json({ 
      error: "Erreur de connexion à la base de données",
      details: "La connexion MySQL n'est pas initialisée"
    });
  }

  const query = "SELECT * FROM network_nodes ORDER BY node_type, node_name";
  console.log("Exécution de la requête SQL:", query);
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL:", error);
      return res.status(500).json({ 
        error: "Erreur lors de la récupération des nœuds réseau",
        details: error.message
      });
    }

    console.log(`✅ Nombre de nœuds trouvés: ${results.length}`);
    if (results.length > 0) {
      console.log("Premier nœud:", results[0]);
    }
    res.status(200).json(results);
  });
});

// Route pour récupérer les réseaux mobiles
app.get("/mobile-networks", (req, res) => {
  console.log("Route /mobile-networks appelée");
  const query = "SELECT * FROM mobile_network";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des réseaux mobiles." });
    }
    console.log(`Nombre de réseaux trouvés : ${results.length}`);
    if (results.length > 0) {
      console.log("Premier réseau :", results[0]);
    }
    res.status(200).json(results);
  });
});

// Routes for MSS data
app.get("/mss/nodes", (req, res) => {
  const query = "SELECT DISTINCT node_name FROM mss_imsi_analysis ORDER BY node_name";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des nœuds:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des nœuds" });
    }
    res.json(results.map(row => row.node_name));
  });
});

app.get("/mss/imsi-analysis", (req, res) => {
  const { page = 1, limit = 50, node } = req.query;
  const offset = (page - 1) * limit;
  
  let query = "SELECT * FROM mss_imsi_analysis";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données IMSI:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données IMSI" });
    }
    res.json({ data: results });
  });
});

app.get("/mss/bnumber-analysis", (req, res) => {
  const { page = 1, limit = 50, node } = req.query;
  const offset = (page - 1) * limit;
  
  let query = "SELECT * FROM mss_bnumber_analysis";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données B-Number:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données B-Number" });
    }
    res.json({ data: results });
  });
});

app.get("/mss/gt-series", (req, res) => {
  const { page = 1, limit = 50, node } = req.query;
  const offset = (page - 1) * limit;
  
  let query = "SELECT * FROM mss_gt_series";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données GT Series:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données GT Series" });
    }
    res.json({ data: results });
  });
});

// Route to get all unique node names from all tables
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
    if (error) {
      console.error('Error fetching node names:', error);
      return res.status(500).json({ error: 'Error fetching node names' });
    }
    res.json(results.map(row => row.node_name));
  });
});

// Route pour les réseaux mobiles de MSS Huawei
app.get('/huawei/mobile-networks', (req, res) => {
  const query = `
    SELECT 
      id,
      network_name,
      mcc,
      mnc,
      plmn,
      gt,
      imsi_prefix,
      country,
      operator,
      status,
      created_at,
      updated_at
    FROM mobile_network
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des réseaux mobiles:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des réseaux mobiles' });
    }
    console.log('Nombre de réseaux mobiles trouvés:', results.length);
    if (results.length > 0) {
      console.log('Premier réseau mobile:', results[0]);
    }
    res.json(results);
  });
});

const importIR21File = require('./importIR21');

// Vérification de la connexion à la base de données
async function checkDatabaseConnection() {
  try {
    await connection.promise().query('SELECT 1');
    console.log('✅ Connexion à la base de données réussie');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:', error);
    return false;
  }
}

// Route pour l'import IR21
app.post('/import-ir21', async (req, res, next) => {
  console.log('=== Début de la requête d\'import ===');
  console.log('Headers:', req.headers);
  
  // Vérifier la connexion à la base de données
  const isConnected = await checkDatabaseConnection();
  if (!isConnected) {
    return res.status(500).json({
      success: false,
      message: 'Erreur de connexion à la base de données'
    });
  }

  // Middleware pour gérer les erreurs multer
  upload.single('ir21File')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Erreur Multer:', err);
      return res.status(400).json({
        success: false,
        message: `Erreur lors de l'upload: ${err.message}`
      });
    } else if (err) {
      console.error('❌ Erreur inconnue:', err);
      return res.status(500).json({
        success: false,
        message: `Erreur serveur: ${err.message}`
      });
    }

    if (!req.file) {
      console.error('❌ Aucun fichier n\'a été uploadé');
      return res.status(400).json({ 
        success: false,
        message: 'Aucun fichier n\'a été uploadé' 
      });
    }

    console.log('📁 Fichier reçu:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    try {
      // Vérifier si le fichier existe
      if (!fs.existsSync(req.file.path)) {
        throw new Error('Le fichier n\'existe pas sur le serveur');
      }

      // Lire le contenu du fichier
      const fileContent = fs.readFileSync(req.file.path, 'utf8');
      console.log('📄 Contenu du fichier (premiers 500 caractères):', fileContent.substring(0, 500));

      // Vérifier si le contenu est un XML valide
      if (!fileContent.trim().startsWith('<?xml')) {
        throw new Error('Le fichier ne semble pas être un XML valide');
      }

      // Importer le fichier
      console.log('🔄 Début du traitement du fichier');
      const result = await importIR21File(req.file.path);
      console.log('✅ Traitement terminé avec succès:', result);

      // Supprimer le fichier temporaire
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Fichier temporaire supprimé');
      } catch (err) {
        console.error('⚠️ Erreur lors de la suppression du fichier temporaire:', err);
      }

      res.json(result);
    } catch (error) {
      console.error('❌ Erreur détaillée:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });

      // Supprimer le fichier temporaire
      try {
        if (req.file && req.file.path) {
          fs.unlinkSync(req.file.path);
          console.log('🗑️ Fichier temporaire supprimé après erreur');
        }
      } catch (err) {
        console.error('⚠️ Erreur lors de la suppression du fichier temporaire:', err);
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Erreur lors de l\'import du fichier IR21',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
