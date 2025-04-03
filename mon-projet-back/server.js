/*
require('dotenv').config();

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

// Initialisation de l'application Express
const app = express();
const PORT = 5177;

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // ⚠️ Remplace par ton vrai mot de passe
  database: "mon_projet_db",
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

// Middleware
app.use(cors());
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



// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});

*/
/*

la meilleur version contact fonctionne avec 
========================================================================
/*
require('dotenv').config();

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5177;
=======
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// Charger les variables d'environnement
dotenv.config();

const app = express();
>>>>>>> 814f2ef (Premier commit de mon projet)

// Middleware
app.use(cors());
app.use(express.json());
<<<<<<< HEAD
app.use(express.urlencoded({ extended: true })); // Pour les formulaires

// Votre route /register
app.post('/register', (req, res) => {
  res.send('Route /register fonctionne!');
});

// Configuration MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "mon_projet_db",
  waitForConnections: true,
  connectionLimit: 10
});

// Test de connexion MySQL
pool.getConnection()
  .then(conn => {
    console.log('✅ Connecté à MySQL');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erreur MySQL:', err.message);
  });

// Configuration de Nodemailer pour Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Middleware d'authentification JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || "khadidja", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Fonction de validation d'email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}


app.get('/test', (req, res) => {
  res.send("✅ Express fonctionne !");
});


// Inscription
// Route /register corrigée

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérification email existant
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email déjà utilisé' });
    }

    // Hashage mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertion
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    // Réponse
    res.status(201).json({
      id: result.insertId,
      name,
      email
    });

  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Connexion
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await pool.execute(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "khadidja",
      { expiresIn: '24h' }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token
    });

  } catch (error) {
    console.error("Erreur connexion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Profil utilisateur (protégé)
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const [user] = await pool.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.id]
    );
    
    if (user.length === 0) return res.sendStatus(404);
    
    res.json(user[0]);
  } catch (error) {
    res.sendStatus(500);
  }
});


app.post("/send-email", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires." });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: "L'adresse e-mail est invalide." });
    }

    // Enregistrement en base
    const [result] = await pool.execute(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    console.log("Message enregistré avec succès dans MySQL");

    // Envoi d'email
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "sayahkhadidja7@gmail.com",
      subject: "Nouveau message de contact",
      text: `
        Nom: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("E-mail envoyé :", info.response);
    
    res.status(200).json({ message: "Message enregistré et e-mail envoyé avec succès." });

  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur lors du traitement de la requête." });
  }
});

// Récupération des messages
app.get("/messages", authenticateToken, async (req, res) => {
  try {
    const [results] = await pool.execute(
      "SELECT * FROM contacts ORDER BY created_at DESC"
    );
    res.status(200).json(results);
  } catch (error) {
    console.error("Erreur MySQL :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des messages." });
  }
});



app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});*/
/*
require('dotenv').config();

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Initialisation de l'application Express
const app = express();
const PORT = 5177;

// Configuration CORS optimisée
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // Autorise uniquement le frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

// Middleware
app.use(cors(corsOptions)); // Utilisation de la configuration CORS
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


// Configuration MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "mon_projet_db",
  waitForConnections: true,
  connectionLimit: 10
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL");
    
    // Création des tables si elles n'existent pas
    connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error("Erreur création table users:", err);
      else console.log("✅ Table 'users' prête");
    });

    connection.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error("Erreur création table contacts:", err);
    });
  }
});

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Configuration JWT
const JWT_SECRET = process.env.JWT_SECRET || "khadidja";

// Middleware
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Fonction de validation d'email
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}




app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "Email invalide" });
  }

  connection.query("SELECT id FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("Erreur MySQL:", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    if (results.length > 0) {
      return res.status(409).json({ error: "Email déjà utilisé" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      connection.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, results) => {
          if (err) {
            console.error("Erreur MySQL:", err);
            return res.status(500).json({ error: "Erreur serveur" });
          }

          const token = jwt.sign({ id: results.insertId, email }, JWT_SECRET, { expiresIn: "24h" });
          res.status(201).json({ message: "Inscription réussie", token });
        }
      );
    } catch (error) {
      console.error("Erreur de hashage:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });
});

// Route POST pour la connexion
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erreur serveur" });
    if (results.length === 0) return res.status(401).json({ error: "Identifiants incorrects" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Identifiants incorrects" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ 
      message: "Connexion réussie", 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  });
});

// Route pour vérifier un token (optionnel)
app.get("/validate-token", (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: "Token invalide" });
  }
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint API non trouvé" });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur API en cours d'exécution sur http://localhost:${PORT}`);
});
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
const PORT = 5177;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // ⚠️ Remplace par ton vrai mot de passe
  database: "mon_projet_db",
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
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Fonction de validation d'e-mail
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Routes d'authentification
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "User registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "khadidja", {
      expiresIn: "1h",
    });

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    });
  });
});

// Routes pour le contact et l'envoi d'emails
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
  db.query(query, [name, email, message], (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement du message dans la base de données." });
    }

    console.log("Message enregistré avec succès dans MySQL");

    // Envoyer un e-mail via Gmail
    const mailOptions = {
      from: process.env.GMAIL_USER,
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
  db.query(query, (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des messages." });
    }
    res.status(200).json(results);
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
/*
require('dotenv').config();

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Initialisation de l'application Express
const app = express();
const PORT = 5177;

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // ⚠️ Remplace par ton vrai mot de passe
  database: "mon_projet_db",
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
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Fonction de validation d'e-mail
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Route d'authentification (Login)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  // Vérifier si l'utilisateur existe
  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], async (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de la connexion." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    }

    const user = results[0];

    // Vérifier le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });

    res.status(200).json({ message: "Connexion réussie.", token });
  });
});

// Route pour gérer l'envoi du formulaire
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "L'adresse e-mail est invalide." });
  }

  const query = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  connection.query(query, [name, email, message], (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement du message." });
    }

    console.log("Message enregistré avec succès");

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: "sayahkhadidja7@gmail.com",
      subject: "Nouveau message de contact",
      text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
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

// Route pour récupérer tous les messages
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

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});*/

require('dotenv').config();

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Initialisation de l'application Express
const app = express();
const PORT = 5177;

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // ⚠️ Remplace par ton vrai mot de passe
  database: "mon_projet_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL");
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Clé secrète pour le JWT
const JWT_SECRET = process.env.JWT_SECRET || "mon_secret_jwt";

// 📌 Route d'inscription (Register)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Vérification des champs requis
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).json({ error: "Erreur serveur." });
      }
      if (results.length > 0) {
        return res.status(400).json({ error: "Cet email est déjà utilisé." });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Insérer l'utilisateur
      const query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      connection.query(query, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Erreur MySQL :", err);
          return res.status(500).json({ error: "Erreur lors de l'inscription." });
        }
        res.status(201).json({ message: "Utilisateur inscrit avec succès." });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// 📌 Route de connexion (Login)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis." });
  }

  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    }

    const user = results[0];

    // Comparaison des mots de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// 📌 Route protégée pour tester le token
app.get("/protected", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Accès autorisé", user: decoded });
  } catch (error) {
    res.status(401).json({ error: "Token invalide ou expiré." });
  }
});

// 📌 Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
