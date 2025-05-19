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
    password: 'Aaa!121212',
    database: 'mon_projet_db',
    connectionLimit: 10
  },
  logFile: path.join(__dirname, 'ir21_import.log')
};

// Logger amélioré
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  fs.appendFileSync(config.logFile, logMessage);
  console[level === 'ERROR' ? 'error' : 'log'](message);
}

// Fonction d'extraction complète des données
async function extractDataFromXML(filePath) {
  try {
    const xmlContent = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Parsing XML
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

    // Extraction de la date depuis le nom du fichier
    const dateMatch = fileName.match(/_(\d{8})/);
    if (dateMatch) {
      const dateStr = dateMatch[1];
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      extractedData.date = `${year}-${month}-${day}`;
    }

    // Si pas de date dans le nom du fichier, essayer de l'extraire du contenu XML
    if (!extractedData.date) {
      if (fileHeader?.FileCreationDateTime) {
        const dateStr = fileHeader.FileCreationDateTime;
        // Format attendu: YYYYMMDDHHMMSS
        if (dateStr && dateStr.length >= 8) {
          const year = dateStr.substring(0, 4);
          const month = dateStr.substring(4, 6);
          const day = dateStr.substring(6, 8);
          extractedData.date = `${year}-${month}-${day}`;
        }
      }
    }

    for (const network of networkArray) {
      // Extraction E212 (MCC/MNC) - Format modifié pour concaténation simple
      const routingInfo = network.NetworkData?.RoutingInfoSection?.RoutingInfo || {};
      const e212Series = routingInfo.CCITT_E212_NumberSeries;
      if (e212Series) {
        const mcc = e212Series.MCC || '';
        const mnc = e212Series.MNC ? e212Series.MNC.padStart(2, '0') : '00';
        if (mcc && mnc) {
          extractedData.e212 += `${mcc}${mnc}`;  // Format changé ici
        }
      }

      // Extraction E214 - Format modifié pour concaténation simple
      const e214Series = routingInfo.CCITT_E214_MGT;
      if (e214Series) {
        const mgtCC = e214Series.MGT_CC || '';
        const mgtNC = e214Series.MGT_NC || '';
        if (mgtCC && mgtNC) {
          extractedData.e214 += `${mgtCC}${mgtNC}`;  // Format changé ici
        }
      }

      // Extraction APN (parcours de toutes les APNOperatorIdentifierList)
      let apnSet = new Set();
      // Recherche structurée dans toutes les APNOperatorIdentifierList
      function extractAPNsFromList(obj) {
        if (!obj) return;
        if (Array.isArray(obj)) {
          obj.forEach(extractAPNsFromList);
        } else if (typeof obj === 'object') {
          if (obj.APNOperatorIdentifierList) {
            extractAPNsFromList(obj.APNOperatorIdentifierList);
          }
          if (obj.APNOperatorIdentifierItem) {
            const items = Array.isArray(obj.APNOperatorIdentifierItem) ? obj.APNOperatorIdentifierItem : [obj.APNOperatorIdentifierItem];
            for (const item of items) {
              if (item.APNOperatorIdentifier) {
                apnSet.add(item.APNOperatorIdentifier.trim());
              }
            }
          }
          // Parcours récursif pour trouver d'autres listes imbriquées
          for (const key in obj) {
            if (typeof obj[key] === 'object') {
              extractAPNsFromList(obj[key]);
            }
          }
        }
      }
      extractAPNsFromList(network);
      // Si toujours rien, générer à partir du MCC/MNC
      if (apnSet.size === 0 && extractedData.e212) {
        const mccMatch = extractedData.e212.match(/mcc=(\d+)/);
        const mncMatch = extractedData.e212.match(/mnc=(\d+)/);
        if (mccMatch && mncMatch) {
          apnSet.add(`epc.mnc${mncMatch[1]}.mcc${mccMatch[1]}`);
        }
      }
      extractedData.apn = Array.from(apnSet).join(', ');

      // Extraction IPs et ranges (robuste, récursif, filtrage)
      function extractAllIPs(obj) {
        let ips = [];
        if (typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            if (!obj.hasOwnProperty(key)) continue;
            const value = obj[key];
            if ((key.toLowerCase().includes('ipaddressrange') || key.toLowerCase().includes('ipaddress')) && typeof value === 'string') {
              // Filtre : IPv4, IPv6, CIDR
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

    // Validation des données extraites
    if (!extractedData.e212 && !extractedData.e214 && !extractedData.apn && !extractedData.ips) {
      log(`Aucune donnée valide trouvée dans ${fileName}`, 'WARN');
      return null;
    }

    return extractedData;

  } catch (error) {
    log(`Erreur lors de l'extraction des données depuis ${path.basename(filePath)}: ${error.message}`, 'ERROR');
    return null;
  }
}

// Traitement principal
async function processFiles() {
  let db;
  try {
    db = await mysql.createConnection(config.db);
    log('Connecté à la base de données avec succès');

    const files = fs.readdirSync(config.inputDir)
      .filter(file => file.endsWith('.xml'))
      .map(file => path.join(config.inputDir, file));

    log(`Début du traitement de ${files.length} fichiers...`);

    for (const file of files) {
      try {
        const fileData = await extractDataFromXML(file);
        if (!fileData) continue;

        // Vérifier si l'enregistrement existe déjà
        const [existing] = await db.execute(
          'SELECT tadig FROM ir21_data WHERE tadig = ?', 
          [fileData.tadig]
        );

        if (existing.length > 0) {
          // Mise à jour de l'enregistrement existant
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
          // Insertion d'un nouvel enregistrement
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
        log(`Erreur lors du traitement de ${path.basename(file)}: ${error.message}`, 'ERROR');
      }
    }
  } catch (error) {
    log(`Erreur de connexion à la base de données: ${error.message}`, 'ERROR');
  } finally {
    if (db) await db.end();
    log('Traitement terminé');
  }
}

// Initialisation
function init() {
  try {
    fs.writeFileSync(config.logFile, ''); // Réinitialiser le fichier de log
    log('Démarrage du script IR21 Import');
    processFiles();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
}

init();
init();