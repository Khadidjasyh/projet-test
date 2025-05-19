const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

// Configuration de la base
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Aaa!121212',
    database: process.env.DB_NAME || 'mon_projet_db'
};

// Parse le contenu d'un fichier Huawei MSS
const parseHuaweiMSSData = (text) => {
    console.log('Début du parsing du fichier Huawei MSS');
    const lines = text.split('\n');
    const data = [];

    // Pattern pour les lignes de données Huawei MSS
    // Format attendu: IMSI_PREFIX MSISDN_PREFIX NETWORK_NAME MANAGED_OBJECT_GROUP
    const regex = /^\s*(\d+)\s+(\d+)\s+(.+?)\s{2,}(\S+)\s*$/;

    for (const line of lines) {
        if (!line.trim()) continue; // Ignorer les lignes vides
        
        console.log('Analyse de la ligne:', line);
        const match = line.match(regex);
        
        if (match) {
            const [, imsi_prefix, msisdn_prefix, network_name, managed_object_group] = match;
            const entry = {
                imsi_prefix: imsi_prefix.trim(),
                msisdn_prefix: msisdn_prefix.trim(),
                network_name: network_name.trim(),
                managed_object_group: managed_object_group.trim(),
                node_name: path.basename(file.path, path.extname(file.path)) // Utiliser le nom du fichier comme node_name
            };
            console.log('Données extraites:', entry);
            data.push(entry);
        } else {
            console.log('Ligne ignorée - format non correspondant:', line);
        }
    }

    console.log(`Nombre total d'entrées parsées: ${data.length}`);
    return data;
};

// Fonction principale d'import
const importHuaweiMSSData = async (file) => {
    console.log('Début de l\'importation du fichier:', file.originalname);
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connexion à la base de données établie');

        const content = await fs.readFile(file.path, 'utf-8');
        console.log('Fichier lu avec succès, taille:', content.length);

        const entries = parseHuaweiMSSData(content);
        console.log(`Nombre d'entrées à importer: ${entries.length}`);

        if (entries.length === 0) {
            throw new Error('Aucune donnée valide trouvée dans le fichier');
        }

        const insertQuery = `
      INSERT INTO huawei_mobile_networks 
            (imsi_prefix, msisdn_prefix, network_name, managed_object_group, node_name)
            VALUES (?, ?, ?, ?, ?)
        `;

        let successCount = 0;
        for (const entry of entries) {
            try {
                await connection.execute(insertQuery, [
                    entry.imsi_prefix,
                    entry.msisdn_prefix,
                    entry.network_name,
                    entry.managed_object_group,
                    entry.node_name
                ]);
                successCount++;
                console.log(`✔️  Importé : ${entry.imsi_prefix} - ${entry.network_name}`);
            } catch (err) {
                console.error(`❌ Erreur d'import [${entry.imsi_prefix}] :`, err.message);
            }
        }

        await connection.end();
        console.log(`Importation terminée : ${successCount} entrées importées avec succès`);
        
        return {
            success: true,
            message: `Importation terminée : ${successCount} entrées importées avec succès`
        };
    } catch (err) {
        console.error('❌ Erreur globale :', err.message);
        return {
            success: false,
            error: err.message
        };
    }
};

module.exports = {
    importHuaweiMSSData
};
