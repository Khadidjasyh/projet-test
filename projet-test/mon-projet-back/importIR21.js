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
      ips: ''
    };

    for (const network of networkArray) {
      // Extraction E212 (MCC/MNC)
      const routingInfo = network.NetworkData?.RoutingInfoSection?.RoutingInfo || {};
      const e212Series = routingInfo.CCITT_E212_NumberSeries;
      if (e212Series) {
        const mcc = e212Series.MCC || '';
        const mnc = e212Series.MNC ? e212Series.MNC.padStart(2, '0') : '00';
        if (mcc && mnc) {
          extractedData.e212 = `${mcc}${mnc}`;
        }
      }

      // Extraction E214
      const e214Series = routingInfo.CCITT_E214_MGT;
      if (e214Series) {
        const mgtCC = e214Series.MGT_CC || '';
        const mgtNC = e214Series.MGT_NC || '';
        if (mgtCC && mgtNC) {
          extractedData.e214 = `${mgtCC}${mgtNC}`;
        }
      }

      // Extraction APN (méthode robuste combinée)
      const packetInfo = network.PacketDataServiceInfoSection?.PacketDataServiceInfo || {};
      
      // Méthode 1: Recherche regex directe
      const apnRegex = /<APNOperatorIdentifier>(epc\.mnc\d{3}\.mcc\d{3})(?:\.3gppnetwork\.org)?<\/APNOperatorIdentifier>/i;
      const regexMatch = xmlContent.match(apnRegex);
      if (regexMatch && regexMatch[1]) {
        extractedData.apn = regexMatch[1];
      } else {
        // Méthode 2: Parsing XML classique
        const apnList = packetInfo.APNOperatorIdentifierList?.APNOperatorIdentifierItem || [];
        const apns = Array.isArray(apnList) ? apnList : [apnList];
        for (const apnItem of apns) {
          if (apnItem?.APNOperatorIdentifier?.includes('epc.mnc')) {
            extractedData.apn = apnItem.APNOperatorIdentifier.split('.3gppnetwork.org')[0];
            break;
          }
        }
      }

      // Extraction IP
      const ipSection = network.NetworkData?.GRXIPXRoutingForDataRoamingSection?.GRXIPXRoutingForDataRoaming || {};
      const ipRanges = ipSection.InterPMNBackboneIPList?.IPAddressOrRange || [];
      const ipList = Array.isArray(ipRanges) ? ipRanges : [ipRanges];
      extractedData.ips = ipList.map(ip => ip.IPAddressRange || ip.IPAddress).filter(Boolean).join(', ');
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
             SET pays = ?, e212 = ?, e214 = ?, apn = ?, ipaddress = ?
             WHERE tadig = ?`,
            [
              fileData.pays,
              fileData.e212,
              fileData.e214,
              fileData.apn,
              fileData.ips,
              fileData.tadig
            ]
          );
          log(`Mise à jour réussie pour ${fileData.tadig}`, 'INFO');
        } else {
          // Insertion d'un nouvel enregistrement
          await db.execute(
            `INSERT INTO ir21_data 
             (tadig, pays, e212, e214, apn, ipaddress) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              fileData.tadig,
              fileData.pays,
              fileData.e212,
              fileData.e214,
              fileData.apn,
              fileData.ips
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