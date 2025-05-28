const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

const app = express();


app.use(cors({
  origin: '*', // Permettre toutes les origines pendant le développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Create a single MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "bechafiyasmine",
  database: "mon_projet_db",
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Connection error:", err);
  } else {
    console.log("Successfully connected to database");

    // Show existing tables
    db.query("SHOW TABLES", (err, results) => {
      if (err) console.error("Error checking tables:", err);
      else console.log("Existing tables:", results);
    });
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});



// Controller function
function getDashboardStats(req, res) {
  db.query("SELECT COUNT(*) AS total_alerts FROM alerts", (err, alerts) => {
    if (err) return res.status(500).json({ error: "Erreur interne du serveur" });

    db.query("SELECT COUNT(*) AS total_reports FROM audit_reports", (err, reports) => {
      if (err) return res.status(500).json({ error: "Erreur interne du serveur" });

      db.query("SELECT COUNT(*) AS total_partners FROM roaming_partners", (err, partners) => {
        if (err) return res.status(500).json({ error: "Erreur interne du serveur" });

        db.query("SELECT COUNT(*) AS total_operators FROM mobile_networks", (err, operators) => {
          if (err) return res.status(500).json({ error: "Erreur interne du serveur" });

          res.status(200).json({
            errorsDetected: alerts[0].total_alerts,
            totalAudits: partners[0].total_partners,
            partnersConnected: reports[0].total_reports,
            pendingTasks: operators[0].total_operators,
          });
        });
      });
    });
  });
}

// Route
app.get("/dashboard/stats", getDashboardStats);


app.get('/api/map/:type', (req, res) => {
  const type = req.params.type.toLowerCase(); // 'gsm' or 'camel'

  // 🛑 Validate type
  if (!['gsm', 'camel'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type' });
  }

  // 🌍 Country name corrections for Leaflet map compatibility
  const countryNameMap = {
    // Existing fixes
  'lybia': 'Libya',
  'bostwana': 'Botswana',
  'birmanie': 'Myanmar',
  'center africa': 'Central African Republic',
  'coast ivory': 'Ivory Coast',
  'unitedkingdom': 'United Kingdom',
  'rdc': 'Democratic Republic of the Congo',
  'congo': 'Republic of the Congo',
  'guinee': 'Guinea',
  'guinee equatoriale': 'Equatorial Guinea',
  'guinee bissau': 'Guinea-Bissau',
  'swaziland': 'Eswatini',
  'soudan': 'Sudan',
  'soudan du sud': 'South Sudan',
  'zimbabwee': 'Zimbabwe',
  'cap vert': 'Cape Verde',
  'tanzanie': 'Tanzania',
  'egypte': 'Egypt',
  'ethiopie': 'Ethiopia',
  'mauritanie': 'Mauritania',
  'seychelle': 'Seychelles',
  'maroc': 'Morocco',
  'algérie': 'Algeria',
  'tunisie': 'Tunisia',
  'nigerie': 'Nigeria',
  'niger': 'Niger',
  'zaire': 'Democratic Republic of the Congo',

  // Additional from the map (white countries likely missing)
  'venezuela': 'Venezuela',
  'surinam': 'Suriname',
  'guyana': 'Guyana',
  'haiti': 'Haiti',
  'dominican republic': 'Dominican Republic',
  'panama': 'Panama',
  'honduras': 'Honduras',
  'el salvador': 'El Salvador',
  'nicaragua': 'Nicaragua',
  'guatemala': 'Guatemala',
  'belize': 'Belize',
  'paraguay': 'Paraguay',
  'uruguay': 'Uruguay',
  'new zealand': 'New Zealand',
  'papua new guinea': 'Papua New Guinea',
  'north korea': 'North Korea',
  'south korea': 'South Korea',
  'nepal': 'Nepal',
  'bhutan': 'Bhutan',
  'laos': 'Laos',
  'mongolia': 'Mongolia',
  'tajikistan': 'Tajikistan',
  'kyrgyzstan': 'Kyrgyzstan',
  'armenia': 'Armenia',
  'azerbaijan': 'Azerbaijan',
  'georgia': 'Georgia',
  'palestine': 'Palestinian Territories',
  'yemen': 'Yemen',
  'oman': 'Oman',
  'qatar': 'Qatar',
  'bahrain': 'Bahrain',
  'kuwait': 'Kuwait',
  'uae': 'United Arab Emirates',
  'timor leste': 'Timor-Leste',
  'brunei': 'Brunei',
  'lesotho': 'Lesotho',
  'djibouti': 'Djibouti',
  'eritrea': 'Eritrea',
  'gabon': 'Gabon',
  'sao tome': 'Sao Tome and Principe',
  'malawi': 'Malawi',
  'zambia': 'Zambia',
  'mozambique': 'Mozambique',
  'algérie': 'Algeria',
  'arménie': 'Armenia',
  'azerbaïdjan': 'Azerbaijan',
  'bahrain': 'Bahrain',
  'belize': 'Belize',
  'birmanie': 'Myanmar',
  'bostwana': 'Botswana',
  'brunei': 'Brunei',
  'cap vert': 'Cape Verde',
  'center africa': 'Central African Republic',
  'coast ivory': 'Ivory Coast',
  'congo': 'Republic of the Congo',
  'djibouti': 'Djibouti',
  'el salvador': 'El Salvador',
  'egypte': 'Egypt',
  'equatorial guinea': 'Equatorial Guinea',
  'eritrea': 'Eritrea',
  'eswatini': 'Eswatini',
  'ethiopie': 'Ethiopia',
  'gabon': 'Gabon',
  'georgia': 'Georgia',
  'guatemala': 'Guatemala',
  'guinee': 'Guinea',
  'guinee bissau': 'Guinea-Bissau',
  'guinee equatoriale': 'Equatorial Guinea',
  'guyana': 'Guyana',
  'haiti': 'Haiti',
  'honduras': 'Honduras',
  'iraq': 'Iraq',
  'jibouti': 'Djibouti',
  'koweit': 'Kuwait',
  'laos': 'Laos',
  'lesotho': 'Lesotho',
  'lybia': 'Libya',
  'malawi': 'Malawi',
  'maroc': 'Morocco',
  'mauritanie': 'Mauritania',
  'mozambique': 'Mozambique',
  'nepal': 'Nepal',
  'niger': 'Niger',
  'nigerie': 'Nigeria',
  'north korea': 'North Korea',
  'oman': 'Oman',
  'palestine': 'Palestinian Territories',
  'panama': 'Panama',
  'paraguay': 'Paraguay',
  'rdc': 'Democratic Republic of the Congo',
  'republique du congo': 'Republic of the Congo',
  'sao tome': 'Sao Tome and Principe',
  'seychelle': 'Seychelles',
  'soudan': 'Sudan',
  'soudan du sud': 'South Sudan',
  'surinam': 'Suriname',
  'swaziland': 'Eswatini',
  'tanzanie': 'Tanzania',
  'timor leste': 'Timor-Leste',
  'tunisie': 'Tunisia',
  'uae': 'United Arab Emirates',
  'unitedkingdom': 'United Kingdom',
  'uruguay': 'Uruguay',
  'venezuela': 'Venezuela',
  'yemen': 'Yemen',
  'zaire': 'Democratic Republic of the Congo',
  'zambia': 'Zambia',
  'zimbabwee': 'Zimbabwe',
  


'république démocratique du congo': 'Democratic Republic of the Congo',
  'kosovo': 'Kosovo',
  'macédoine du nord': 'North Macedonia',
  'serbie': 'Serbia',
  'tanzanie': 'Tanzania',
  'bolivie': 'Bolivia',
  'suriname': 'Suriname',
  'sahara occidental': 'Western Sahara',
  'eswatini': 'Eswatini',
  'slovaquie': 'Slovakia',
  'tchad': 'Chad',
  'érythrée': 'Eritrea',
  'somaliland': 'Somaliland',
  'oman': 'Oman',
  'tchéquie': 'Czech Republic',
  'chypriote du nord': 'Northern Cyprus',
  'népal': 'Nepal',
  'bhoutan': 'Bhutan',
  'kirghizistan': 'Kyrgyzstan',
  'tadjikistan': 'Tajikistan',
  'cosmodrome de baïkonour': 'Kazakhstan' // installé au Kazakhstan
  };

  const query = `SELECT pays, ${type} FROM situation_globales`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err);
      return res.status(500).json({ error: 'Erreur MySQL' });
    }

    const mapData = {};

    results.forEach(row => {
      const rawCountry = row.pays?.toLowerCase().trim();
      const normalizedCountry = countryNameMap[rawCountry] || row.pays;

      const status = row[type]?.toLowerCase();
      if (!status || status === '') {
        mapData[normalizedCountry] = 'no_agreement'; // GRAY
      } else if (status.includes('bilateral')) {
        mapData[normalizedCountry] = 'ok'; // GREEN
      } else {
        mapData[normalizedCountry] = 'issue'; // RED
      }
    });

    res.json(mapData);
  });
});


// Get recent critical alerts
function getCriticalAlerts(req, res) {
  db.query(
    "SELECT id, message, timestamp FROM alerts WHERE severity = 'critique' ORDER BY timestamp DESC LIMIT 10",
    (err, results) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
      // Optionally, map to match your frontend expectations
      const mapped = results.map(row => ({
        operateur: 'Critique', // or any placeholder, since you have no operator field
        message: row.message,
        timestamp: row.timestamp
      }));
      res.json(mapped);
    }
  );
}

// Get recent audits with only title, date, status, total_issues
function getRecentAudits(req, res) {
  db.query(
    `SELECT 
        id AS audit_id, 
        title, 
        date, 
        status, 
        total_issues 
     FROM audit_reports 
     ORDER BY date DESC, time DESC 
     LIMIT 10`,
    (err, results) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
      res.json(results);
    }
  );
}

// Get recent test audits (last 10)
function getRecentTestAudits(req, res) {
  db.query(
    `SELECT 
        id AS audit_id, 
        name AS Name,
        
        description, 
        status AS Status
     FROM tests
     ORDER BY id 
     LIMIT 10`,
    (err, results) => {
      if (err) {
        console.error('SQL error:', err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
      res.json(results);
    }
  );
}

// Register routes BEFORE module.exports and app.listen
app.get('/dashboard/stats', getDashboardStats);
app.get('/dashboard/critical-alerts', getCriticalAlerts);
app.get('/dashboard/recent-audits', getRecentAudits);
app.get('/dashboard/recent-test-audits', getRecentTestAudits);

// Export only if needed elsewhere
module.exports = { getDashboardStats, getCriticalAlerts, getRecentAudits };

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
