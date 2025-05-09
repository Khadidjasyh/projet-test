const { Sequelize } = require('sequelize');
require('dotenv').config();
const fs = require('fs');
const xml2js = require('xml2js');

// Configuration de la connexion à la base de données
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false
  }
);

// Modèle pour la table IR21
const IR21 = sequelize.define('ir21_table', {
  pays: {
    type: Sequelize.STRING,
    allowNull: false
  },
  operateur: {
    type: Sequelize.STRING,
    allowNull: false
  },
  plmn: {
    type: Sequelize.STRING,
    allowNull: false
  },
  gsm: {
    type: Sequelize.STRING,
    defaultValue: 'no'
  },
  gprs: {
    type: Sequelize.STRING,
    defaultValue: 'no'
  },
  troisg: {
    type: Sequelize.STRING,
    defaultValue: 'no'
  },
  lte: {
    type: Sequelize.STRING,
    defaultValue: 'no'
  },
  camel: {
    type: Sequelize.STRING,
    defaultValue: ''
  }
});

async function importIR21File(filePath) {
  try {
    // Lire le fichier XML
    const xmlData = fs.readFileSync(filePath, 'utf8');

    // Parser le XML
    const result = await xml2js.parseStringPromise(xmlData, { explicitArray: false });

    // Extraire les données
    const networkData = result['tadig-raex-21:TADIGRAEXIR21']?.OrganisationInfo?.NetworkList?.Network;
    const props = result['tadig-raex-21:TADIGRAEXIR21']?.OrganisationInfo?.TADIGSummaryList?.TADIGSummaryItem?.NetworkProperties;
    const organisation = result['tadig-raex-21:TADIGRAEXIR21']?.OrganisationInfo;

    // Extraire les technologies
    const gsm = networkData?.SupportedTechnologies?.GSM?.GSMFrequencyList?.GSMFrequencyItem ? 'yes' : 'no';
    const gprsItems = networkData?.PacketDataServiceInfoSection?.PacketDataServiceInfo?.DataServicesSupportedList?.DataServicesSupportedItem || [];
    const gprs = gprsItems.some(item => item?.DataServiceSupported2G?.DataService2G === 'GPRS') ? 'yes' : 'no';
    const troisg = gprsItems.some(item => item?.DataServicesSupported3G?.DataService3G) ? 'yes' : 'no';
    const apnItems = networkData?.PacketDataServiceInfoSection?.PacketDataServiceInfo?.APNOperatorIdentifierList?.APNOperatorIdentifierItem || [];
    const apns = Array.isArray(apnItems) ? apnItems.map(i => i.APNOperatorIdentifier) : [apnItems.APNOperatorIdentifier];
    const lte = apns.some(apn => apn.includes('epc.mnc') && apn.includes('3gppnetwork.org')) ? 'yes' : 'no';
    const camelVersions = networkData?.CAMELInfoSection?.CAMELInfo?.GSM_SSF_MSC?.CAP_Version_Supported_MSC?.CAP_Ver_Supp_MSC_Inbound?.CAP_MSCVersion || [];
    const camel = Array.isArray(camelVersions) ? camelVersions.join(', ') : camelVersions;

    // Extraire les informations de l'opérateur
    const pays = organisation?.CountryInitials || 'N/A';
    const operateur = networkData?.NetworkName || 'N/A';
    const mcc = props?.MCC || '';
    const mnc = props?.MNC || '';
    const plmn = mcc + mnc;

    // Créer ou mettre à jour l'enregistrement
    const [record, created] = await IR21.findOrCreate({
      where: { plmn },
      defaults: {
        pays,
        operateur,
        gsm,
        gprs,
        troisg,
        lte,
        camel
      }
    });

    // Mettre à jour les champs si l'enregistrement existait déjà
    if (!created) {
      await record.update({
        pays,
        operateur,
        gsm,
        gprs,
        troisg,
        lte,
        camel
      });
    }

    return {
      success: true,
      message: created ? 'Nouvel opérateur ajouté' : 'Opérateur mis à jour',
      data: {
        pays,
        operateur,
        plmn,
        gsm,
        gprs,
        troisg,
        lte,
        camel
      }
    };

  } catch (error) {
    console.error('Erreur lors de l\'import IR21:', error);
    throw new Error(`Erreur lors de l\'import IR21: ${error.message}`);
  }
}

// Exporter la fonction
module.exports = importIR21File;
