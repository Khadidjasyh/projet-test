const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Connexion à MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "bechafiyasmine",
  database: process.env.DB_NAME || "mon_projet_db"
});

// Vérification de la connexion
connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion MySQL :", err);
    return;
  }
  console.log("✅ Connecté à MySQL");
  
  // Démarrer l'importation
  importHuaweiNetworks();
});

async function importHuaweiNetworks() {
  console.log("🔄 Début de l'importation des réseaux Huawei...");
  
  // Supprimer toutes les données existantes
  await clearTable();
  
  // Insérer des données de test
  const networksData = [
    { imsi_prefix: '60201', msisdn_prefix: '20201', network_name: 'Mobilis Algeria', managed_object_group: 'Africa' },
    { imsi_prefix: '60202', msisdn_prefix: '20202', network_name: 'Djezzy Algeria', managed_object_group: 'Africa' },
    { imsi_prefix: '60203', msisdn_prefix: '20203', network_name: 'Ooredoo Algeria', managed_object_group: 'Africa' },
    { imsi_prefix: '21401', msisdn_prefix: '3401', network_name: 'Vodafone Spain', managed_object_group: 'Europe' },
    { imsi_prefix: '21402', msisdn_prefix: '3402', network_name: 'Movistar Spain', managed_object_group: 'Europe' },
    { imsi_prefix: '21403', msisdn_prefix: '3403', network_name: 'Orange Spain', managed_object_group: 'Europe' },
    { imsi_prefix: '31030', msisdn_prefix: '9030', network_name: 'AT&T USA', managed_object_group: 'Americas' },
    { imsi_prefix: '31031', msisdn_prefix: '9031', network_name: 'T-Mobile USA', managed_object_group: 'Americas' },
    { imsi_prefix: '41201', msisdn_prefix: '9201', network_name: 'STC Saudi Arabia', managed_object_group: 'Middle East' },
    { imsi_prefix: '41202', msisdn_prefix: '9202', network_name: 'Mobily Saudi Arabia', managed_object_group: 'Middle East' }
  ];
  
  await insertNetworksData(networksData);
  
  console.log("✅ Importation terminée");
  connection.end();
}

function clearTable() {
  return new Promise((resolve, reject) => {
    const query = "TRUNCATE TABLE huawei_mobile_networks";
    connection.query(query, (error) => {
      if (error) {
        console.error("❌ Erreur lors de la suppression des données:", error);
        reject(error);
        return;
      }
      console.log("🗑️ Table nettoyée");
      resolve();
    });
  });
}

function insertNetworksData(networks) {
  return new Promise((resolve, reject) => {
    if (networks.length === 0) {
      console.log("⚠️ Aucune donnée à insérer");
      resolve();
      return;
    }
    
    const values = networks.map(network => [
      network.imsi_prefix,
      network.msisdn_prefix,
      network.network_name,
      network.managed_object_group
    ]);
    
    const query = `
      INSERT INTO huawei_mobile_networks 
      (imsi_prefix, msisdn_prefix, network_name, managed_object_group) 
      VALUES ?
    `;
    
    connection.query(query, [values], (error, results) => {
      if (error) {
        console.error("❌ Erreur lors de l'insertion des données:", error);
        reject(error);
        return;
      }
      
      console.log(`✅ ${results.affectedRows} réseaux Huawei insérés avec succès`);
      resolve(results);
    });
  });
}

// Exécuter le script si appelé directement
if (require.main === module) {
  importHuaweiNetworks();
}

module.exports = importHuaweiNetworks;
