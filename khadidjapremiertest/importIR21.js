const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const mysql = require('mysql2/promise');

// Configuration
const config = {
  inputDir: path.join(__dirname, 'IR21_xml'),
  db: {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'mon_projet_db',
    connectionLimit: 10
  },
  logFile: path.join(__dirname, 'ir21_import.log')
};

// Logger
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  fs.appendFileSync(config.logFile, logMessage);
  console[level === 'ERROR' ? 'error' : 'log'](message);
}

// Extraction XML
async function extractDataFromXML(filePath) {
  try {
    const xmlContent = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);

    const parser = new xml2js.Parser({
      explicitArray: false,
      mergeAttrs: true,
      ignoreAttrs: true,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    });

    const result = await parser.parseStringPromise(xmlContent);
    const raex = result.TADIGRAEXIR21;
    if (!raex) {
      log(`Structure TADIGRAEXIR21 non trouvée dans ${fileName}`, 'WARN');
      return null;
    }

    const fileHeader = raex.RAEXIR21FileHeader;
    const organisationInfo = raex.OrganisationInfo;
    if (!fileHeader || !organisationInfo) {
      log(`En-tête ou info organisation manquante dans ${fileName}`, 'WARN');
      return null;
    }

    const tadig = fileHeader.SenderTADIG || '';
    const pays = organisationInfo.CountryInitials || '';

    const networks = organisationInfo.NetworkList?.Network || [];
    const networkArray = Array.isArray(networks) ? networks : [networks];

    const extractedData = {
      tadig,
      pays,
      e212: '',
      e214: '',
      apn: '',
      ips: '',
      date: null
    };

    const dateMatch = fileName.match(/_(\d{8})/);
    if (dateMatch) {
      const [_, dateStr] = dateMatch;
      extractedData.date = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    } else if (fileHeader?.FileCreationDateTime) {
      const dateStr = fileHeader.FileCreationDateTime;
      if (dateStr.length >= 8) {
        extractedData.date = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
      }
    }

    for (const network of networkArray) {
      const routingInfo = network.NetworkData?.RoutingInfoSection?.RoutingInfo || {};

      const e212Series = routingInfo.CCITT_E212_NumberSeries;
      if (e212Series) {
        const mcc = e212Series.MCC || '';
        const mnc = e212Series.MNC ? e212Series.MNC.padStart(2, '0') : '00';
        if (mcc && mnc) extractedData.e212 += `${mcc}${mnc}`;
      }

      const e214Series = routingInfo.CCITT_E214_MGT;
      if (e214Series) {
        const mgtCC = e214Series.MGT_CC || '';
        const mgtNC = e214Series.MGT_NC || '';
        if (mgtCC && mgtNC) extractedData.e214 += `${mgtCC}${mgtNC}`;
      }

      let apnSet = new Set();

      function extractAPNs(obj) {
        if (!obj) return;
        if (Array.isArray(obj)) {
          obj.forEach(extractAPNs);
        } else if (typeof obj === 'object') {
          if (obj.APNOperatorIdentifierList) extractAPNs(obj.APNOperatorIdentifierList);
          if (obj.APNOperatorIdentifierItem) {
            const items = Array.isArray(obj.APNOperatorIdentifierItem) ? obj.APNOperatorIdentifierItem : [obj.APNOperatorIdentifierItem];
            for (const item of items) {
              if (item.APNOperatorIdentifier) {
                apnSet.add(item.APNOperatorIdentifier.trim());
              }
            }
          }
          for (const key in obj) {
            if (typeof obj[key] === 'object') extractAPNs(obj[key]);
          }
        }
      }

      extractAPNs(network);
      extractedData.apn = Array.from(apnSet).join(', ');

      function extractAllIPs(obj) {
        let ips = [];
        if (typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'string' && (key.toLowerCase().includes('ipaddressrange') || key.toLowerCase().includes('ipaddress'))) {
              if (/^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/.test(value) || /^[a-fA-F0-9:]+(\/\d{1,3})?$/.test(value)) {
                ips.push(value);
              }
            } else if (typeof value === 'object') {
              ips = ips.concat(extractAllIPs(value));
            }
          }
        } else if (Array.isArray(obj)) {
          for (const item of obj) {
            ips = ips.concat(extractAllIPs(item));
          }
        }
        return ips;
      }

      extractedData.ips = extractAllIPs(network).filter(Boolean).join(', ');
    }

    if (!extractedData.e212 && !extractedData.e214 && !extractedData.apn && !extractedData.ips) {
      log(`Aucune donnée valide trouvée dans ${fileName}`, 'WARN');
      return null;
    }

    return extractedData;

  } catch (error) {
    log(`Erreur lors de l'extraction depuis ${path.basename(filePath)}: ${error.message}`, 'ERROR');
    return null;
  }
}

// Création de la table si absente
async function createTableIfNotExists(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ir21_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tadig VARCHAR(20),
      pays VARCHAR(10),
      e212 TEXT,
      e214 TEXT,
      apn TEXT,
      ipaddress TEXT,
      date DATE
    )
  `);
}

// Traitement principal
async function processFiles() {
  let db;
  try {
    db = await mysql.createConnection(config.db);
    log('Connecté à la base de données avec succès');

    await createTableIfNotExists(db);

    const files = fs.readdirSync(config.inputDir)
      .filter(file => file.endsWith('.xml'))
      .map(file => path.join(config.inputDir, file));

    log(`Début du traitement de ${files.length} fichiers...`);

    for (const file of files) {
      try {
        const fileData = await extractDataFromXML(file);
        if (!fileData) continue;

        const [existing] = await db.execute(
          'SELECT tadig FROM ir21_data WHERE tadig = ?', 
          [fileData.tadig]
        );

        if (existing.length > 0) {
          await db.execute(
            `UPDATE ir21_data 
             SET pays = ?, e212 = ?, e214 = ?, apn = ?, ipaddress = ?, date = ?
             WHERE tadig = ?`,
            [
              fileData.pays,
              fileData.e212,
              fileData.e214,
              fileData.apn,
              fileData.ips,
              fileData.date,
              fileData.tadig
            ]
          );
          log(`Mise à jour réussie pour ${fileData.tadig}`, 'INFO');
        } else {
          await db.execute(
            `INSERT INTO ir21_data 
             (tadig, pays, e212, e214, apn, ipaddress, date) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              fileData.tadig,
              fileData.pays,
              fileData.e212,
              fileData.e214,
              fileData.apn,
              fileData.ips,
              fileData.date
            ]
          );
          log(`Insertion réussie pour ${fileData.tadig}`, 'INFO');
        }
      } catch (error) {
        log(`Erreur fichier ${path.basename(file)}: ${error.message}`, 'ERROR');
      }
    }

    // Nettoyage des APN
    await db.execute(
      "UPDATE ir21_data SET apn = SUBSTRING_INDEX(apn, ',', 1) WHERE apn LIKE '%,%'"
    );
    log('Nettoyage des APN effectué', 'INFO');

  } catch (error) {
    log(`Erreur de connexion à la base de données: ${error.message}`, 'ERROR');
  } finally {
    if (db) await db.end();
    log('Traitement terminé');
  }
}

// Lancement
function init() {
  try {
    fs.writeFileSync(config.logFile, '');
    log('Démarrage du script IR21 Import');
    processFiles();
  } catch (error) {
    console.error('Erreur d\'initialisation:', error);
  }
}

init();