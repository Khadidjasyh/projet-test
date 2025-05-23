const mysql = require("mysql2");
const xlsx = require("xlsx");
const path = require("path");

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Aaa!121212", // Mot de passe vide par défaut
  database: "mon_projet_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à MySQL :", err);
    return;
  }
  console.log("✅ Connecté à MySQL");
  importExcel();
});

function importExcel() {
  try {
    const filePath = path.join(__dirname, "Situation Globale.xlsx");
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
      console.log("⚠️ Aucune donnée trouvée dans le fichier.");
      return;
    }

    console.log("Premier enregistrement brut:", data[0]);

    const tableName = "situation_globales";

    // Création automatique de la table avec les colonnes dans le nouvel ordre
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pays VARCHAR(255),
        operateur VARCHAR(255),
        plmn VARCHAR(50),
        gsm VARCHAR(50),
        camel VARCHAR(50),
        gprs VARCHAR(50),
        troisg VARCHAR(50),
        lte VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    connection.query(createTableQuery, (err) => {
      if (err) {
        console.error("❌ Erreur lors de la création de la table :", err);
        return;
      }
      console.log("✅ Table créée ou déjà existante.");

      // Vider la table existante avant d'insérer les nouvelles données
      connection.query(`TRUNCATE TABLE ${tableName}`, (err) => {
        if (err) {
          console.error("❌ Erreur lors du vidage de la table :", err);
          return;
        }
        console.log("✅ Table vidée avec succès.");

        // Préparer les données pour l'insertion dans le nouvel ordre
        const values = data.map(row => {
          // Nettoyage des valeurs pour CAMEL et 4G/LTE
          const camelValue = row.CAMEL || row.Camel || row['CAMEL '] || row['Camel '] || null;
          const lteValue = row['4G/LTE'] || row['4G LTE'] || row.LTE || row['4G'] || row['LTE'] || null;

          // Nettoyage des espaces superflus
          const cleanValue = (val) => {
            if (val && typeof val === 'string') {
              return val.trim();
            }
            return val;
          };

          return [
            cleanValue(row.Country || row.Pays || null),
            cleanValue(row.Operator || row.Opérateur || row.Operateur || null),
            cleanValue(row.PLMN || null),
            cleanValue(row.GSM || null),
            cleanValue(camelValue),
            cleanValue(row.GPRS || null),
            cleanValue(row['3G'] || null),
            cleanValue(lteValue)
          ];
        });

        // Insertion des données avec les colonnes dans le nouvel ordre
        const insertQuery = `
          INSERT INTO ${tableName} 
          (pays, operateur, plmn, gsm, camel, gprs, troisg, lte)
          VALUES ?
        `;

        connection.query(insertQuery, [values], (err, result) => {
          if (err) {
            console.error("❌ Erreur lors de l'insertion des données :", err);
            console.error("Premier enregistrement qui a causé l'erreur:", values[0]);
          } else {
            console.log(`✅ ${result.affectedRows} lignes insérées.`);
            
            // Vérification des données insérées
            connection.query(`
              SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN camel IS NOT NULL AND camel != '' THEN 1 END) as avec_camel,
                COUNT(CASE WHEN lte IS NOT NULL AND lte != '' THEN 1 END) as avec_lte
              FROM ${tableName}
            `, (err, stats) => {
              if (!err && stats[0]) {
                console.log("\nStatistiques des données importées:");
                console.log(`Total des enregistrements: ${stats[0].total}`);
                console.log(`Enregistrements avec CAMEL: ${stats[0].avec_camel}`);
                console.log(`Enregistrements avec 4G/LTE: ${stats[0].avec_lte}`);
              }
              connection.end();
            });
          }
        });
      });
    });
  } catch (error) {
    console.error("❌ Erreur lors de la lecture du fichier Excel :", error);
    connection.end();
  }
} 