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
const authRoutes = require('./routes/auth');
const firewallRoutes = require('./routes/firewall');
const User = require('./models/User');
const UserReport = require('./models/UserReport');

// Configuration de la journalisation
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  logStream.write(logMessage);
};

// Configuration de Sequelize
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: console.log
});

// Test de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Initialisation de l'application Express
const app = express();
const PORT = 5178;

// Middleware
app.use(cors({
  origin: 'http://localhost:5177',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration des routes d'authentification
app.use('/api/auth', authRoutes);
app.use('/', firewallRoutes);

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  log(`[${req.method}] ${req.originalUrl}`);
  next();
});

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

// Initialisation de la base de données
const sequelize = require('./database');

// Synchroniser les modèles avec la base de données
sequelize.sync({ force: false }) // force: false pour ne pas supprimer les données existantes
  .then(() => {
    console.log('Base de données synchronisée avec succès');
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation de la base de données:', err);
  });

// Connexion à MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Aaa!121212",
  database: process.env.DB_NAME || "mon_projet_db"
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log(' Connecté à MySQL');
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
  
  // Vérifier la connexion à la base de données
  if (!connection || connection.state === 'disconnected') {
    console.error("Erreur: Pas de connexion à la base de données");
    return res.status(500).json({ 
      error: "Erreur de connexion à la base de données",
      details: "La connexion à la base de données n'est pas établie"
    });
  }

  // Vérifier si la table existe
  const checkTableQuery = `SHOW TABLES LIKE 'mobile_networks'`;
  connection.query(checkTableQuery, (checkError, checkResults) => {
    if (checkError) {
      console.error("Erreur lors de la vérification de la table:", checkError);
      return res.status(500).json({ 
        error: "Erreur lors de la vérification de la table",
        details: checkError.message
      });
    }

    if (checkResults.length === 0) {
      console.error("La table 'mobile_networks' n'existe pas");
      return res.status(404).json({ 
        error: "Table non trouvée",
        details: "La table 'mobile_networks' n'existe pas dans la base de données"
      });
    }

    // Si la table existe, exécuter la requête
    const query = "SELECT * FROM mobile_networks";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Erreur MySQL :", error);
        return res.status(500).json({ 
          error: "Erreur lors de la récupération des réseaux mobiles.",
          details: error.message,
          sql: error.sql
        });
      }
      
      console.log(`Nombre de réseaux trouvés : ${results.length}`);
      if (results.length > 0) {
        console.log("Premier réseau :", JSON.stringify(results[0], null, 2));
      } else {
        console.log("Aucun réseau trouvé dans la table mobile_networks");
      }
      
      res.status(200).json(results);
    });
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
    FROM mobile_networks
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



app.get('/hss', (req, res) => {
  console.log('GET /hss endpoint hit');
  connection.query('SELECT epc, `3g`, hss_esm FROM hss_data', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données HSS' });
    }
    console.log('Sending HSS data:', results);
    res.json({ data: results });
  });
});

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

// Endpoint pour récupérer les données IR85
app.get('/ir85', async (req, res) => {
  try {
    connection.query('SELECT * FROM ir85_data', (err, results) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données IR85' });
      }
      console.log('Données IR85 envoyées:', results);
      res.json(results);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données IR85 :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Partie à modifier dans server.js
app.get('/firewall-ips', (req, res) => {
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

app.get("/mme-imsi", (req, res) => {
  console.log('Requête reçue sur /mme-imsi avec les paramètres:', req.query);
  
  // Vérifier la connexion à la base de données
  if (!connection || connection.state === 'disconnected') {
    console.error('Erreur: Pas de connexion à la base de données');
    return res.status(500).json({ error: 'Database connection error' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.search || '';

  console.log(`Paramètres de pagination - page: ${page}, limit: ${limit}, offset: ${offset}, search: '${searchTerm}'`);

  // Vérifier si la table existe
  const checkTableQuery = `SHOW TABLES LIKE 'mme_imsi_analysis'`;
  
  connection.query(checkTableQuery, (tableErr, tableResults) => {
    if (tableErr) {
      console.error('Erreur lors de la vérification de la table:', tableErr);
      return res.status(500).json({ error: 'Database error checking table' });
    }

    if (tableResults.length === 0) {
      console.error('La table mme_imsi_analysis n\'existe pas dans la base de données');
      return res.status(404).json({ error: 'Table mme_imsi_analysis not found' });
    }

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

    console.log('Exécution de la requête de comptage avec les paramètres:', countParams);
    
    connection.query(countQuery, countParams, (countError, countResults) => {
      if (countError) {
        console.error('Erreur lors du comptage des enregistrements MME IMSI:', countError);
        return res.status(500).json({ error: 'Error counting MME IMSI records', details: countError.message });
      }
      
      console.log('Résultat du comptage:', countResults[0].total);

      console.log('Exécution de la requête principale avec les paramètres:', queryParams);
      
      connection.query(query, queryParams, (dataError, results) => {
        if (dataError) {
          console.error('Erreur lors de la récupération des données MME IMSI:', dataError);
          return res.status(500).json({ error: 'Error fetching MME IMSI data', details: dataError.message });
        }
        
        console.log(`Récupération de ${results.length} enregistrements`);
        
        res.json({
          data: results,
          total: countResults[0].total,
          page,
          totalPages: Math.ceil(countResults[0].total / limit),
        });
      });
    });
  });
});

app.get('/hlrr', (req, res) => {
  // Utiliser le style de callback standard pour MySQL
  connection.query('SELECT tt, np, na, ns, gtrc FROM hlr', (error, rows) => {
    if (error) {
      console.error('Error fetching HLR data:', error);
      return res.status(500).json({ error: 'Failed to fetch HLR data' });
    }
    
    res.json({ data: rows });
  });
});

// Auth routes (authentification)
app.use('/auth', authRoutes);

// Associations Sequelize pour les signalements
User.hasMany(UserReport, { foreignKey: 'userId' });
UserReport.belongsTo(User, { foreignKey: 'userId' });

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});