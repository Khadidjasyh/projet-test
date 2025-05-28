const mysql = require("mysql2");
const xlsx = require("xlsx");
const fs = require("fs");

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "mon_projet_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à MySQL :", err);
    return;
  }
  console.log("✅ Connecté à MySQL");
  importRoamingPartners();
});

function importRoamingPartners() {
  const filePath = "/Users/macbok/mon-projet/projet-test/mon-projet-back/MMEs IMSI-GT Roaming Partner MAPPING.xlsx";
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  if (data.length === 0) {
    console.log("⚠️ Aucune donnée trouvée dans le fichier.");
    return;
  }

  // Regrouper les données par opérateur et GT
  const groupedData = new Map();
  data.forEach(row => {
    const key = `${row['Operateur '].trim()}_${row['GT '].toString().trim()}`;
    if (!groupedData.has(key)) {
      groupedData.set(key, {
        imsi: row.IMSI.toString(),
        gt: row['GT '].toString().trim(),
        operateur: row['Operateur '].trim(),
        allImsis: [row.IMSI.toString()]
      });
    } else {
      groupedData.get(key).allImsis.push(row.IMSI.toString());
    }
  });

  // Convertir en tableau
  const uniqueData = Array.from(groupedData.values());

  console.log("📊 Données regroupées (5 premiers exemples) :");
  console.log(uniqueData.slice(0, 5));
  console.log(`📈 Nombre d'entrées uniques : ${uniqueData.length}`);

  // Créer la table si elle n'existe pas
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS roaming_partners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      operateur VARCHAR(255),
      imsi_prefix VARCHAR(20),
      gt VARCHAR(20),
      mcc VARCHAR(3),
      mnc VARCHAR(3),
      country VARCHAR(100),
      bilateral TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Erreur lors de la création de la table :", err);
      connection.end();
      return;
    }

    // Vider la table existante
    connection.query("TRUNCATE TABLE roaming_partners", (err) => {
      if (err) {
        console.error("❌ Erreur lors du vidage de la table :", err);
        connection.end();
        return;
      }

      // Préparer les données pour l'insertion
      const values = uniqueData.map(row => [
        row.operateur,  // operateur
        row.imsi,      // imsi_prefix
        row.gt,        // gt
        row.imsi.substring(0, 3),  // mcc (first 3 digits of IMSI)
        row.imsi.substring(3, 5),  // mnc (next 2 digits of IMSI)
        '',            // country (empty for now)
        1             // bilateral (default to 1)
      ]);

      // Insérer les données
      const insertQuery = `
        INSERT INTO roaming_partners 
        (operateur, imsi_prefix, gt, mcc, mnc, country, bilateral)
        VALUES ?
      `;

      connection.query(insertQuery, [values], (err, result) => {
        if (err) {
          console.error("❌ Erreur lors de l'insertion des données :", err);
        } else {
          console.log(`✅ ${result.affectedRows} lignes insérées.`);
        }
        connection.end();
      });
    });
  });
} 