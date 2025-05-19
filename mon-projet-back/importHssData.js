const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');

// Configuration MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Aaa!121212",
  database: process.env.DB_NAME || "mon_projet_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Regex tolérante (à ajuster selon tes exemples réels)
const HSS_REGEX = /(epc\.[^\s]+).*?(3gp[^\s.]+).*?(HSS[^\s]*)/i;

const parseHSSData = (text) => {
  return text
    .split('\n')
    .map(line => {
      const match = line.match(HSS_REGEX);
      // Log les lignes qui contiennent les 3 mots clés mais ne matchent pas la regex
      if (!match && line.includes('epc.') && line.includes('3gp') && line.includes('HSS')) {
        console.log('Non match:', line);
      }
      return match ? {
        epc: match[1].trim(),
        '3g': match[2].trim(),
        hss_esm: match[3].trim()
      } : null;
    })
    .filter(Boolean);
};

const importHSSData = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const hssFolder = path.join(__dirname, 'hss');

    // Lire tous les fichiers .log du dossier
    const files = await fs.readdir(hssFolder);

    for (const file of files) {
      if (path.extname(file) === '.log') {
        const filePath = path.join(hssFolder, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const nodeName = path.basename(file, '.log');
        const entries = parseHSSData(content);

        for (const { epc, '3g': g3, hss_esm } of entries) {
          await connection.execute(
            `INSERT INTO hss_data 
             (node_name, epc, \`3g\`, hss_esm) 
             VALUES (?, ?, ?, ?)`,
            [nodeName, epc, g3, hss_esm]
          );
        }
        console.log(`✅ ${entries.length} entrées importées depuis ${file}`);
      }
    }
  } catch (err) {
    console.error('❌ Erreur lors de l\'importation :', err.message);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
};

// Création de la table si elle n'existe pas
async function createTable() {
  const connection = await pool.getConnection();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS hss_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      epc VARCHAR(255) NOT NULL,
      \`3g\` VARCHAR(255) NOT NULL,
      hss_esm VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  connection.release();
}

// Exécution du script
(async () => {
  await createTable();
  await importHSSData();
})();