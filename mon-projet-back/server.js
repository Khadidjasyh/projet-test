require('dotenv').config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); 

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

// Route pour récupérer les données de situation_globale
app.get("/situation-globale", (req, res) => {
  console.log("Route /situation-globale appelée");
  const query = "SELECT * FROM situation_globale ORDER BY Country";
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Erreur MySQL:", error);
      return res.status(500).json({ 
        error: "Erreur lors de la récupération des données.",
        details: error.message 
      });
    }
    console.log(`${results.length} enregistrements trouvés dans situation_globale`);
    res.status(200).json(results);
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
