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

// Initialisation de l'application Express
const app = express();
const PORT = 5177;

const upload = multer({ dest: 'uploads/' });


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
  const query = "SELECT * FROM roaming_partners";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des partenaires." });
    }
    console.log(`Nombre de partenaires trouvés : ${results.length}`);
    if (results.length > 0) {
      console.log("Premier partenaire :", results[0]);
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

// Routes for MSS data
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
  
  // First get total count
  connection.query(countQuery, node ? [node] : [], (error, countResults) => {
    if (error) {
      console.error("Error counting IMSI records:", error);
      return res.status(500).json({ error: "Error fetching data" });
    }
    
    // Then get paginated data
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error fetching IMSI data:", error);
        return res.status(500).json({ error: "Error fetching data" });
      }
      res.json({
        data: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit)
      });
    });
  });
});

app.get('/mss/bnumber-analysis', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const offset = (page - 1) * limit;
  const node = req.query.node || '';

  let query = `
    SELECT 
      node_name,
      b_number,
      miscell,
      f_n,
      route,
      charge,
      l_value as l,
      a_value,
      created_at
    FROM mss_bnumber_analysis
  `;
  let countQuery = "SELECT COUNT(*) as total FROM mss_bnumber_analysis";
  
  if (node) {
    query += " WHERE node_name = ?";
    countQuery += " WHERE node_name = ?";
  }
  
  query += " ORDER BY node_name, b_number LIMIT ? OFFSET ?";
  
  const queryParams = node ? [node, limit, offset] : [limit, offset];
  
  // First get total count
  connection.query(countQuery, node ? [node] : [], (error, countResults) => {
    if (error) {
      console.error("Error counting B-Number records:", error);
      return res.status(500).json({ error: "Error fetching data" });
    }
    
    // Then get paginated data
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error fetching B-Number data:", error);
        return res.status(500).json({ error: "Error fetching data" });
      }
      res.json({
        data: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit)
      });
    });
  });
});

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
  
  // First get total count
  connection.query(countQuery, node ? [node] : [], (error, countResults) => {
    if (error) {
      console.error("Error counting GT Series records:", error);
      return res.status(500).json({ error: "Error fetching data" });
    }
    
    // Then get paginated data
    connection.query(query, queryParams, (error, results) => {
      if (error) {
        console.error("Error fetching GT Series data:", error);
        return res.status(500).json({ error: "Error fetching data" });
      }
      res.json({
        data: results,
        total: countResults[0].total,
        page,
        totalPages: Math.ceil(countResults[0].total / limit)
      });
    });
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


const importIR21File = require('./importIR21');

app.post('/import-ir21', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier n\'a été uploadé' });
  }

  try {
    const result = await importIR21File(req.file.path);
    
    // Supprimer le fichier temporaire
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    
    // Supprimer le fichier temporaire même en cas d'erreur
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error('Erreur lors de la suppression du fichier:', err);
    }

    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
