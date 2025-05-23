const mysql = require("mysql2");
const xlsx = require("xlsx");
const fs = require("fs");

// Liste des codes MCC et leurs pays correspondants
const mccToCountry = {
  '202': 'Greece',
  '204': 'Netherlands',
  '206': 'Belgium',
  '208': 'France',
  '212': 'Monaco',
  '213': 'Andorra',
  '214': 'Spain',
  '216': 'Hungary',
  '218': 'Bosnia and Herzegovina',
  '219': 'Croatia',
  '220': 'Serbia',
  '222': 'Italy',
  '226': 'Romania',
  '228': 'Switzerland',
  '230': 'Czech Republic',
  '231': 'Slovakia',
  '232': 'Austria',
  '234': 'United Kingdom',
  '235': 'United Kingdom',
  '238': 'Denmark',
  '240': 'Sweden',
  '242': 'Norway',
  '244': 'Finland',
  '246': 'Lithuania',
  '247': 'Latvia',
  '248': 'Estonia',
  '250': 'Russian Federation',
  '255': 'Ukraine',
  '257': 'Belarus',
  '259': 'Moldova',
  '260': 'Poland',
  '262': 'Germany',
  '266': 'Gibraltar',
  '268': 'Portugal',
  '270': 'Luxembourg',
  '272': 'Ireland',
  '274': 'Iceland',
  '276': 'Albania',
  '278': 'Malta',
  '280': 'Cyprus',
  '282': 'Georgia',
  '283': 'Armenia',
  '284': 'Bulgaria',
  '286': 'Turkey',
  '288': 'Faroe Islands',
  '290': 'Greenland',
  '292': 'San Marino',
  '293': 'Slovenia',
  '294': 'North Macedonia',
  '295': 'Liechtenstein',
  '297': 'Montenegro',
  '302': 'Canada',
  '308': 'Saint Pierre and Miquelon',
  '310': 'United States',
  '311': 'United States',
  '312': 'United States',
  '313': 'United States',
  '314': 'United States',
  '315': 'United States',
  '316': 'United States',
  '330': 'Puerto Rico',
  '332': 'United States Virgin Islands',
  '334': 'Mexico',
  '338': 'Jamaica',
  '340': 'Guadeloupe',
  '342': 'Barbados',
  '344': 'Antigua and Barbuda',
  '346': 'Cayman Islands',
  '348': 'British Virgin Islands',
  '350': 'Bermuda',
  '352': 'Grenada',
  '354': 'Montserrat',
  '356': 'Saint Kitts and Nevis',
  '358': 'Saint Lucia',
  '360': 'Saint Vincent and the Grenadines',
  '362': 'Curaçao',
  '363': 'Aruba',
  '364': 'Bahamas',
  '365': 'Anguilla',
  '366': 'Dominica',
  '368': 'Cuba',
  '370': 'Dominican Republic',
  '372': 'Haiti',
  '374': 'Trinidad and Tobago',
  '376': 'Turks and Caicos Islands',
  '400': 'Azerbaijan',
  '401': 'Kazakhstan',
  '402': 'Bhutan',
  '404': 'India',
  '405': 'India',
  '406': 'India',
  '410': 'Pakistan',
  '412': 'Afghanistan',
  '413': 'Sri Lanka',
  '414': 'Myanmar',
  '415': 'Lebanon',
  '416': 'Jordan',
  '417': 'Syrian Arab Republic',
  '418': 'Iraq',
  '419': 'Kuwait',
  '420': 'Saudi Arabia',
  '421': 'Yemen',
  '422': 'Oman',
  '423': 'Palestine',
  '424': 'United Arab Emirates',
  '425': 'Israel',
  '426': 'Bahrain',
  '427': 'Qatar',
  '428': 'Mongolia',
  '429': 'Nepal',
  '430': 'United Arab Emirates',
  '431': 'United Arab Emirates',
  '432': 'Iran',
  '434': 'Uzbekistan',
  '436': 'Tajikistan',
  '437': 'Kyrgyzstan',
  '438': 'Turkmenistan',
  '440': 'Japan',
  '441': 'Japan',
  '450': 'South Korea',
  '452': 'Vietnam',
  '454': 'Hong Kong',
  '455': 'Macao',
  '456': 'Cambodia',
  '457': 'Laos',
  '460': 'China',
  '461': 'China',
  '466': 'Taiwan',
  '467': 'North Korea',
  '470': 'Bangladesh',
  '472': 'Maldives',
  '502': 'Malaysia',
  '505': 'Australia',
  '510': 'Indonesia',
  '514': 'Timor-Leste',
  '515': 'Philippines',
  '520': 'Thailand',
  '525': 'Singapore',
  '528': 'Brunei',
  '530': 'New Zealand',
  '536': 'Nauru',
  '537': 'Papua New Guinea',
  '539': 'Tonga',
  '540': 'Solomon Islands',
  '541': 'Vanuatu',
  '542': 'Fiji',
  '543': 'Wallis and Futuna',
  '544': 'American Samoa',
  '545': 'Kiribati',
  '546': 'New Caledonia',
  '547': 'French Polynesia',
  '548': 'Cook Islands',
  '549': 'Samoa',
  '550': 'Micronesia',
  '551': 'Marshall Islands',
  '552': 'Palau',
  '553': 'Tuvalu',
  '554': 'Tokelau',
  '555': 'Niue',
  '602': 'Egypt',
  '603': 'Algeria',
  '604': 'Morocco',
  '605': 'Tunisia',
  '606': 'Libya',
  '607': 'Gambia',
  '608': 'Senegal',
  '609': 'Mauritania',
  '610': 'Mali',
  '611': 'Guinea',
  '612': 'Côte d\'Ivoire',
  '613': 'Burkina Faso',
  '614': 'Niger',
  '615': 'Togo',
  '616': 'Benin',
  '617': 'Mauritius',
  '618': 'Liberia',
  '619': 'Sierra Leone',
  '620': 'Ghana',
  '621': 'Nigeria',
  '622': 'Chad',
  '623': 'Central African Republic',
  '624': 'Cameroon',
  '625': 'Cape Verde',
  '626': 'Sao Tome and Principe',
  '627': 'Equatorial Guinea',
  '628': 'Gabon',
  '629': 'Congo',
  '630': 'Democratic Republic of the Congo',
  '631': 'Angola',
  '632': 'Guinea-Bissau',
  '633': 'Seychelles',
  '634': 'Sudan',
  '635': 'Rwanda',
  '636': 'Ethiopia',
  '637': 'Somalia',
  '638': 'Djibouti',
  '639': 'Kenya',
  '640': 'Tanzania',
  '641': 'Uganda',
  '642': 'Burundi',
  '643': 'Mozambique',
  '645': 'Zambia',
  '646': 'Madagascar',
  '647': 'Réunion',
  '648': 'Zimbabwe',
  '649': 'Namibia',
  '650': 'Malawi',
  '651': 'Lesotho',
  '652': 'Botswana',
  '653': 'Swaziland',
  '654': 'Comoros',
  '655': 'South Africa',
  '657': 'Eritrea',
  '658': 'Saint Helena',
  '659': 'South Sudan',
  '702': 'Belize',
  '704': 'Guatemala',
  '706': 'El Salvador',
  '708': 'Honduras',
  '710': 'Nicaragua',
  '712': 'Costa Rica',
  '714': 'Panama',
  '716': 'Peru',
  '722': 'Argentina',
  '724': 'Brazil',
  '730': 'Chile',
  '732': 'Colombia',
  '734': 'Venezuela',
  '736': 'Bolivia',
  '738': 'Guyana',
  '740': 'Ecuador',
  '742': 'French Guiana',
  '744': 'Paraguay',
  '746': 'Suriname',
  '748': 'Uruguay',
  '750': 'Falkland Islands'
};

// Connexion à MySQL
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "mon_projet_db",
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Erreur de connexion à MySQL :", err);
    return;
  }
  console.log("✅ Connecté à MySQL");
  importRoamingPartners();
});

function importRoamingPartners() {
  const filePath = "/Users/macbok/mon-projet/projet-test/mon-projet-back/MMEs IMSI-GT Roaming Partner MAPPING.xlsx";
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);

  if (data.length === 0) {
    console.log("⚠️ Aucune donnée trouvée dans le fichier.");
    return;
  }

  // Regrouper les données par opérateur et GT
  const groupedData = new Map();
  data.forEach(row => {
    const key = `${row['Operateur ']?.trim()}_${row['GT ']?.toString().trim()}`;
    if (!groupedData.has(key)) {
      const mcc = row.IMSI?.toString().substring(0, 3);
      groupedData.set(key, {
        imsi: row.IMSI?.toString(),
        gt: row['GT ']?.toString().trim(),
        operateur: row['Operateur ']?.trim(),
        mcc: mcc,
        country: mccToCountry[mcc] || 'Inconnu',
        allImsis: [row.IMSI?.toString()]
      });
    } else {
      groupedData.get(key).allImsis.push(row.IMSI?.toString());
    }
  });

  // Convertir en tableau
  const uniqueData = Array.from(groupedData.values());

  console.log("📊 Données regroupées (5 premiers exemples) :");
  console.log(uniqueData.slice(0, 5));
  console.log(`📈 Nombre d'entrées uniques : ${uniqueData.length}`);

  // Créer la table si elle n'existe pas
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS roaming_partners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      operateur VARCHAR(255),
      imsi_prefix VARCHAR(20),
      gt VARCHAR(20),
      mcc VARCHAR(3),
      mnc VARCHAR(3),
      country VARCHAR(100),
      bilateral TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error("❌ Erreur lors de la création de la table :", err);
      connection.end();
      return;
    }

    // Vider la table existante
    connection.query("TRUNCATE TABLE roaming_partners", (err) => {
      if (err) {
        console.error("❌ Erreur lors du vidage de la table :", err);
        connection.end();
        return;
      }

      // Préparer les données pour l'insertion
      const values = uniqueData.map(row => [
        row.operateur,  // operateur
        row.imsi,       // imsi_prefix
        row.gt,         // gt
        row.mcc,        // mcc (first 3 digits of IMSI)
        row.imsi.substring(3, 5),  // mnc (next 2 digits of IMSI)
        row.country,    // country (automatically detected)
        1              // bilateral (default to 1)
      ]);

      // Insérer les données
      const insertQuery = `
        INSERT INTO roaming_partners 
        (operateur, imsi_prefix, gt, mcc, mnc, country, bilateral)
        VALUES ?
      `;

      connection.query(insertQuery, [values], (err, result) => {
        if (err) {
          console.error("❌ Erreur lors de l'insertion des données :", err);
        } else {
          console.log(`✅ ${result.affectedRows} lignes insérées.`);
        }
        connection.end();
      });
    });
  });
}