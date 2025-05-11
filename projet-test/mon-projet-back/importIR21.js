const fs = require('fs');
const xml2js = require('xml2js');
const mysql = require('mysql2/promise');
const path = require('path');

// Configuration de la connexion à la base de données
const connection = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "mon_projet_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Créer la table si elle n'existe pas
async function createTableIfNotExists() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ir21_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pays VARCHAR(255) NOT NULL,
        operateur VARCHAR(255) NOT NULL,
        plmn VARCHAR(255) NOT NULL,
        gsm VARCHAR(255) DEFAULT 'no',
        gprs VARCHAR(255) DEFAULT 'no',
        troisg VARCHAR(255) DEFAULT 'no',
        lte VARCHAR(255) DEFAULT 'no',
        camel VARCHAR(255) DEFAULT '',
        mcc VARCHAR(255),
        mnc VARCHAR(255),
        epcrealm VARCHAR(255),
        imsi VARCHAR(255),
        parametres_lte JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_plmn (plmn)
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('✅ Table ir21_table vérifiée/créée avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la création de la table:', error);
    throw error;
  }
}

async function importIR21File(filePath) {
  console.log('=== Début de l\'import du fichier IR21 ===');
  console.log('Chemin du fichier:', filePath);

  try {
    // Vérifier/créer la table
    await createTableIfNotExists();

    // Vérifier si le fichier existe
    if (!fs.existsSync(filePath)) {
      throw new Error(`Le fichier n'existe pas: ${filePath}`);
    }

    // Lire le contenu du fichier
    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log('Fichier lu avec succès, taille:', fileContent.length);

    // Vérifier si le contenu est un XML valide
    if (!fileContent.trim().startsWith('<?xml')) {
      throw new Error('Le fichier ne semble pas être un XML valide');
    }

    // Parser le XML
    const parser = new xml2js.Parser({ 
      explicitArray: false,
      mergeAttrs: true,
      valueProcessors: [xml2js.processors.parseBooleans]
    });
    
    console.log('Début du parsing XML...');
    const parsedXml = await parser.parseStringPromise(fileContent);
    console.log('XML parsé avec succès');

    // Vérifier la structure du XML
    if (!parsedXml || !parsedXml['tadig-raex-21:TADIGRAEXIR21']) {
      console.error('Structure XML reçue:', JSON.stringify(parsedXml, null, 2));
      throw new Error('Structure XML invalide: élément tadig-raex-21:TADIGRAEXIR21 manquant');
    }

    const ir21Data = parsedXml['tadig-raex-21:TADIGRAEXIR21'];
    const networkData = ir21Data.OrganisationInfo?.NetworkList?.Network;
    
    if (!networkData) {
      throw new Error('Données réseau manquantes dans le fichier IR21');
    }

    // Extraire les données
    const data = {
      pays: ir21Data.OrganisationInfo?.CountryInitials || '',
      operateur: networkData.NetworkName || '',
      plmn: networkData.PLMN || '',
      gsm: networkData.SupportedTechnologies?.GSM ? 'yes' : 'no',
      gprs: networkData.SupportedTechnologies?.GPRS ? 'yes' : 'no',
      troisg: networkData.SupportedTechnologies?.UMTS ? 'yes' : 'no',
      lte: networkData.SupportedTechnologies?.LTE ? 'yes' : 'no',
      camel: networkData.CAMELInfo?.CAPVersion || '',
      mcc: networkData.MCC || '',
      mnc: networkData.MNC || '',
      epcrealm: networkData.EPCRealm || '',
      imsi: networkData.IMSI || '',
      parametres_lte: JSON.stringify(networkData.LTEParameters || {})
    };

    console.log('Données extraites:', data);

    // Vérifier les données requises
    if (!data.pays || !data.operateur || !data.plmn) {
      throw new Error('Données manquantes: pays, operateur ou plmn requis');
    }

    // Insérer ou mettre à jour dans la base de données
    const query = `
      INSERT INTO ir21_table (
        pays, operateur, plmn, gsm, gprs, troisg, lte, camel,
        mcc, mnc, epcrealm, imsi, parametres_lte
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        pays = VALUES(pays),
        operateur = VALUES(operateur),
        gsm = VALUES(gsm),
        gprs = VALUES(gprs),
        troisg = VALUES(troisg),
        lte = VALUES(lte),
        camel = VALUES(camel),
        mcc = VALUES(mcc),
        mnc = VALUES(mnc),
        epcrealm = VALUES(epcrealm),
        imsi = VALUES(imsi),
        parametres_lte = VALUES(parametres_lte)
    `;

    const values = [
      data.pays,
      data.operateur,
      data.plmn,
      data.gsm,
      data.gprs,
      data.troisg,
      data.lte,
      data.camel,
      data.mcc,
      data.mnc,
      data.epcrealm,
      data.imsi,
      data.parametres_lte
    ];

    console.log('Exécution de la requête SQL avec les valeurs:', values);
    const [dbResult] = await connection.execute(query, values);
    console.log('Données enregistrées avec succès:', dbResult);

    return {
      success: true,
      message: 'Import réussi',
      data: {
        ...data,
        id: dbResult.insertId || dbResult.id
      }
    };

  } catch (error) {
    console.error('Erreur détaillée lors de l\'import:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw new Error(`Erreur lors de l'import du fichier IR21: ${error.message}`);
  }
}

module.exports = importIR21File;
