const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise'); // Utilisation de mysql2/promise pour le support async/await

// Configuration de la connexion à la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "mon_projet_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const parseFirewallData = (text) => {
    let isInAddressSet = false;
    return text
      .split('\n')
      .filter(line => {
        if (line.startsWith('address-set')) {
          isInAddressSet = true;
          return false;
        } else if (line.startsWith('}')) {
          isInAddressSet = false;
          return false;
        }
        
        if (isInAddressSet || !line.startsWith('address')) {
          return false;
        }
        
        const isValidLine = line.startsWith('address');
        if (isValidLine) {
          console.log(`Parsing line: ${line}`);
        }
        return isValidLine;
      })
      .map(line => {
        const match = line.match(/^address\s+(\S+)\s+([\d\.\/]+);$/);
        return match ? { nom: match[1], cidr_complet: match[2] } : null;
      })
      .filter(Boolean);
};

const importFirewallData = async () => {
  let connection;
  try {
    connection = await pool.getConnection(); // Obtenir une connexion du pool
    
    const filePath = path.join(__dirname, 'address entries Gi_FW.txt');
    
    try {
      await fs.access(filePath);
      console.log(`File found at ${filePath}`);
    } catch (err) {
      console.error(`❌ File not found at ${filePath}`);
      return;
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const entries = parseFirewallData(content);

    if (entries.length === 0) {
      console.log("No valid entries found to import.");
      return;
    }

    for (const { nom, cidr_complet } of entries) {
      console.log(`Inserting entry: ${nom}, ${cidr_complet}`);
      
      let adresse_ip = cidr_complet;
      let longueur_masque = 32;
      
      if (cidr_complet.includes('/')) {
        const parts = cidr_complet.split('/');
        adresse_ip = parts[0];
        longueur_masque = parseInt(parts[1], 10);
      }
      
      // Utilisation de la connexion du pool
      await connection.execute(
        'INSERT INTO firewall_ips (nom, adresse_ip, longueur_masque, cidr_complet) VALUES (?, ?, ?, ?)',
        [nom, adresse_ip, longueur_masque, cidr_complet]
      );
    }

    console.log(`✅ Imported ${entries.length} entries`);
  } catch (err) {
    console.error('❌ Error importing firewall data:', err.message);
  } finally {
    if (connection) {
      connection.release(); // Libérer la connexion dans le pool
    }
    pool.end(); // Fermer le pool lorsque terminé
  }
};

importFirewallData();
