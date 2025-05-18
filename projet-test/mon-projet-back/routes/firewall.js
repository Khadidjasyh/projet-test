const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Configuration de la connexion MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Route pour obtenir les IPs du firewall
router.get('/firewall-ips', (req, res) => {
  const query = 'SELECT * FROM firewall_ips';
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching firewall IPs:', error);
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json(results);
  });
});

module.exports = router;
