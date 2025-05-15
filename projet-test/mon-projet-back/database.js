const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuration de la connexion à la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    // port: process.env.DB_PORT, // Usually not needed if using default MySQL port 3306
    dialect: 'mysql',
    logging: false, 
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test de la connexion et synchronisation des modèles
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données établie avec succès.');
    
    // Charger les modèles avant de synchroniser
    const User = require('./models/User');
    // Si vous avez d'autres modèles, require-les ici aussi
    // exemple: const Post = require('./models/Post');

    await sequelize.sync(); // Normal sync without force: true
    console.log('Modèles synchronisés avec la base de données.');

  } catch (error) {
    console.error('Erreur lors de la connexion/synchronisation à la DB:', error);
  }
};

testConnection();

module.exports = sequelize; 