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

// Regex pour épingler epc.mncXXX.mccYYY
const HSS_REGEX = /(epc\.mnc(\d+)\.mcc(\d+)).*?(3gp[^\s.]+).*?(HSS[^\s]*)/i;

// Parse une ligne de log HSS
const parseHSSData = (text) => {
  return text
    .split('\n')
    .map(line => {
      const match = line.match(HSS_REGEX);
      if (!match && line.includes('epc.') && line.includes('3gp') && line.includes('HSS')) {
        console.log('Non match:', line);
      }
      return match ? {
        epc: match[1].trim(),
        mnc: match[2],
        mcc: match[3],
        imsi_prefix: match[3] + match[2], // MCC + MNC
        '3g': match[4].trim(),
        hss_esm: match[5].trim()
      } : null;
    })
    .filter(Boolean);
};

// Création de la table si elle n'existe pas
async function createTable() {
  const connection = await pool.getConnection();
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS hss_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      epc VARCHAR(255) NOT NULL,
      imsi_prefix VARCHAR(10),
      \`3g\` VARCHAR(255) NOT NULL,
      hss_esm VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  connection.release();
}

// Nettoyage des imsi_prefix (supprime le 4ᵉ chiffre s'il est '0' et longueur = 6)
async function cleanIMSIprefix() {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(`
      UPDATE hss_data
      SET imsi_prefix = CONCAT(SUBSTRING(imsi_prefix, 1, 3), SUBSTRING(imsi_prefix, 5))
      WHERE LENGTH(imsi_prefix) = 6 AND SUBSTRING(imsi_prefix, 4, 1) = '0'
    `);
    console.log(`🔧 ${result.affectedRows} imsi_prefix nettoyés (4ᵉ chiffre = 0 et longueur = 6).`);
  } catch (err) {
    console.error('❌ Erreur lors du nettoyage des imsi_prefix :', err.message);
  } finally {
    connection.release();
  }
}

// Importation des fichiers HSS
const importHSSData = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const hssFolder = path.join(__dirname, 'hss');

    const files = await fs.readdir(hssFolder);

    for (const file of files) {
      if (path.extname(file) === '.log') {
        const filePath = path.join(hssFolder, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const entries = parseHSSData(content);

        for (const { epc, imsi_prefix, '3g': g3, hss_esm } of entries) {
          await connection.execute(
            `INSERT INTO hss_data 
             (epc, imsi_prefix, \`3g\`, hss_esm) 
             VALUES (?, ?, ?, ?)`,
            [epc, imsi_prefix, g3, hss_esm]
          );
        }
        console.log(`✅ ${entries.length} entrées importées depuis ${file}`);
      }
    }

    // Nettoyer les nouveaux imsi_prefix après import
    await cleanIMSIprefix();

  } catch (err) {
    console.error('❌ Erreur lors de l\'importation :', err.message);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
};

// Exécution du script principal
(async () => {
  await createTable();
  await importHSSData();
})();