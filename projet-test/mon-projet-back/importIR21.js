const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const mysql = require('mysql2/promise');

const directoryPath = path.join(__dirname, 'IR21_xml'); // Dossier contenant les fichiers XML

const connectionConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mon_projet_db',
};

async function extractDataFromXML(xml) {
  const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
  const result = await parser.parseStringPromise(xml);

  const raex = result['tadig-raex-21:TADIGRAEXIR21'];
  const fileHeader = raex?.RAEXIR21FileHeader;
  const organisationInfo = raex?.OrganisationInfo;

  if (!fileHeader || !organisationInfo) {
    console.warn('❌ Structure XML inattendue.');
    return null;
  }

  const tadig = fileHeader.SenderTADIG || '';
  const pays = organisationInfo.CountryInitials || '';

  const networks = organisationInfo.NetworkList?.Network || [];
  const networkArray = Array.isArray(networks) ? networks : [networks];

  const data = [];

  for (const network of networkArray) {
    const networkData = network.NetworkData || {};
    const packetInfoSection = network.PacketDataServiceInfoSection?.PacketDataServiceInfo || {};

    const e212List = networkData.CCITT_E212_NumberSeries || [];
    const e214List = networkData.CCITT_E214_MGT || [];

    const e212 = Array.isArray(e212List) ? e212List : [e212List];
    const e214 = Array.isArray(e214List) ? e214List : [e214List];

    const apnList = packetInfoSection.APNOperatorIdentifierList?.APNOperatorIdentifier || [];
    const apns = Array.isArray(apnList) ? apnList : [apnList];

    // ✅ Correction ici : IPs extraites depuis NetworkData
    const ipSection = networkData.GRXIPXRoutingForDataRoamingSection?.GRXIPXRoutingForDataRoaming;
    const ipRanges = ipSection?.InterPMNBackboneIPList?.IPAddressOrRange || [];
    const ipList = Array.isArray(ipRanges) ? ipRanges : [ipRanges];
    const ips = ipList.map(ip => ip.IPAddressRange).filter(Boolean);

    if (e212.length === 0 && e214.length === 0 && apns.length === 0 && ips.length === 0) {
      console.warn(`⚠️ Aucun champ utile trouvé pour cette ligne.`);
      continue;
    }

    data.push({
      tadig,
      pays,
      e212: e212.join(', '),
      e214: e214.join(', '),
      apns: apns.join(', '),
      ips: ips.join(', '),
    });
  }

  return data;
}

async function processFile(filePath, db) {
  const fileName = path.basename(filePath);
  console.log(`\n📂 Traitement du fichier : ${fileName}`);

  const xml = fs.readFileSync(filePath, 'utf8');

  try {
    const data = await extractDataFromXML(xml);
    if (!data || data.length === 0) {
      console.warn(`⚠️ Aucune entrée de données trouvée dans ce fichier.`);
      return;
    }

    for (const entry of data) {
      const { tadig, pays, e212, e214, apns, ips } = entry;
      await db.execute(
        'INSERT INTO ir21_data (tadig, pays, e212, e214, apn, ipaddress) VALUES (?, ?, ?, ?, ?, ?)',
        [tadig, pays, e212, e214, apns, ips]
      );
    }

    console.log(`✅ ${data.length} ligne(s) insérée(s).`);
  } catch (error) {
    console.error(`❌ Erreur lors du traitement du fichier : ${error.message}`);
  }
}

async function main() {
  const files = fs.readdirSync(directoryPath).filter((file) => file.endsWith('.xml'));

  const db = await mysql.createConnection(connectionConfig);
  console.log('✅ Connecté à la base de données');

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    await processFile(filePath, db);
  }

  console.log('\n✅ Tous les fichiers ont été traités.');
  await db.end();
}

main().catch(console.error);
