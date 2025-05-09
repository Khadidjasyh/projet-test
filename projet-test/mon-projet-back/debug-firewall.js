// Enregistrez ce script dans un fichier debug-firewall.js

const mysql = require('mysql2');
require('dotenv').config();

// Connexion à la base de données
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD || "1234",
  database: "mon_projet_db",
});

// Connexion et exécution de la requête
connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
    process.exit(1);
  }
  
  console.log("✅ Connecté à MySQL");
  
  // Vérifier la structure de la table
  connection.query("DESCRIBE firewall_ips", (error, results) => {
    if (error) {
      console.error("❌ Erreur lors de la description de la table:", error);
      connection.end();
      return;
    }
    
    console.log("=== STRUCTURE DE LA TABLE ===");
    console.table(results);
    
    // Compter les entrées
    connection.query("SELECT COUNT(*) as count FROM firewall_ips", (error, results) => {
      if (error) {
        console.error("❌ Erreur lors du comptage:", error);
        connection.end();
        return;
      }
      
      console.log(`=== NOMBRE D'ENTRÉES: ${results[0].count} ===`);
      
      // Récupérer quelques exemples
      connection.query("SELECT * FROM firewall_ips LIMIT 5", (error, results) => {
        if (error) {
          console.error("❌ Erreur lors de la récupération des exemples:", error);
          connection.end();
          return;
        }
        
        console.log("=== EXEMPLES D'ENTRÉES ===");
        console.table(results);
        
        // Terminer la connexion
        connection.end(() => {
          console.log("✅ Déconnecté de MySQL");
        });
      });
    });
  });
});