const mysql = require('mysql2/promise');

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'mon_projet_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/**
 * Get all mobile networks data
 */
exports.getMobileNetworks = async (req, res) => {
  try {
    // Query to select all records from mobile_networks table
    const [rows] = await pool.query('SELECT * FROM mobile_networks');
    
    // Return the results as JSON
    res.json(rows);
  } catch (error) {
    console.error('Error fetching mobile networks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};