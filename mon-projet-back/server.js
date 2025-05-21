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
const User = require('./models/User');
const UserReport = require('./models/UserReport');
const hlrRoutes = require('./importHLR');
const { importHuaweiMSSData } = require('./importHuaweiNetworks');
const auditRoutes = require('./routes/auditRoutes');

// Configuration de la journalisation
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  logStream.write(logMessage);
};

// Initialisation de l'application Express
const app = express();
const PORT = 5178;

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'MME');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accepter les fichiers .txt ou .log
    if (file.originalname.endsWith('.txt') || file.originalname.endsWith('.log')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers .txt et .log sont autorisés pour l\'upload HLR'));
    }
  }
});

// Middleware
app.use(cors({
  origin: '*', // Permettre toutes les origines pendant le développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route pour l'upload de fichiers HLR
app.post('/api/upload-hlr', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier n\'a été uploadé' });
  }

  try {
    const filePath = req.file.path;
    const nodeName = path.basename(req.file.originalname, path.extname(req.file.originalname));
    console.log(`Traitement du fichier HLR: ${filePath} pour le nœud ${nodeName}`);

    // Lire le contenu du fichier
    const content = await fs.promises.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    const hlrData = [];

    // Parser les données
    for (const line of lines) {
      if (line.trim()) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
          hlrData.push({
            tt: parts[0],
            np: parts[1],
            na: parts[2],
            ns: parts[3],
            gtrc: parts[4],
            node_name: nodeName
          });
        }
      }
    }

    if (hlrData.length === 0) {
      throw new Error('Aucune donnée HLR valide trouvée dans le fichier');
    }

    console.log(`Parsing réussi. ${hlrData.length} lignes de données HLR extraites.`);
    // Optionnel: Log les premières lignes pour inspection
    // console.log('Premières lignes de données HLR:', hlrData.slice(0, 5));

    // Insérer les données dans la base
    const insertQuery = 'INSERT INTO hlr (tt, np, na, ns, gtrc, node_name) VALUES (?, ?, ?, ?, ?, ?)';
    for (const data of hlrData) {
      try {
        // Log les données avant l'insertion
        console.log('Insertion HLR - Données:', data);
        await connection.execute(insertQuery, [data.tt, data.np, data.na, data.ns, data.gtrc, data.node_name]);
        console.log('Insertion réussie pour une ligne.');
      } catch (insertError) {
        console.error('Erreur lors de l\'insertion d\'une ligne HLR:', data, insertError);
        // Décider si on continue ou si on arrête tout en cas d'erreur d'insertion
        // Pour l'instant, on log l'erreur et on continue avec la ligne suivante
      }
    }

    // Ne pas supprimer le fichier après l'import
    res.json({
      success: true,
      message: `${hlrData.length} enregistrements HLR ont été importés avec succès (les erreurs d'insertion individuelles ont été loggées)`
    });
  } catch (error) {
    console.error('Erreur fatale lors de l\'import HLR:', error);
    // Supprimer le fichier en cas d'erreur
    if (req.file && req.file.path) {
      try {
        await fs.promises.unlink(req.file.path);
        console.log(`Fichier temporaire ${req.file.path} supprimé.`);
      } catch (unlinkError) {
        console.error('Erreur lors de la suppression du fichier temporaire:', unlinkError);
      }
    }
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'import du fichier HLR: ' + error.message
    });
  }
});

// New route for outbound roaming data
app.get('/outbound-roaming', (req, res) => {
  const query = `
    SELECT 
      sg.pays, 
      sg.operateur, 
      sg.plmn,

      -- Résultat extraction IR21 / IR85
      CASE 
        WHEN i.tadig IS NOT NULL THEN 'réussit' 
        ELSE 'erreur' 
      END AS extraction_ir21,

      CASE 
        WHEN ir85.tadig IS NOT NULL THEN 'réussit'
        ELSE 'erreur'
      END AS extraction_ir85,

      -- Champs pour vérification APN/EPC
      COALESCE(i.apn, ir85.apn) AS apn,
      COALESCE(i.e212, ir85.e212) AS e212,

      -- Vérification GT (MSC/VLR)
      CASE
        WHEN COALESCE(i.e214, ir85.e214) IS NOT NULL AND COALESCE(i.e214, ir85.e214) != '' THEN 'reussi'
        ELSE 'aucun'
      END AS verification_gt_msc,

      h.epc,
      h.imsi_prefix,

      -- Comparaison flexible APN vs EPC
      CASE 
        WHEN (
          (i.apn IS NOT NULL AND (
            i.apn LIKE CONCAT('%', REPLACE(h.epc, 'epc.', ''), '%') 
            OR i.apn LIKE CONCAT('%', h.epc, '%')
          ))
          OR
          (ir85.apn IS NOT NULL AND (
            ir85.apn LIKE CONCAT('%', REPLACE(h.epc, 'epc.', ''), '%') 
            OR ir85.apn LIKE CONCAT('%', h.epc, '%')
          ))
        ) THEN 'correct'
        ELSE 'erreur'
      END AS comparaison_apn_epc,

      -- Extraction MCC/MNC depuis e212 format mccXXX.mncYYY
      SUBSTRING_INDEX(SUBSTRING_INDEX(COALESCE(i.e212, ir85.e212), '.', 1), 'mcc', -1) AS mcc,
      SUBSTRING_INDEX(SUBSTRING_INDEX(COALESCE(i.e212, ir85.e212), '.', -1), 'mnc', -1) AS mnc

    FROM situation_globales sg
    LEFT JOIN ir21_data i ON sg.plmn = i.tadig
    LEFT JOIN ir85_data ir85 ON sg.plmn = ir85.tadig
    LEFT JOIN hss_data h ON h.imsi_prefix IN (i.e212, ir85.e212)
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('❌ Erreur lors de la récupération des données Outbound Roaming:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    console.log(`✅ ${results.length} lignes récupérées pour Outbound Roaming`);
    res.json(results);
  });
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
  const query = 'SELECT * FROM situation_globales';
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

app.get('/hss', async (req, res) => {
  console.log('GET /hss endpoint hit');
  connection.query('SELECT id, node_name, epc, `3g`, hss_esm, created_at FROM hss_data', (err, results) => {
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
      res.json({ data: results });
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
  connection.query('SELECT id, tt, np, na, ns, gtrc, node_name, created_at FROM hlr ORDER BY id DESC', (error, rows) => {
    if (error) {
      console.error('Error fetching HLR data:', error);
      return res.status(500).json({ error: 'Failed to fetch HLR data' });
    }
    
    // Formater les données pour s'assurer qu'elles sont valides
    const formattedRows = rows.map(row => ({
      id: row.id,
      tt: row.tt || '',
      np: row.np || '',
      na: row.na || '',
      ns: row.ns || '',
      gtrc: row.gtrc || '',
      node_name: row.node_name || '', // Assurez-vous que node_name est inclus et gère les valeurs nulles
      created_at: row.created_at || null
    }));
    
    res.json({ data: formattedRows });
  });
});

// Auth routes (authentification)
app.use('/auth', authRoutes);

// Associations Sequelize pour les signalements
User.hasMany(UserReport, { foreignKey: 'userId' });
UserReport.belongsTo(User, { foreignKey: 'userId' });

// Création de la table hlr si elle n'existe pas
const createHlrTable = `
CREATE TABLE IF NOT EXISTS hlr (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tt VARCHAR(50),
    np VARCHAR(50),
    na VARCHAR(50),
    ns VARCHAR(50),
    gtrc VARCHAR(50),
    node_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createHlrTable, (error) => {
    if (error) {
        console.error('Erreur lors de la création de la table hlr:', error);
    } else {
        console.log('Table hlr créée ou déjà existante');
    }
});

// Ajout de la colonne node_name à la table hlr si elle n'existe pas
// Correction de la syntaxe IF NOT EXISTS qui n'est pas supportée pour ADD COLUMN dans certaines versions MySQL
const checkColumnExistsQuery = "SHOW COLUMNS FROM hlr LIKE 'node_name'";

connection.query(checkColumnExistsQuery, (error, results) => {
    if (error) {
        console.error('Erreur lors de la vérification de l\'existence de la colonne node_name:', error);
        return;
    }

    // Si la colonne n'existe pas, l'ajouter
    if (results.length === 0) {
        const addColumnQuery = "ALTER TABLE hlr ADD COLUMN node_name VARCHAR(255)";
        connection.query(addColumnQuery, (alterError) => {
            if (alterError) {
                console.error('Erreur lors de l\'ajout de la colonne node_name:', alterError);
            } else {
                console.log('Colonne node_name ajoutée avec succès');
            }
        });
    } else {
        console.log('Colonne node_name déjà existante');
    }
});

// Route pour supprimer un nœud HLR
app.delete('/api/hlr/node/:nodeName', async (req, res) => {
  const nodeName = req.params.nodeName;
  
  try {
    // Supprimer les données de la base
      await new Promise((resolve, reject) => {
      connection.query('DELETE FROM hlr WHERE node_name = ?', [nodeName], (error) => {
        if (error) reject(error);
        else resolve();
        });
      });

    // Supprimer les fichiers associés
    const hlrDir = path.join(__dirname, 'HLR');
    if (fs.existsSync(hlrDir)) {
      const files = fs.readdirSync(hlrDir);
      for (const file of files) {
        if (file.includes(nodeName)) {
          const filePath = path.join(hlrDir, file);
          try {
            await fs.promises.unlink(filePath);
            console.log(`Fichier supprimé: ${filePath}`);
  } catch (error) {
            console.error(`Erreur lors de la suppression du fichier ${filePath}:`, error);
          }
        }
      }
    }

    res.json({ success: true, message: 'Nœud HLR supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du nœud HLR:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression du nœud' });
  }
});

// Routes HLR
app.get('/api/hlr', async (req, res) => {
  try {
    const query = 'SELECT * FROM hlr ORDER BY id DESC';
  connection.query(query, (error, results) => {
    if (error) {
        console.error('Erreur lors de la récupération des données HLR:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données HLR' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données HLR:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des données HLR' });
  }
});

app.get('/api/hlr/nodes', (req, res) => {
  const query = 'SELECT DISTINCT node_name FROM hlr WHERE node_name IS NOT NULL AND node_name != ""';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des nœuds HLR:', error);
      return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des nœuds' });
    }
    res.json({ success: true, nodes: results.map(row => row.node_name) });
  });
});

// Route pour l'importation des réseaux Huawei
app.post('/api/upload-huawei-networks', upload.single('file'), async (req, res) => {
  console.log('Route /api/upload-huawei-networks appelée');
  
  if (!req.file) {
    console.error('Aucun fichier n\'a été uploadé');
    return res.status(400).json({ 
      success: false,
      message: 'Aucun fichier n\'a été uploadé' 
    });
  }

  console.log('Fichier reçu:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  });

  try {
    // Lire le contenu du fichier
    const content = await fs.promises.readFile(req.file.path, 'utf8');
    console.log('Contenu du fichier lu, taille:', content.length);

    // Parser les données
    const lines = content.split('\n');
    const huaweiData = [];
    const nodeName = path.basename(req.file.originalname, path.extname(req.file.originalname));

    // Pattern pour les lignes de données Huawei
    const regex = /^\s*(\d+)\s+(\d+)\s+(.+?)\s{2,}(\S+)\s*$/;

    for (const line of lines) {
      if (!line.trim()) continue;
      
      console.log('Analyse de la ligne:', line);
      const match = line.match(regex);
      
      if (match) {
        const [, imsi_prefix, msisdn_prefix, network_name, managed_object_group] = match;
        huaweiData.push({
          imsi_prefix: imsi_prefix.trim(),
          msisdn_prefix: msisdn_prefix.trim(),
          network_name: network_name.trim(),
          managed_object_group: managed_object_group.trim(),
          node_name: nodeName
        });
      }
    }

    if (huaweiData.length === 0) {
      throw new Error('Aucune donnée valide trouvée dans le fichier');
    }

    console.log(`Nombre d'entrées à importer: ${huaweiData.length}`);

    // Insérer les données dans la base
    let successCount = 0;
    for (const data of huaweiData) {
      try {
      await new Promise((resolve, reject) => {
          connection.query(
            'INSERT INTO huawei_mobile_networks (imsi_prefix, msisdn_prefix, network_name, managed_object_group, node_name) VALUES (?, ?, ?, ?, ?)',
            [data.imsi_prefix, data.msisdn_prefix, data.network_name, data.managed_object_group, data.node_name],
            (error) => {
              if (error) reject(error);
              else {
                successCount++;
          resolve();
              }
            }
          );
        });
      } catch (err) {
        console.error('Erreur lors de l\'insertion:', err);
      }
    }

    console.log(`Importation terminée : ${successCount} entrées importées avec succès`);
        res.json({ 
          success: true,
      message: `Importation terminée : ${successCount} entrées importées avec succès`
      });

    } catch (error) {
    console.error('Erreur lors de l\'import des réseaux Huawei:', error);
        res.status(500).json({ 
          success: false,
      error: 'Erreur lors de l\'import du fichier: ' + error.message
    });
  }
});

// Route pour récupérer les réseaux Huawei
app.get('/api/huawei-networks', async (req, res) => {
  try {
    // Vérifier si la table existe
    const checkTableQuery = `SHOW TABLES LIKE 'huawei_mobile_networks'`;
    connection.query(checkTableQuery, (checkError, checkResults) => {
      if (checkError) {
        console.error('Erreur lors de la vérification de la table:', checkError);
        return res.status(500).json({ 
          error: 'Erreur lors de la vérification de la table',
          details: checkError.message
        });
      }

      if (checkResults.length === 0) {
        console.error("La table 'huawei_mobile_networks' n'existe pas");
        return res.status(404).json({ 
          error: 'Table non trouvée',
          details: "La table 'huawei_mobile_networks' n'existe pas dans la base de données"
        });
      }

      // Si la table existe, exécuter la requête
      const query = 'SELECT * FROM huawei_mobile_networks ORDER BY id DESC';
      connection.query(query, (error, results) => {
        if (error) {
          console.error('Erreur lors de la récupération des données:', error);
          return res.status(500).json({ 
            error: 'Erreur lors de la récupération des données',
            details: error.message
          });
        }
        
        console.log(`Nombre de réseaux trouvés : ${results.length}`);
        if (results.length > 0) {
          console.log('Premier réseau :', JSON.stringify(results[0], null, 2));
        }
        
        res.json(results);
      });
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: err.message
    });
  }
});

// Création de la table huawei_mobile_networks si elle n'existe pas
const createHuaweiNetworksTable = `
CREATE TABLE IF NOT EXISTS huawei_mobile_networks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imsi_prefix VARCHAR(20),
    msisdn_prefix VARCHAR(20),
    network_name VARCHAR(255),
    managed_object_group VARCHAR(100),
    node_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createHuaweiNetworksTable, (error) => {
    if (error) {
        console.error('Erreur lors de la création de la table huawei_mobile_networks:', error);
    } else {
        console.log('Table huawei_mobile_networks créée ou déjà existante');
    }
});

// Route pour supprimer un nœud Huawei
app.delete('/api/huawei-networks/node/:nodeName', async (req, res) => {
  const nodeName = req.params.nodeName;
  console.log('Suppression du nœud Huawei:', nodeName);
  
  try {
  // Supprimer les données de la base
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM huawei_mobile_networks WHERE node_name = ?', [nodeName], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Supprimer les fichiers associés
    const huaweiDir = path.join(__dirname, 'MSS_Huawei');
    if (fs.existsSync(huaweiDir)) {
      const files = fs.readdirSync(huaweiDir);
      for (const file of files) {
        if (file.includes(nodeName)) {
          const filePath = path.join(huaweiDir, file);
          try {
            await fs.promises.unlink(filePath);
            console.log(`Fichier supprimé: ${filePath}`);
          } catch (error) {
            console.error(`Erreur lors de la suppression du fichier ${filePath}:`, error);
          }
        }
      }
    }

    res.json({ success: true, message: 'Nœud Huawei supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du nœud Huawei:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression du nœud' });
  }
});

// Route pour récupérer les nœuds Huawei disponibles
app.get('/api/huawei-networks/nodes', async (req, res) => {
  try {
    const query = 'SELECT DISTINCT node_name FROM huawei_mobile_networks WHERE node_name IS NOT NULL AND node_name != "" ORDER BY node_name';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des nœuds:', error);
        return res.status(500).json({ 
          success: false, 
          message: 'Erreur lors de la récupération des nœuds' 
        });
      }
      res.json({ 
        success: true, 
        nodes: results.map(row => row.node_name) 
      });
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
});

// Add new endpoint for firewall file upload
app.post('/api/upload-firewall', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.trim() && !line.startsWith('address-set') && !line.startsWith('}')) {
        const match = line.trim().match(/^address\s+(\S+)\s+([\d\.\/]+);?$/);
        if (match) {
          const [_, nom, cidr_complet] = match;
          let adresse_ip = cidr_complet;
          let longueur_masque = 32;

          if (cidr_complet.includes('/')) {
            const parts = cidr_complet.split('/');
            adresse_ip = parts[0];
            longueur_masque = parseInt(parts[1], 10);
          }

          await new Promise((resolve, reject) => {
            connection.query(
              'INSERT INTO firewall_ips (nom, adresse_ip, longueur_masque, cidr_complet) VALUES (?, ?, ?, ?)',
              [nom, adresse_ip, longueur_masque, cidr_complet],
              (error) => {
                if (error) reject(error);
                else resolve();
              }
            );
          });
        }
      }
    }

    res.json({ success: true, message: 'File uploaded and processed successfully' });
  } catch (error) {
    console.error('Error processing firewall file:', error);
    res.status(500).json({ error: 'Error processing firewall file' });
  }
});

// Add delete endpoint for firewall entries
app.delete('/api/firewall-ips/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM firewall_ips WHERE identifiant = ?', [id], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    res.json({ success: true, message: 'Firewall entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting firewall entry:', error);
    res.status(500).json({ error: 'Error deleting firewall entry' });
  }
});

// Create mme_imsi_analysis table if it doesn't exist
const createMmeImsiTable = `
CREATE TABLE IF NOT EXISTS mme_imsi_analysis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imsi VARCHAR(32) NOT NULL UNIQUE,
    default_apn_operator_id VARCHAR(100),
    digits_to_add VARCHAR(20),
    misc_info1 TEXT,
    hss_realm_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createMmeImsiTable, (error) => {
    if (error) {
        console.error('Error creating mme_imsi_analysis table:', error);
    } else {
        console.log('mme_imsi_analysis table created or already exists');
    }
});

// Add MME file upload endpoint
app.post('/api/upload-mme', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Received MME file:', {
    filename: req.file.originalname,
    path: req.file.path,
    size: req.file.size
  });

  try {
    const filePath = req.file.path;
    console.log('Reading MME file from:', filePath);
    
    const content = await fs.promises.readFile(filePath, 'utf-8');
    console.log('File content length:', content.length);
    
    // Split the content into IMSI blocks
    const imsiBlocks = content.split('IMSI:').slice(1);
    console.log('Number of IMSI blocks:', imsiBlocks.length);
    
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    for (const block of imsiBlocks) {
      try {
        const lines = block.trim().split('\n');
        const imsi = lines[0].trim();
        
        const parsedData = {
          imsi: imsi,
          default_apn_operator_id: '',
          digits_to_add: '',
          misc_info1: '',
          hss_realm_name: ''
        };
        
        lines.slice(1).forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('dn (DefaultAPNOperatorID)')) {
            parsedData.default_apn_operator_id = trimmedLine.split(/\s+/)[2];
          } else if (trimmedLine.startsWith('ad (DigitsToAdd)')) {
            parsedData.digits_to_add = trimmedLine.split(/\s+/)[2];
          } else if (trimmedLine.startsWith('m1 (MiscInfo1)')) {
            parsedData.misc_info1 = trimmedLine.split(/\s+/).slice(2).join(' ').replace(/_/g, ' ').trim();
          } else if (trimmedLine.startsWith('rn (HssRealmName)')) {
            parsedData.hss_realm_name = trimmedLine.split(/\s+/)[2];
          }
        });

        // Check if IMSI already exists
        const checkQuery = 'SELECT id FROM mme_imsi_analysis WHERE imsi = ?';
        const checkResult = await new Promise((resolve, reject) => {
          connection.query(checkQuery, [parsedData.imsi], (error, results) => {
            if (error) reject(error);
            else resolve(results);
          });
        });

        if (checkResult.length > 0) {
          // Update existing record
          const updateQuery = `
            UPDATE mme_imsi_analysis 
            SET default_apn_operator_id = ?,
                digits_to_add = ?,
                misc_info1 = ?,
                hss_realm_name = ?
            WHERE imsi = ?
          `;
          
          await new Promise((resolve, reject) => {
            connection.query(updateQuery, [
              parsedData.default_apn_operator_id,
              parsedData.digits_to_add,
              parsedData.misc_info1,
              parsedData.hss_realm_name,
              parsedData.imsi
            ], (error) => {
              if (error) {
                console.error('Error updating MME data:', error);
                reject(error);
              } else {
                successCount++;
                resolve();
              }
            });
          });
        } else {
          // Insert new record
          const insertQuery = `
            INSERT INTO mme_imsi_analysis 
            (imsi, default_apn_operator_id, digits_to_add, misc_info1, hss_realm_name) 
            VALUES (?, ?, ?, ?, ?)
          `;
          
          await new Promise((resolve, reject) => {
            connection.query(insertQuery, [
              parsedData.imsi,
              parsedData.default_apn_operator_id,
              parsedData.digits_to_add,
              parsedData.misc_info1,
              parsedData.hss_realm_name
            ], (error) => {
              if (error) {
                console.error('Error inserting MME data:', error);
                reject(error);
              } else {
                successCount++;
                resolve();
              }
            });
          });
        }
      } catch (blockError) {
        console.error('Error processing block:', blockError);
        errorCount++;
      }
    }

    console.log('Processing complete:', {
      successCount,
      errorCount,
      totalBlocks: imsiBlocks.length
    });

    if (successCount > 0) {
      res.json({ 
        success: true, 
        message: `Successfully processed ${successCount} entries from MME file`,
        details: {
          successCount,
          errorCount,
          totalBlocks: imsiBlocks.length
        }
      });
    } else {
      throw new Error('No valid entries were processed from the file');
    }
  } catch (error) {
    console.error('Error processing MME file:', error);
    res.status(500).json({ 
      error: 'Error processing MME file',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add MME delete endpoint
app.delete('/api/mme-imsi/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM mme_imsi_analysis WHERE id = ?', [id], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    res.json({ success: true, message: 'MME entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting MME entry:', error);
    res.status(500).json({ error: 'Error deleting MME entry' });
  }
});

// Routes audit
app.use('/', auditRoutes);

// Route pour vérifier les données de situation_globales
app.get('/check-situation-globale', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM situation_globales LIMIT 5');
    console.log('Données trouvées:', rows);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur lors de la vérification des données:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour récupérer la liste des tests
app.get('/tests', (req, res) => {
  const query = 'SELECT id, name, description FROM tests ORDER BY id';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des tests:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des tests' });
    }
    res.json(results);
  });
});

// Route pour l'utilisateur courant
app.get('/current-user', async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur depuis le localStorage (envoyé dans les headers)
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Récupérer l'utilisateur depuis la base de données
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Renvoyer les données de l'utilisateur
    res.json({
      user_id: user.id,
      name: user.name,
      role: user.role,
      permissions: user.role === 'admin' ? [
      { resource_type: 'Report', access_level: 'Admin' }
      ] : []
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour sauvegarder un rapport d'audit
app.post('/save-audit-report', async (req, res) => {
  try {
    const reportData = req.body;
    
    // Validation des champs requis
    if (!reportData.id || !reportData.test_id || !reportData.title || !reportData.date || !reportData.time) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    // Préparation de la requête SQL
    const sql = `
      INSERT INTO audit_reports (
        id, test_id, title, date, time, status, created_by, validated_by,
        total_operators, total_issues, camel_issues, gprs_issues, threeg_issues, lte_issues,
        results_data, solutions, attachments, validation_notes, implemented_changes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reportData.id,
      reportData.test_id,
      reportData.title,
      reportData.date,
      reportData.time,
      reportData.status,
      reportData.created_by,
      reportData.validated_by,
      reportData.total_operators,
      reportData.total_issues,
      reportData.camel_issues,
      reportData.gprs_issues,
      reportData.threeg_issues,
      reportData.lte_issues,
      reportData.results_data,
      reportData.solutions,
      reportData.attachments,
      reportData.validation_notes,
      reportData.implemented_changes
    ];

    // Exécution de la requête
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Erreur lors de la sauvegarde du rapport:', error);
        return res.status(500).json({ message: 'Erreur lors de la sauvegarde du rapport' });
      }
      
      console.log('Rapport sauvegardé avec succès:', results);
      res.status(200).json({ message: 'Rapport sauvegardé avec succès', id: reportData.id });
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    res.status(500).json({ message: 'Erreur lors du traitement de la requête' });
  }
});

// Fonction utilitaire pour nettoyer les préfixes
function cleanPrefix(value) {
  return value ? value.replace(/\s/g, '').trim() : '';
}

// Route pour le test Inbound Roaming
app.get('/inbound-roaming', async (req, res) => {
  try {
    const [ir21] = await connection.promise().execute('SELECT * FROM ir21_data');
    const [ir85] = await connection.promise().execute('SELECT * FROM ir85_data');
    const [mss] = await connection.promise().execute('SELECT * FROM mss_imsi_analysis');
    const [mobiles] = await connection.promise().execute('SELECT * FROM mobile_networks');

    const resultsMap = {};

    const processTest = (source, label) => {
      for (const entry of source) {
        const country = entry.pays || 'Inconnu';
        const operateur = entry.tadig || 'Inconnu';
        const key = `${country}-${operateur}`;

        const e212_list = cleanPrefix(entry.e212).split(',').map(e => e.trim()).filter(Boolean);
        const e214_list = cleanPrefix(entry.e214).split(',').map(e => e.trim()).filter(Boolean);

        let phase1_success = false;
        let phase2_success = false;

        const e212_trouves = [];
        const e212_non_trouves = [];

        for (const imsi of e212_list) {
          const found = (
            mss.some(row => row.imsi_series && row.imsi_series.startsWith(imsi)) ||
            mobiles.some(row => row.imsi_prefix && row.imsi_prefix.startsWith(imsi))
          );
          if (found) e212_trouves.push(imsi);
          else e212_non_trouves.push(imsi);
        }

        if (e212_trouves.length > 0) {
          phase1_success = true;

          const e214_trouves = [];
          const e214_non_trouves = [];

          for (const e214 of e214_list) {
            const found = (
              mss.some(row => row.m_value && row.m_value.replace(/^m_/, '').trim() === e214) ||
              mobiles.some(row => row.msisdn_prefix && row.msisdn_prefix.trim() === e214)
            );
            if (found) e214_trouves.push(e214);
            else e214_non_trouves.push(e214);
          }

          if (e214_trouves.length > 0) {
            phase2_success = true;
          }

          if (!phase2_success) {
            const reason = `Les MSISDN Prefix (${e214_non_trouves.join(', ')}) ne sont pas trouvés dans ${label}. Cela indique une absence de configuration de routage E.214.`;
            if (!resultsMap[key]) resultsMap[key] = { country, operateur, phase_1: 'réussite', phase_2: 'échec', test_final: 'échec', commentaires: [] };
            resultsMap[key].phase_2 = 'échec';
            resultsMap[key].test_final = 'échec';
            resultsMap[key].commentaires.push(reason);
          }
        } else {
          const reason = `Les IMSI Prefix (${e212_non_trouves.join(', ')}) sont absents dans ${label}, phase 2 non exécutée. Cela signifie que les abonnés du partenaire ne seront pas reconnus dans les MSS/MSC.`;
          if (!resultsMap[key]) resultsMap[key] = { country, operateur, phase_1: 'échec', phase_2: 'non exécutée', test_final: 'échec', commentaires: [] };
          resultsMap[key].phase_1 = 'échec';
          resultsMap[key].phase_2 = 'non exécutée';
          resultsMap[key].test_final = 'échec';
          resultsMap[key].commentaires.push(reason);
        }

        if (phase1_success && phase2_success) {
          if (!resultsMap[key]) {
            resultsMap[key] = {
              country,
              operateur,
              phase_1: 'réussite',
              phase_2: 'réussite',
              test_final: 'réussite',
              commentaires: ['Les IMSI et MSISDN Prefix sont bien configurés dans les MSS et dans la base mobile_networks. Aucun problème détecté.'],
            };
          }
        }
      }
    };

    processTest(ir21, 'IR.21');
    processTest(ir85, 'IR.85');

    const finalResults = Object.values(resultsMap).map(entry => ({
      ...entry,
      commentaire: entry.commentaires.join(' '),
    }));

    res.json(finalResults);
  } catch (error) {
    console.error('Erreur Inbound Roaming:', error);
    res.status(500).json({ error: 'Erreur serveur Inbound Roaming' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
