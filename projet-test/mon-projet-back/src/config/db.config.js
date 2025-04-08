const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'roaming_audit',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize database tables
const initDatabase = async () => {
    try {
        const connection = await pool.getConnection();
        
        // Show table structure
        console.log('Checking users table structure...');
        const [tables] = await connection.execute('SHOW TABLES LIKE "users"');
        if (tables.length > 0) {
            const [columns] = await connection.execute('SHOW COLUMNS FROM users');
            console.log('Users table columns:', columns.map(col => ({
                Field: col.Field,
                Type: col.Type,
                Null: col.Null,
                Key: col.Key,
                Default: col.Default
            })));
        } else {
            console.log('Users table does not exist');
        }

        connection.release();
        return true;
    } catch (err) {
        console.error('Error checking database:', err);
        throw err;
    }
};

// Initialize tables when the application starts
initDatabase().then(() => {
    console.log('Database initialization complete');
}).catch(err => {
    console.error('Database initialization failed:', err);
});

module.exports = pool; 