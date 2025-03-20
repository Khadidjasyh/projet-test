const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,     // Exemple: 'localhost'
  user: process.env.DB_USER,     // Exemple: 'mon_utilisateur'
  password: process.env.DB_PASSWORD, // Exemple: 'mon_mot_de_passe'
  database: process.env.DB_NAME,     // Exemple: 'mon_projet_db'
  port: process.env.DB_PORT || 3306, // Port MySQL (par défaut 3306)
  waitForConnections: true,     // Attendre si nécessaire pour obtenir une connexion
  connectionLimit: 10,         // Limite de connexions
  queueLimit: 0                // Pas de limite pour la file d'attente
});

// Vérification de la connexion
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connecté à MySQL');
    connection.release();
  } catch (err) {
    console.error('❌ Erreur de connexion à MySQL :', err.message);
  }
})();

// Route de test
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur mon API Node.js avec MySQL ! 🚀' });
});

// Route pour récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des utilisateurs :', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Route pour ajouter un utilisateur
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Le nom et l’email sont obligatoires.' });
  }

  try {
    await pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ message: 'Utilisateur ajouté avec succès !' });
  } catch (err) {
    console.error('❌ Erreur lors de l’ajout de l’utilisateur :', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Erreurs globales
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur :', err.message);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Port du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
