const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

// Database connection configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Aaa!121212", // Ensure this is correct or use env
  database: process.env.DB_NAME || "mon_projet_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Regex and parsing logic based on your format "TT NP NA NS GTRC"
const parseHlrData = (text) => {
  const entries = [];
  const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');

  // Find the line that starts the data section (e.g., "TT   NP  NA   NS  GTRC")
  const dataStartIndex = lines.findIndex(line => line.startsWith('TT'));

  if (dataStartIndex === -1) {
    console.warn('⚠️ No HLR data header found (expected line starting with "TT NP NA NS GTRC")');
    return [];
  }

  // Process lines after the header
  const dataLines = lines.slice(dataStartIndex + 1);

  for (const line of dataLines) {
    // Stop if a line starts with 'OPERATING' or similar footer
    if (line.startsWith('OPERATING') || line.startsWith('---')) {
        break;
    }

    // Split by one or more spaces, filter out empty strings
    const columns = line.split(/\s+/).filter(col => col !== '');

    // Expecting 5 columns based on "TT NP NA NS GTRC"
    if (columns.length === 5) {
      entries.push({
        tt: columns[0],
        np: columns[1],
        na: columns[2],
        ns: columns[3],
        gtrc: columns[4],
      });
    } else {
      console.warn(`⚠️ Skipping line with incorrect number of columns (${columns.length} instead of 5): "${line}"`);
    }
  }
  return entries;
};

const importHLRData = async (filePath, nodeName) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const content = await fs.readFile(filePath, 'utf-8');
    const entries = parseHlrData(content);

    if (entries.length === 0) {
      console.log(`⚠️ No HLR entries found in ${path.basename(filePath)}`);
      return { success: false, message: 'No HLR entries found or incorrect format' };
    }

    // Insert entries into the database
    const query = `
        INSERT INTO hlr
        (node_name, tt, np, na, ns, gtrc, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    let importedCount = 0;
    for (const entry of entries) {
        // Add nodeName to the entry before insertion
        await connection.execute(query, [
            nodeName, // Use the nodeName derived from the filename
            entry.tt,
            entry.np,
            entry.na,
            entry.ns,
            entry.gtrc
        ]);
        importedCount++;
    }

    console.log(`✅ Successfully imported ${importedCount} entries from ${path.basename(filePath)} for node ${nodeName}`);
    return { success: true, message: `${importedCount} entries imported for node ${nodeName}` };

  } catch (err) {
    console.error('❌ Error during HLR import:', err.message);
    // Log more details about the error
    if (err.sqlMessage) {
        console.error('SQL Error:', err.sqlMessage);
        console.error('SQL Query:', err.sql);
    }
    return { success: false, message: `Import failed: ${err.message}` };
  } finally {
    if (connection) connection.release();
  }
};

// Function to create table (ensure this is called on server startup or first import)
// Keeping this here, but server.js also seems to handle table creation
async function createTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS hlr_data (
        id INT AUTO_INCREMENT PRIMARY KEY,
        node_name VARCHAR(255),
        tt VARCHAR(255),
        np VARCHAR(255),
        na VARCHAR(255),
        ns VARCHAR(255),
        gtrc VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ hlr_data table ensured to exist.");
  } catch (err) {
    console.error('❌ Error creating hlr_data table:', err.message);
  } finally {
    if (connection) connection.release();
  }
}

// Export functions for use in your backend application (e.g., in a route handler)
// The server route will call importHLRData directly.
module.exports = { importHLRData, createTable, pool, parseHlrData }; // Export parse function for potential testing 