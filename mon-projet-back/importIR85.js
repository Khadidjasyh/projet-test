const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const mysql = require('mysql2/promise');

// Configuration
const config = {
  inputDir: path.join(__dirname, 'IR85_xml'),
  db: {
    host: 'localhost',
    user: 'root',
    password: 'Aaa!121212',
    database: 'mon_projet_db',
    connectionLimit: 10
  },
  logFile: path.join(__dirname, 'ir85_import.log')
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

    let raex = result.TADIGRAEXIR85 || result.TADIGRAEXIR21 || result.TADIG_RAEXFile || result.IR85 || result.File;

    if (!raex && typeof result === 'object') {
      const keys = Object.keys(result);
      if (keys.length > 0) {
        raex = result[keys[0]];
        log(`Structure alternative trouvée: ${keys[0]} dans ${fileName}`, 'INFO');
      }
    }

    if (!raex) {
      log(`Structure non trouvée dans ${fileName}. Clés disponibles: ${JSON.stringify(Object.keys(result))}`, 'WARN');
      return null;
    }

    const fileHeader = raex.RAEXIR85FileHeader || raex.RAEXIR21FileHeader || raex.FileHeader || raex.Header || {};
    const organisationInfo = raex.OrganisationInfo || raex.Organisation || raex.OperatorInfo || {};

    let networks = [];
    if (organisationInfo?.NetworkList?.Network) {
      networks = organisationInfo.NetworkList.Network;
    } else if (raex.NetworkList?.Network) {
      networks = raex.NetworkList.Network;
    } else if (raex.Networks?.Network) {
      networks = raex.Networks.Network;
    } else if (raex.Network) {
      networks = raex.Network;
    }

    const networkArray = Array.isArray(networks) ? networks : [networks];

    // ✅ TADIG réel (prioritaire sur Sender)
    let tadig = '';
    if (organisationInfo?.TADIGSummaryList?.TADIGSummaryItem) {
      const summary = organisationInfo.TADIGSummaryList.TADIGSummaryItem;
      if (Array.isArray(summary)) {
        tadig = summary[0]?.TADIGCode;
      } else {
        tadig = summary.TADIGCode;
      }
    }

    if (!tadig && networkArray?.[0]?.TADIGCode) {
      tadig = networkArray[0].TADIGCode;
    }

    if (!tadig) {
      tadig = fileHeader.SenderTADIG || fileHeader.TADIG || organisationInfo.TADIG || '';
    }

    const pays = organisationInfo.CountryInitials || organisationInfo.Country || organisationInfo.CountryCode || raex.Country || (tadig ? tadig.substring(0, 3) : '');

    const extractedData = {
      tadig,
      pays,
      e212: '',
      e214: '',
      apn: '',
      ips: ''
    };

    for (const network of networkArray) {
      // E212
      const e212Node = network.NetworkData?.RoutingInfoSection?.RoutingInfo?.CCITT_E212_NumberSeries || network.RoutingInfo?.E212 || network.E212;
      if (e212Node) {
        const mcc = e212Node.MCC || '';
        const mnc = (e212Node.MNC || '').padStart(2, '0');
        if (mcc && mnc) extractedData.e212 += `${mcc}${mnc}, `;
      }

      // E214
      const e214Node = network.NetworkData?.RoutingInfoSection?.RoutingInfo?.CCITT_E214_MGT || network.RoutingInfo?.E214 || network.E214;
      if (e214Node) {
        const cc = e214Node.MGT_CC || e214Node.CC || '';
        const nc = e214Node.MGT_NC || e214Node.NC || '';
        if (cc && nc) extractedData.e214 += `${cc}${nc}, `;
      }

      // ✅ APN avec regex + chemins alternatifs
      let apnFound = false;
      const apnRegex = /<APNOperatorIdentifier>(epc\.mnc\d{3}\.mcc\d{3})(?:\.3gppnetwork\.org)?<\/APNOperatorIdentifier>/i;
      const match = xmlContent.match(apnRegex);
      if (match && match[1]) {
        extractedData.apn += match[1] + ', ';
        apnFound = true;
      }

      if (!apnFound) {
        const apnCandidates = [];

        const list1 = network.PacketDataServiceInfoSection?.PacketDataServiceInfo?.APNOperatorIdentifierList?.APNOperatorIdentifierItem;
        if (list1) apnCandidates.push(...(Array.isArray(list1) ? list1 : [list1]));

        const list2 = network.APNList?.APN;
        if (list2) apnCandidates.push(...(Array.isArray(list2) ? list2 : [list2]));

        const list3 = network.APN;
        if (list3) apnCandidates.push(...(Array.isArray(list3) ? list3 : [list3]));

        for (const apnItem of apnCandidates) {
          const apnValue = typeof apnItem === 'string' ? apnItem : apnItem?.APNOperatorIdentifier || apnItem?.Value || '';
          if (apnValue && apnValue.includes('epc.mnc')) {
            extractedData.apn += apnValue.split('.3gppnetwork.org')[0] + ', ';
            apnFound = true;
          }
        }
      }

      // IP (GRX/IPX Routing Section)
      let ipRanges = [];
      const grx = network.NetworkData?.GRXIPXRoutingForDataRoamingSection?.GRXIPXRoutingForDataRoaming?.InterPMNBackboneIPList?.IPAddressOrRange;
      if (grx) ipRanges = grx;

      const ipArray = Array.isArray(ipRanges) ? ipRanges : [ipRanges];
      for (const ip of ipArray) {
        const val = typeof ip === 'string' ? ip : ip.IPAddressRange || ip.IPAddress || '';
        if (val) extractedData.ips += val + ', ';
      }
    }

    // Nettoyage des virgules
    for (let key of ['e212', 'e214', 'apn', 'ips']) {
      extractedData[key] = extractedData[key].replace(/, $/, '');
    }

    if (!extractedData.tadig) {
      log(`TADIG introuvable dans ${fileName}`, 'WARN');
      return null;
    }

    return extractedData;

  } catch (error) {
    log(`Erreur extraction ${filePath}: ${error.message}`, 'ERROR');
    return null;
  }
}

// Traitement principal
async function processFiles() {
  let db;
  try {
    db = await mysql.createConnection(config.db);
    log('Connecté à la base de données');

    const files = fs.readdirSync(config.inputDir).filter(f => f.endsWith('.xml')).map(f => path.join(config.inputDir, f));
    log(`Fichiers XML trouvés: ${files.length}`);

    for (const file of files) {
      try {
        const fileData = await extractDataFromXML(file);
        if (!fileData) continue;

        const [existing] = await db.execute('SELECT tadig FROM ir85_data WHERE tadig = ?', [fileData.tadig]);

        if (existing.length > 0) {
          await db.execute(`UPDATE ir85_data SET pays = ?, e212 = ?, e214 = ?, apn = ?, ipaddress = ? WHERE tadig = ?`, [
            fileData.pays,
            fileData.e212,
            fileData.e214,
            fileData.apn,
            fileData.ips,
            fileData.tadig
          ]);
          log(`Mise à jour : ${fileData.tadig}`);
        } else {
          await db.execute(`INSERT INTO ir85_data (tadig, pays, e212, e214, apn, ipaddress) VALUES (?, ?, ?, ?, ?, ?)`, [
            fileData.tadig,
            fileData.pays,
            fileData.e212,
            fileData.e214,
            fileData.apn,
            fileData.ips
          ]);
          log(`Insertion : ${fileData.tadig}`);
        }
      } catch (err) {
        log(`Erreur fichier ${file}: ${err.message}`, 'ERROR');
      }
    }
  } catch (err) {
    log(`Erreur DB: ${err.message}`, 'ERROR');
  } finally {
    if (db) await db.end();
    log('Traitement terminé');
  }
}

// Initialisation
function init() {
  try {
    if (!fs.existsSync(config.inputDir)) fs.mkdirSync(config.inputDir, { recursive: true });
    fs.writeFileSync(config.logFile, '');
    log('--- Démarrage du traitement IR85 ---');
    processFiles();
  } catch (e) {
    console.error('Erreur init:', e);
  }
}

init();
