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

    // TADIG
    let tadig = '';
    if (organisationInfo?.TADIGSummaryList?.TADIGSummaryItem) {
      const summary = organisationInfo.TADIGSummaryList.TADIGSummaryItem;
      tadig = Array.isArray(summary) ? summary[0]?.TADIGCode : summary.TADIGCode;
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
      ips: '',
      camelInbound: '',
      camelOutbound: ''
    };

    for (const network of networkArray) {
      // E212
      const e212Node = network.NetworkData?.RoutingInfoSection?.RoutingInfo?.CCITT_E212_NumberSeries || network.RoutingInfo?.E212 || network.E212;
      if (e212Node) {
        const mcc = e212Node.MCC || '';
        const mnc = (e212Node.MNC || '').padStart(2, '0');
        if (mcc && mnc) extractedData.e212 = `${mcc}${mnc}`;
      }

      // E214
      const e214Series = network.NetworkData?.RoutingInfoSection?.RoutingInfo?.CCITT_E214_MGT || network.RoutingInfo?.E214 || network.E214;
      if (e214Series) {
        const mgtCC = e214Series.MGT_CC || '';
        const mgtNC = e214Series.MGT_NC || '';
        if (mgtCC && mgtNC) extractedData.e214 = `${mgtCC}${mgtNC}`;
      }

      // APNs
      const apnSet = new Set();
      function extractAPNs(obj) {
        if (!obj) return;
        if (Array.isArray(obj)) obj.forEach(extractAPNs);
        else if (typeof obj === 'object') {
          if (obj.APNOperatorIdentifierList) extractAPNs(obj.APNOperatorIdentifierList);
          if (obj.APNOperatorIdentifierItem) {
            const items = Array.isArray(obj.APNOperatorIdentifierItem) ? obj.APNOperatorIdentifierItem : [obj.APNOperatorIdentifierItem];
            for (const item of items) {
              if (item?.APNOperatorIdentifier) apnSet.add(item.APNOperatorIdentifier.trim());
            }
          }
          for (const key in obj) {
            if (typeof obj[key] === 'object') extractAPNs(obj[key]);
          }
        }
      }
      extractAPNs(network);
      if (apnSet.size > 0) {
        extractedData.apn += Array.from(apnSet).join(', ') + ', ';
      }

      // IPs
      let ipRanges = [];
      const grx = network.NetworkData?.GRXIPXRoutingForDataRoamingSection?.GRXIPXRoutingForDataRoaming?.InterPMNBackboneIPList?.IPAddressOrRange;
      if (grx) ipRanges = grx;

      const ipArray = Array.isArray(ipRanges) ? ipRanges : [ipRanges];
      for (const ip of ipArray) {
        const val = typeof ip === 'string' ? ip : ip.IPAddressRange || ip.IPAddress || '';
        if (val) extractedData.ips += val + ', ';
      }

      // CAMEL Information
      const camelInfo = network.NetworkData?.CAMELInfoSection?.CAMELInfo;
      if (camelInfo) {
        // Inbound
        const inboundVersions = camelInfo.GSM_SSF_MSC?.CAP_Version_Supported_MSC?.CAP_Ver_Supp_MSC_Inbound?.CAP_MSCVersion;
        if (inboundVersions) {
          extractedData.camelInbound = Array.isArray(inboundVersions) 
            ? inboundVersions.join(', ') 
            : inboundVersions;
        }

        // Outbound
        const outboundVersions = camelInfo.GSM_SSF_MSC?.CAP_Version_Supported_MSC?.CAP_Ver_Supp_MSC_Outbound?.CAP_MSCVersion;
        if (outboundVersions) {
          extractedData.camelOutbound = Array.isArray(outboundVersions)
            ? outboundVersions.join(', ')
            : outboundVersions;
        }
      }
    }

    // Nettoyage des virgules
    for (let key of ['e212', 'e214', 'apn', 'ips', 'camelInbound', 'camelOutbound']) {
      if (extractedData[key]) {
        extractedData[key] = extractedData[key].replace(/, $/, '');
      }
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

// Création de la table si non existante
async function createTableIfNotExists(db) {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ir85_data (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tadig VARCHAR(20),
      pays VARCHAR(10),
      e212 TEXT,
      e214 TEXT,
      apn TEXT,
      ipaddress TEXT,
      camel_inbound TEXT,
      camel_outbound TEXT
    )
  `);
}

// Traitement principal
async function processFiles() {
  let db;
  try {
    db = await mysql.createConnection(config.db);
    log('Connecté à la base de données');
    await createTableIfNotExists(db);

    const files = fs.readdirSync(config.inputDir).filter(f => f.endsWith('.xml')).map(f => path.join(config.inputDir, f));
    log(`Fichiers XML trouvés: ${files.length}`);

    for (const file of files) {
      try {
        const fileData = await extractDataFromXML(file);
        if (!fileData) continue;

        const [existing] = await db.execute('SELECT tadig FROM ir85_data WHERE tadig = ?', [fileData.tadig]);

        if (existing.length > 0) {
          await db.execute(
            `UPDATE ir85_data 
             SET pays = ?, e212 = ?, e214 = ?, apn = ?, ipaddress = ?,
                 camel_inbound = ?, camel_outbound = ?
             WHERE tadig = ?`,
            [
              fileData.pays,
              fileData.e212,
              fileData.e214,
              fileData.apn,
              fileData.ips,
              fileData.camelInbound,
              fileData.camelOutbound,
              fileData.tadig
            ]
          );
          log(`Mise à jour : ${fileData.tadig}`);
        } else {
          await db.execute(
            `INSERT INTO ir85_data 
             (tadig, pays, e212, e214, apn, ipaddress, camel_inbound, camel_outbound) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              fileData.tadig,
              fileData.pays,
              fileData.e212,
              fileData.e214,
              fileData.apn,
              fileData.ips,
              fileData.camelInbound,
              fileData.camelOutbound
            ]
          );
          log(`Insertion : ${fileData.tadig}`);
        }
      } catch (err) {
        log(`Erreur fichier ${file}: ${err.message}`, 'ERROR');
      }
    }

    // Nettoyage APN (enlève ce qui suit la virgule)
    await db.execute(
      "UPDATE ir85_data SET apn = SUBSTRING_INDEX(apn, ',', 1) WHERE apn LIKE '%,%'"
    );
    log('Nettoyage des APN effectué');

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
module.exports = { extractDataFromXML };