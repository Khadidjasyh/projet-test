const fs = require('fs/promises');
const path = require('path');
const mysql = require('mysql2/promise');

const parseFirewallData = (text) => {
    let isInAddressSet = false;
    return text
      .split('\n')
      .filter(line => {
        // Skip address-set lines and entries inside address-set
        if (line.startsWith('address-set')) {
          isInAddressSet = true;
          return false;  // Skip address-set definition
        } else if (line.startsWith('}')) {
          isInAddressSet = false; // End of address-set
          return false;
        }
        
        // Process only address lines outside address-set
        if (isInAddressSet || !line.startsWith('address')) {
          return false;
        }
        
        const isValidLine = line.startsWith('address');
        if (isValidLine) {
          console.log(`Parsing line: ${line}`); // Debugging
        }
        return isValidLine;
      })
      .map(line => {
        const match = line.trim().match(/^address\s+(\S+)\s+([\d\.\/]+);?$/);        if (match) {
          console.log('MATCH:', match[1], match[2]);
        } else {
          console.log('NO MATCH:', line);
        }
        return match ? { nom: match[1], cidr_complet: match[2] } : null;
      })
      .filter(Boolean);
};


const importFirewallData = async () => {
  let db;
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'Aaa!121212',
      database: process.env.DB_NAME || 'mon_projet_db'
    });

    const filePath = path.join('C:/Users/HP/pfeNvFct/projet-test/mon-projet-back/', 'address entries Gi_FW.txt');
    
    // Check if the file exists before proceeding
    try {
      await fs.access(filePath);
      console.log(`File found at ${filePath}`);
    } catch (err) {
      console.error(`❌ File not found at ${filePath}`);
      return;  // Exit if the file is not found
    }

    const content = await fs.readFile(filePath, 'utf-8'); // Read file asynchronously
    const entries = parseFirewallData(content); // Parse firewall entries

    if (entries.length === 0) {
      console.log("No valid entries found to import.");
      return;
    }

    // Insert each entry into the database
    for (const { nom, cidr_complet } of entries) {
      console.log(`Inserting entry: ${nom}, ${cidr_complet}`); // Log the entries being inserted
      
      // Extraire adresse IP et longueur de masque du CIDR
      let adresse_ip = cidr_complet;
      let longueur_masque = 32; // Par défaut
      
      if (cidr_complet.includes('/')) {
        const parts = cidr_complet.split('/');
        adresse_ip = parts[0];
        longueur_masque = parseInt(parts[1], 10);
      }
      
      await db.query(
        'INSERT INTO firewall_ips (nom, adresse_ip, longueur_masque, cidr_complet) VALUES (?, ?, ?, ?)', // Insert query
        [nom, adresse_ip, longueur_masque, cidr_complet] // Data to insert
      );
    }

    console.log(`✅ Imported ${entries.length} entries`); // Log success message
  } catch (err) {
    console.error('❌ Error importing firewall data:', err.message); // Log error
  } finally {
    if (db) await db.end();
  }
};

importFirewallData(); // Run the function to import firewall data