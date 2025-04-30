require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

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

// Routes externes
app.use('/api/huawei', huaweiRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
