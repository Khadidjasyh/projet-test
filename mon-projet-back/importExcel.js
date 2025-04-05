// importExcel.js
const mysql = require("mysql2");
const xlsx = require("xlsx");
const fs = require("fs");

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234", // 🔁 à adapter si besoin
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
  const filePath = "./Situation Globale.xlsx"; // 📌 Ton fichier
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  if (data.length === 0) {
    console.log("⚠️ Aucune donnée trouvée dans le fichier.");
    return;
  }

  // 🔍 Liste des colonnes à partir du premier objet
  const columns = Object.keys(data[0]);
  const tableName = "situation_globale";

  // Création automatique de la table
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ${columns
        .map((col) => `\`${col}\` TEXT`)
        .join(",\n      ")}
    );
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Erreur lors de la création de la table :", err);
      return;
    }
    console.log("✅ Table créée ou déjà existante.");

    // Insertion des données
    const insertQuery = `
      INSERT INTO ${tableName} (${columns.map((c) => `\`${c}\``).join(", ")})
      VALUES ?
    `;

    const values = data.map((row) => columns.map((col) => row[col] || null));

    connection.query(insertQuery, [values], (err, result) => {
      if (err) {
        console.error("❌ Erreur lors de l'insertion des données :", err);
      } else {
        console.log(`✅ ${result.affectedRows} lignes insérées.`);
      }
      connection.end();
    });
  });
}
