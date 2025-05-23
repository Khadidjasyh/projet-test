require('dotenv').config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); 

// Importation des modules nécessaires
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");
const authRoutes = require('./routes/auth');
const firewallRoutes = require('./routes/firewall');
const User = require('./models/User');
const UserReport = require('./models/UserReport');
const { importHuaweiMSSData } = require('./importHuaweiNetworks');
const auditRoutes = require('./routes/auditRoutes');


const { exec } = require('child_process');
const { extractDataFromXML: extractIR85DataFromXML } = require('./importIR85');
const { parseHSSData, cleanIMSIprefix } = require('./importHssData');

// Configuration de la journalisation
const logStream = fs.createWriteStream(path.join(__dirname, 'server.log'), { flags: 'a' });

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(logMessage);
  logStream.write(logMessage);
};


// Initialisation de l'application Express
const app = express();
const PORT = 5178;

// Middleware
app.use(cors({
  origin: 'http://localhost:5177',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'user-id'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration des routes d'authentification
app.use('/api/auth', authRoutes);
// Ajout pour exposer /current-user à la racine
app.use('/', authRoutes);
app.use('/', firewallRoutes);

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    console.log('📁 Dossier de destination:', uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Garder le nom de fichier original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('🔍 Vérification du fichier:', {
      originalname: file.originalname,
      mimetype: file.mimetype
    });
    
    // Vérifier les types de fichiers acceptés
    const allowedTypes = ['.xml', '.pdf', '.ir21', '.txt', '.log'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      console.log('✅ Type de fichier accepté:', ext);
      cb(null, true);
    } else {
      console.error('❌ Type de fichier non supporté:', ext);
      cb(new Error('Format de fichier non supporté. Utilisez un fichier XML, PDF ou IR21.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Initialisation de la base de données
const sequelize = require('./database');

// Synchroniser les modèles avec la base de données
sequelize.sync({ force: false }) // force: false pour ne pas supprimer les données existantes
  .then(() => {
    console.log('Base de données synchronisée avec succès');
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation de la base de données:', err);
  });

// Connexion à MySQL
const connection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "mon_projet_db"
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log(' Connecté à MySQL');
});

// Configuration de Nodemailer pour Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Utilisation de la variable d'environnement
    pass: process.env.GMAIL_PASSWORD, // Utilisation de la variable d'environnement
  },
});

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware
// CORS: Autorise le frontend local
app.use(cors({
  origin: 'http://localhost:5177',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Fonction de validation d'e-mail
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}




const { parseImsiAnalysis, parseBNumberAnalysis, parseGTSeries, clearMssTables } = require('./importMssLogs'); // <-- garder UNE SEULE FOIS ce require

app.post('/api/upload-mss-ericsson', upload.single('file'), async (req, res) => {
  console.log('Route /api/upload-mss-ericsson appelée');

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Aucun fichier reçu.' });
  }

  console.log('Fichier reçu:', {
    originalname: req.file.originalname,
    path: req.file.path
  });

  const nodeName = path.basename(req.file.originalname, path.extname(req.file.originalname));
  try {
    

    const content = await fs.promises.readFile(req.file.path, 'utf8');

    // Vérification du format MSS Ericsson
    if (
      content.includes('IMSIS') ||
      content.includes('<anbsp:b=32;') ||
      content.includes('<c7gsp;')
    ) {
      console.log('Fichier MSS Ericsson valide, début du traitement...');

      

      console.log('Traitement terminé avec succès');
      res.json({ success: true, message: 'Fichier importé et traité avec succès.' });
    } else {
      console.warn('Fichier non reconnu comme MSS Ericsson');
      res.status(400).json({ success: false, message: 'Le fichier ne correspond pas au format MSS Ericsson attendu.' });
    }
  } catch (error) {
    console.error('Erreur lors du traitement:', error);
    res.status(500).json({ success: false, message: 'Erreur lors du traitement du fichier: ' + error.message });
  }
});

// Route pour gérer l'envoi du formulaire
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Validation des données
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: "L'adresse e-mail est invalide." });
  }

  // Enregistrer le message dans MySQL
  const query = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
  connection.query(query, [name, email, message], (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de l'enregistrement du message dans la base de données." });
    }

    console.log("Message enregistré avec succès dans MySQL");

    // Envoyer un e-mail via Gmail
    const mailOptions = {
      from: process.env.GMAIL_USER, // Utilisation de la variable d'environnement
      to: "sayahkhadidja7@gmail.com", // Destinataire de l'e-mail
      subject: "Nouveau message de contact",
      text: `
        Nom: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Erreur Nodemailer :", error);
        return res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail." });
      }
      console.log("E-mail envoyé :", info.response);
      res.status(200).json({ message: "Message enregistré et e-mail envoyé avec succès." });
    });
  });
});

// Route pour récupérer tous les messages (optionnel)
app.get("/messages", (req, res) => {
  const query = "SELECT * FROM contacts ORDER BY created_at DESC";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Erreur MySQL :", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des messages." });
    }
    res.status(200).json(results);
  });
});

// Route de test
app.get("/test", (req, res) => {
  console.log("Route /test appelée");
  res.json({ message: "Le serveur fonctionne correctement" });
});

// Route pour récupérer les partenaires roaming
app.get("/roaming-partners", (req, res) => {
  console.log("Route /roaming-partners appelée");
  
  // Vérifier si la connexion est active
  if (!connection) {
    console.error("❌ La connexion MySQL n'est pas initialisée");
    return res.status(500).json({ 
      error: "Erreur de connexion à la base de données",
      details: "La connexion MySQL n'est pas initialisée"
    });
  }

  const query = "SELECT id, imsi_prefix, gt, operateur, mcc, mnc, country, bilateral FROM roaming_partners WHERE imsi_prefix IS NOT NULL AND gt IS NOT NULL AND operateur IS NOT NULL ORDER BY id";
  console.log("Exécution de la requête SQL:", query);
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL:", error);
      return res.status(500).json({ 
        error: "Erreur lors de la récupération des partenaires",
        details: error.message
      });
    }

    console.log(`✅ Nombre de partenaires trouvés: ${results.length}`);
    if (results.length > 0) {
      console.log("Premier partenaire:", results[0]);
    }
    res.status(200).json(results);
  });
});

// Endpoint pour récupérer les données de la situation globale
app.get('/situation-globale', (req, res) => {
  const query = `
    SELECT 
      id,
      pays,
      operateur,
      plmn,
      gsm,
      camel,
      gprs,
      troisg,
      lte
    FROM situation_globales
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des données:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
    res.json(results);
  });
});

app.get('/outbound-roaming', (req, res) => {
  const query = `
    SELECT 
      sg.pays, 
      sg.operateur, 
      sg.plmn,

      -- Résultat extraction IR21 / IR85
      CASE 
        WHEN i.tadig IS NOT NULL THEN 'réussit' 
        ELSE 'erreur' 
      END AS extraction_ir21,

      CASE 
        WHEN ir85.tadig IS NOT NULL THEN 'réussit'
        ELSE 'erreur'
      END AS extraction_ir85,

      -- Champs pour vérification APN/EPC
      COALESCE(i.apn, ir85.apn) AS apn,
      COALESCE(i.e212, ir85.e212) AS e212,

      -- Vérification GT (MSC/VLR)
      CASE
        WHEN COALESCE(i.e214, ir85.e214) IS NOT NULL AND COALESCE(i.e214, ir85.e214) != '' THEN 'reussi'
        ELSE 'aucun'
      END AS verification_gt_msc,

      h.epc,
      h.imsi_prefix,

      -- Comparaison flexible APN vs EPC
      CASE 
        WHEN (
          (i.apn IS NOT NULL AND (
            i.apn LIKE CONCAT('%', REPLACE(h.epc, 'epc.', ''), '%') 
            OR i.apn LIKE CONCAT('%', h.epc, '%')
          ))
          OR
          (ir85.apn IS NOT NULL AND (
            ir85.apn LIKE CONCAT('%', REPLACE(h.epc, 'epc.', ''), '%') 
            OR ir85.apn LIKE CONCAT('%', h.epc, '%')
          ))
        ) THEN 'correct'
        ELSE 'erreur'
      END AS comparaison_apn_epc,

      -- Extraction MCC/MNC depuis e212 format mccXXX.mncYYY
      SUBSTRING_INDEX(SUBSTRING_INDEX(COALESCE(i.e212, ir85.e212), '.', 1), 'mcc', -1) AS mcc,
      SUBSTRING_INDEX(SUBSTRING_INDEX(COALESCE(i.e212, ir85.e212), '.', -1), 'mnc', -1) AS mnc

    FROM situation_globales sg
    LEFT JOIN ir21_data i ON sg.plmn = i.tadig
    LEFT JOIN ir85_data ir85 ON sg.plmn = ir85.tadig
    LEFT JOIN hss_data h ON h.imsi_prefix IN (i.e212, ir85.e212)
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('❌ Erreur lors de la récupération des données Outbound Roaming:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    console.log(`✅ ${results.length} lignes récupérées pour Outbound Roaming`);
    res.json(results);
  });
});

app.get('/inbound-roaming-test', (req, res) => {
  const query = `
    SELECT 
      sg.operateur, 
      sg.pays, 
      GROUP_CONCAT(DISTINCT fw.cidr_complet SEPARATOR ', ') AS adresses_ip_firewall,
      GROUP_CONCAT(DISTINCT ir21.ipaddress SEPARATOR ', ') AS adresses_ip_ir21,
      GROUP_CONCAT(DISTINCT ir85.ipaddress SEPARATOR ', ') AS adresses_ip_ir85,
      GROUP_CONCAT(DISTINCT mme.imsi SEPARATOR ', ') AS liste_imsis,
      GROUP_CONCAT(DISTINCT ir21.e212 SEPARATOR ', ') AS liste_e212
    FROM situation_globales sg
    LEFT JOIN FireWall_ips fw ON fw.nom LIKE CONCAT(sg.operateur, '%')
    LEFT JOIN ir21_data ir21 ON sg.plmn = ir21.tadig
    LEFT JOIN ir85_data ir85 ON sg.plmn = ir85.tadig
    LEFT JOIN mme_imsi_analysis mme ON mme.digits_to_add = ir21.e214
    WHERE fw.cidr_complet IS NOT NULL
    GROUP BY sg.operateur, sg.pays
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des données :', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    const processedResults = results.map(row => {
      // IP addresses arrays
      const firewall_ips = row.adresses_ip_firewall ? row.adresses_ip_firewall.split(', ') : [];
      const ir21_ips = row.adresses_ip_ir21 ? row.adresses_ip_ir21.split(', ') : [];
      const ir85_ips = row.adresses_ip_ir85 ? row.adresses_ip_ir85.split(', ') : [];

      // Test conformité IP
      const ir21_conform = firewall_ips.filter(ip => ir21_ips.some(ir21_ip => ir21_ip.includes(ip)));
      const ir85_conform = firewall_ips.filter(ip => ir85_ips.some(ir85_ip => ir85_ip.includes(ip)));

      const ir21_pct = firewall_ips.length ? Math.round((ir21_conform.length / firewall_ips.length) * 100) : 0;
      const ir85_pct = firewall_ips.length ? Math.round((ir85_conform.length / firewall_ips.length) * 100) : 0;

      // IMSI et E212 arrays
      const imsis = row.liste_imsis ? row.liste_imsis.split(', ') : [];
      const e212s = row.liste_e212 ? row.liste_e212.split(', ') : [];

      // Test conformité IMSI <-> E212 (par exemple : IMSI commence par E212)
      const imsi_conformes = imsis.filter(imsi => e212s.some(e212 => imsi.startsWith(e212)));

      const imsi_pct = imsis.length ? Math.round((imsi_conformes.length / imsis.length) * 100) : 0;

      // Commentaires
      let commentaire_ip = '';
      if ((ir21_pct + ir85_pct)/2 === 100) commentaire_ip = 'Toutes les IPs sont conformes';
      else if ((ir21_pct + ir85_pct)/2 > 0) commentaire_ip = 'Partiellement conformes';
      else commentaire_ip = 'Aucune IP conforme';

      let commentaire_imsi = '';
      if (imsi_pct === 100) commentaire_imsi = 'Toutes les IMSIs sont conformes';
      else if (imsi_pct > 0) commentaire_imsi = 'IMSI partiellement conformes';
      else commentaire_imsi = 'Aucune IMSI conforme';

      return {
        operateur: row.operateur,
        pays: row.pays,
        adresses_ip_firewall: firewall_ips,
        pourcentage_conformite_ir21: ir21_pct,
        pourcentage_conformite_ir85: ir85_pct,
        commentaire_ip: commentaire_ip,
        imsis_mme: imsis,
        e212_ir21: e212s,
        pourcentage_conformite_imsi: imsi_pct,
        commentaire_imsi: commentaire_imsi
      };
    });

    // Trie par conformité IP (peut être adapté pour IMSI aussi)
    processedResults.sort((a, b) => {
      const getScore = c => {
        if (c === 'Toutes les IPs sont conformes') return 3;
        if (c === 'Partiellement conformes') return 2;
        return 1;
      };
      return getScore(b.commentaire_ip) - getScore(a.commentaire_ip);
    });

    console.log(`✅ Résultat inbound roaming test avec IP + IMSI + e212 généré`);
    res.json(processedResults);
  });
});


app.get('/camel-outbound-analyse', (req, res) => {
  const query = `
    SELECT 
      sg.pays,
      sg.operateur,
      COALESCE(ir21.camel_outbound, ir85.camel_outbound) AS 'Valeur IR (IR.21/IR.85)',
      mi.anres_value AS 'Valeur observée (anres_value)',

      CASE
        WHEN (
          (ir21.camel_outbound LIKE '%CAPv1%' OR ir85.camel_outbound LIKE '%CAPv1%') AND mi.anres_value LIKE '%CAMEL-1%'
        ) OR (
          (ir21.camel_outbound LIKE '%CAPv2%' OR ir85.camel_outbound LIKE '%CAPv2%') AND mi.anres_value LIKE '%CAMEL-2%'
        ) OR (
          (ir21.camel_outbound LIKE '%CAPv3%' OR ir85.camel_outbound LIKE '%CAPv3%') AND mi.anres_value LIKE '%CAMEL-3%'
        )
        THEN 'Réussi'
        ELSE 'Échoué'
      END AS 'Résultat du test CAMEL Outbound',

      CASE
        WHEN (
          (ir21.camel_outbound LIKE '%CAPv1%' OR ir85.camel_outbound LIKE '%CAPv1%') AND mi.anres_value NOT LIKE '%CAMEL-1%'
        ) OR (
          (ir21.camel_outbound LIKE '%CAPv2%' OR ir85.camel_outbound LIKE '%CAPv2%') AND mi.anres_value NOT LIKE '%CAMEL-2%'
        ) OR (
          (ir21.camel_outbound LIKE '%CAPv3%' OR ir85.camel_outbound LIKE '%CAPv3%') AND mi.anres_value NOT LIKE '%CAMEL-3%'
        )
        THEN CONCAT('Mismatch : IR = ', COALESCE(ir21.camel_outbound, ir85.camel_outbound), ', Observé = ', mi.anres_value)
        ELSE 'Conforme - Les valeurs CAMEL Outbound sont cohérentes'
      END AS Commentaire

    FROM
      situation_globales sg
    LEFT JOIN
      roaming_partners rp ON sg.operateur = rp.operateur
    LEFT JOIN
      ir21_data ir21 ON sg.plmn = ir21.tadig
    LEFT JOIN
      ir85_data ir85 ON sg.plmn = ir85.tadig
    LEFT JOIN
      mss_imsi_analysis mi ON COALESCE(ir21.e212, ir85.e212) = mi.imsi_series
    WHERE
      ir21.camel_outbound IS NOT NULL OR ir85.camel_outbound IS NOT NULL
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('❌ Erreur MySQL :', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    console.log(`✅ ${results.length} résultats retournés.`);
    res.json(results);
  });
});


// Route pour récupérer les nœuds réseau
app.get("/network-nodes", (req, res) => {
  console.log("Route /network-nodes appelée");
  
  // Vérifier si la connexion est active
  if (!connection) {
    console.error("❌ La connexion MySQL n'est pas initialisée");
    return res.status(500).json({ 
      error: "Erreur de connexion à la base de données",
      details: "La connexion MySQL n'est pas initialisée"
    });
  }

  const query = "SELECT * FROM network_nodes ORDER BY node_type, node_name";
  console.log("Exécution de la requête SQL:", query);
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error("❌ Erreur MySQL:", error);
      return res.status(500).json({ 
        error: "Erreur lors de la récupération des nœuds réseau",
        details: error.message
      });
    }

    console.log(`✅ Nombre de nœuds trouvés: ${results.length}`);
    if (results.length > 0) {
      console.log("Premier nœud:", results[0]);
    }
    res.status(200).json(results);
  });
});

app.get('/mobile-networks', async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: process.env.MYSQL_PASSWORD || '1234',
      database: 'mon_projet_db'
    });
    const [rows] = await connection.execute('SELECT * FROM mobile_networks ORDER BY id DESC');
    await connection.end();
    res.json(rows);
  } catch (err) {
    console.error('❌ Erreur récupération mobile_networks:', err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des données' });
  }
});




// Routes for MSS data
app.get("/mss/nodes", (req, res) => {
  const query = "SELECT DISTINCT node_name FROM mss_imsi_analysis ORDER BY node_name";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des nœuds:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des nœuds" });
    }
    res.json(results.map(row => row.node_name));
  });
});
app.get("/mss/imsi-analysis", (req, res) => {
  const { node, page = 1, limit = 50 } = req.query;
  let query = "SELECT * FROM mss_imsi_analysis";
  const params = [];

  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  query += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), (Number(page) - 1) * Number(limit));

  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données IMSI:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données IMSI" });
    }
    res.json({ data: results });
  });
});

app.get("/mss/bnumber-analysis", (req, res) => {
  const { node, page = 1, limit = 50 } = req.query;
  let query = "SELECT * FROM mss_bnumber_analysis";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  query += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), (Number(page) - 1) * Number(limit));
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données B-Number:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données B-Number" });
    }
    res.json({ data: results });
  });
});

app.get("/mss/gt-series", (req, res) => {
  const { node, page = 1, limit = 50 } = req.query;
  let query = "SELECT * FROM mss_gt_series";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  query += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(Number(limit), (Number(page) - 1) * Number(limit));
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données GT Series:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données GT Series" });
    }
    res.json({ data: results });
  });
});

// Supprimer une ligne IMSI Analysis (clé = node_name + imsi_series)
app.delete('/mss/imsi-analysis', (req, res) => {
  const { node_name, imsi_series } = req.body;
  if (!node_name || !imsi_series) {
    return res.status(400).json({ error: 'node_name et imsi_series requis' });
  }
  connection.query(
    'DELETE FROM mss_imsi_analysis WHERE node_name = ? AND imsi_series = ?',
    [node_name, imsi_series],
    (err, result) => {
      if (err) {
        console.error('Erreur suppression IMSI:', err);
        return res.status(500).json({ error: 'Erreur lors de la suppression IMSI' });
      }
      res.json({ success: true });
    }
  );
});

// Supprimer une ligne B-Number Analysis (clé = node_name + b_number)
app.delete('/mss/bnumber-analysis', (req, res) => {
  const { node_name, b_number } = req.body;
  if (!node_name || !b_number) {
    return res.status(400).json({ error: 'node_name et b_number requis' });
  }
  connection.query(
    'DELETE FROM mss_bnumber_analysis WHERE node_name = ? AND b_number = ?',
    [node_name, b_number],
    (err, result) => {
      if (err) {
        console.error('Erreur suppression B-Number:', err);
        return res.status(500).json({ error: 'Erreur lors de la suppression B-Number' });
      }
      res.json({ success: true });
    }
  );
});

// Supprimer une ligne GT Series (clé = node_name + tt)
app.delete('/mss/gt-series', (req, res) => {
  const { node_name, tt } = req.body;
  if (!node_name || !tt) {
    return res.status(400).json({ error: 'node_name et tt requis' });
  }
  connection.query(
    'DELETE FROM mss_gt_series WHERE node_name = ? AND tt = ?',
    [node_name, tt],
    (err, result) => {
      if (err) {
        console.error('Erreur suppression GT Series:', err);
        return res.status(500).json({ error: 'Erreur lors de la suppression GT Series' });
      }
      res.json({ success: true });
    }
  );
});

// Route to get all unique node names from all tables
app.get('/mss/nodes', (req, res) => {
  const query = `
    SELECT DISTINCT node_name 
    FROM (
      SELECT node_name FROM mss_imsi_analysis
      UNION
      SELECT node_name FROM mss_bnumber_analysis
      UNION
      SELECT node_name FROM mss_gt_series
    ) AS combined_nodes
    ORDER BY node_name;
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching node names:', error);
      return res.status(500).json({ error: 'Error fetching node names' });
    }
    res.json(results.map(row => row.node_name));
  });
});



app.get('/hss', (req, res) => {
  console.log('GET /hss endpoint hit');
  connection.query('SELECT id, epc, imsi_prefix, `3g`, hss_esm FROM hss_data', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données HSS' });
    }
    console.log('Sending HSS data:', results);
    res.json({ data: results });
  });
});

app.post('/api/import-hss', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier uploadé' });
  }

  try {
    const filePath = req.file.path;
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const entries = parseHSSData(content);

    let successCount = 0;
    let errorCount = 0;

    for (const { epc, imsi_prefix, '3g': g3, hss_esm } of entries) {
      await new Promise((resolve) => {
        connection.query(
          'SELECT COUNT(*) AS count FROM hss_data WHERE epc = ? AND imsi_prefix = ? AND `3g` = ? AND hss_esm = ?',
          [epc, imsi_prefix, g3, hss_esm],
          (selectError, selectResults) => {
            if (selectError) {
              errorCount++;
              return resolve();
            }
            if (selectResults[0].count > 0) {
              // Déjà présent, on saute
              return resolve();
            }
            connection.query(
              'INSERT INTO hss_data (epc, imsi_prefix, `3g`, hss_esm) VALUES (?, ?, ?, ?)',
              [epc, imsi_prefix, g3, hss_esm],
              (insertError) => {
                if (insertError) errorCount++;
                else successCount++;
                resolve();
              }
            );
          }
        );
      });
    }

    // Nettoyage des imsi_prefix après import (optionnel)
    if (typeof cleanIMSIprefix === 'function') {
      await cleanIMSIprefix();
    }

    res.json({ success: true, message: `${successCount} entrées importées, ${errorCount} erreurs.` });
  } catch (error) {
    console.error('Erreur import HSS:', error);
    res.status(500).json({ error: 'Erreur lors de l\'import HSS', details: error.message });
  } finally {
    fs.unlink(req.file.path, () => {});
  }
});

app.delete('/api/hss/:id', (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: 'ID manquant' });
  }
  connection.query(
    'DELETE FROM hss_data WHERE id = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de la suppression HSS:', err);
        return res.status(500).json({ error: 'Erreur lors de la suppression HSS' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Entrée non trouvée' });
      }
      res.json({ success: true });
    }
  );
});

app.get('/ir21', async (req, res) => {
  try {
    // Utiliser connection au lieu de db
    connection.query('SELECT * FROM ir21_data', (err, results) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données IR21' });
      }
      console.log('Données IR21 envoyées:', results);
      res.json(results);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données IR21 :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Endpoint pour récupérer les données IR85
app.get('/ir85', async (req, res) => {
  try {
    connection.query('SELECT * FROM ir85_data', (err, results) => {
      if (err) {
        console.error('Erreur de base de données:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des données IR85' });
      }
      console.log('Données IR85 envoyées:', results);
      res.json(results);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données IR85 :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// Route pour l'importation des réseaux Huawei

// ✅ DELETE - Supprimer une entrée IR85

// ✅ DELETE - Supprimer une entrée IR21
app.delete('/api/ir21/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM ir21_data WHERE id = ?', [id], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
    res.json({ success: true, message: 'Entrée IR21 supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entrée IR21:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'entrée IR21' });
  }
});

app.delete('/api/ir85/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM ir85_data WHERE id = ?', [id], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
    res.json({ success: true, message: 'Entrée IR85 supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'entrée IR85:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression de l\'entrée IR85' });
  }
});
//--------------------------------------------------------------------------------------------------

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.post('/api/upload-huawei-networks', upload.single('file'), async (req, res) => {
  console.log('Route /api/upload-huawei-networks appelée');
  
  if (!req.file) {
    console.error('Aucun fichier n\'a été uploadé');
    return res.status(400).json({ 
      success: false,
      message: 'Aucun fichier n\'a été uploadé' 
    });
  }

  console.log('Fichier reçu:', {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: req.file.path
  });

  try {
    // Lire le contenu du fichier
    const content = await fs.promises.readFile(req.file.path, 'utf8');
    console.log('Contenu du fichier lu, taille:', content.length);

    // Parser les données
    const lines = content.split('\n');
    const huaweiData = [];
const nodeName = path.basename(req.file.originalname, path.extname(req.file.originalname));

    // Pattern pour les lignes de données Huawei
    const regex = /^\s*(\d+)\s+(\d+)\s+(.+?)\s{2,}(\S+)\s*$/;

    for (const line of lines) {
      if (!line.trim()) continue;
      
      console.log('Analyse de la ligne:', line);
      const match = line.match(regex);
      
      if (match) {
        const [, imsi_prefix, msisdn_prefix, network_name, managed_object_group] = match;
        huaweiData.push({
          imsi_prefix: imsi_prefix.trim(),
          msisdn_prefix: msisdn_prefix.trim(),
          network_name: network_name.trim(),
          managed_object_group: managed_object_group.trim(),
          node_name: nodeName
        });
      }
    }

    if (huaweiData.length === 0) {
      throw new Error('Aucune donnée valide trouvée dans le fichier');
    }

    console.log(`Nombre d'entrées à importer: ${huaweiData.length}`);

    // Insérer les données dans la base
    let successCount = 0;

for (const data of huaweiData) {
  try {
  await new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO mobile_networks (imsi_prefix, msisdn_prefix, network_name, managed_object_group, node_name) VALUES (?, ?, ?, ?, ?)',
        [data.imsi_prefix, data.msisdn_prefix, data.network_name, data.managed_object_group, data.node_name],
        (error) => {
          if (error) reject(error);
          else {
            successCount++;
      resolve();
          }
        }
      );
    });
  } catch (err) {
    console.error('Erreur lors de l\'insertion:', err);
  }
}

console.log(`Importation terminée : ${successCount} entrées importées avec succès`);
    res.json({ 
      success: true,
  message: `Importation terminée : ${successCount} entrées importées avec succès`
  });

} catch (error) {
console.error('Erreur lors de l\'import des réseaux Huawei:', error);
    res.status(500).json({ 
      success: false,
  error: 'Erreur lors de l\'import du fichier: ' + error.message
});
}
});


// Création de la table huawei_mobile_networks si elle n'existe pas
const createHuaweiNetworksTable = `
CREATE TABLE IF NOT EXISTS mobile_networks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    imsi_prefix VARCHAR(20),
    msisdn_prefix VARCHAR(20),
    network_name VARCHAR(255),
    managed_object_group VARCHAR(100),
    node_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createHuaweiNetworksTable, (error) => {
    if (error) {
        console.error('Erreur lors de la création de la table mobile_networks:', error);
    } else {
        console.log('Table huawei_mobile_networks créée ou déjà existante');
    }
});

//------------------------------------------------------------------------------------------------
// ✅ GET - Affichage avec date_ajout
app.get('/firewall-ips', (req, res) => {
  try {
    connection.query(
      'SELECT identifiant, nom, cidr_complet, date_ajout FROM firewall_ips ORDER BY identifiant DESC',
      (error, results) => {
        if (error) {
          console.log('Erreur récupération firewall IPs:', error);
          return res.status(500).json({ error: error.message });
        }
        res.json(results);
      }
    );
  } catch (err) {
    console.log('Erreur récupération firewall IPs:', err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST - Insertion avec date_ajout automatique
app.post('/api/upload-firewall', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = req.file.path;
    const content = await fs.promises.readFile(filePath, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.trim() && !line.startsWith('address-set') && !line.startsWith('}')) {
        const match = line.trim().match(/^address\s+(\S+)\s+([\d\.\/]+);?$/);
        if (match) {
          const [_, nom, cidr_complet] = match;
          let adresse_ip = cidr_complet;
          let longueur_masque = 32;

          if (cidr_complet.includes('/')) {
            const parts = cidr_complet.split('/');
            adresse_ip = parts[0];
            longueur_masque = parseInt(parts[1], 10);
          }

          await new Promise((resolve, reject) => {
            connection.query(
              'INSERT INTO firewall_ips (nom, adresse_ip, longueur_masque, cidr_complet, date_ajout) VALUES (?, ?, ?, ?, NOW())',
              [nom, adresse_ip, longueur_masque, cidr_complet],
              (error) => {
                if (error) reject(error);
                else resolve();
              }
            );
          });
        }
      }
    }

    res.json({ success: true, message: 'File uploaded and processed successfully' });
  } catch (error) {
    console.error('Error processing firewall file:', error);
    res.status(500).json({ error: 'Error processing firewall file' });
  }
});

// ✅ DELETE - Supprimer une IP
app.delete('/api/firewall-ips/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM firewall_ips WHERE identifiant = ?', [id], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    res.json({ success: true, message: 'Firewall entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting firewall entry:', error);
    res.status(500).json({ error: 'Error deleting firewall entry' });
  }
});

// Route pour supprimer une entrée MSS Huawei par id (numérique)
app.delete('/api/huawei-networks/:id', async (req, res) => {
  const id = req.params.id;
  console.log('Suppression MSS Huawei par id:', id);
  try {
    // Récupérer le node_name avant suppression pour supprimer le fichier associé
    const [rows] = await new Promise((resolve, reject) => {
      connection.query('SELECT node_name FROM mobile_networks WHERE id = ?', [id], (error, results) => {
        if (error) reject(error);
        else resolve([results]);
      });
    });
    const nodeName = rows.length > 0 ? rows[0].node_name : null;

    // Supprimer l'entrée de la base
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM mobile_networks WHERE id = ?', [id], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Supprimer les fichiers associés si node_name trouvé
    if (nodeName) {
      const huaweiDir = path.join(__dirname, 'MSS_Huawei');
      if (fs.existsSync(huaweiDir)) {
        const files = fs.readdirSync(huaweiDir);
        for (const file of files) {
          if (file.includes(nodeName)) {
            const filePath = path.join(huaweiDir, file);
            try {
              await fs.promises.unlink(filePath);
              console.log(`Fichier supprimé: ${filePath}`);
            } catch (error) {
              console.error(`Erreur lors de la suppression du fichier ${filePath}:`, error);
            }
          }
        }
      }
    }

    res.json({ success: true, message: 'Entrée MSS Huawei supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression MSS Huawei:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la suppression' });
  }
});

app.get("/mme-imsi", (req, res) => {
  console.log('Requête reçue sur /mme-imsi avec les paramètres:', req.query);
  
  // Vérifier la connexion à la base de données
  if (!connection || connection.state === 'disconnected') {
    console.error('Erreur: Pas de connexion à la base de données');
    return res.status(500).json({ error: 'Database connection error' });
  }

  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit);
  if (isNaN(limit)) limit = 50;
  const offset = (page - 1) * limit;
  const searchTerm = req.query.search || '';

  console.log(`Paramètres de pagination - page: ${page}, limit: ${limit}, offset: ${offset}, search: '${searchTerm}'`);

  // Vérifier si la table existe
  const checkTableQuery = `SHOW TABLES LIKE 'mme_imsi_analysis'`;
  
  connection.query(checkTableQuery, (tableErr, tableResults) => {
    if (tableErr) {
      console.error('Erreur lors de la vérification de la table:', tableErr);
      return res.status(500).json({ error: 'Database error checking table' });
    }

    if (tableResults.length === 0) {
      console.error('La table mme_imsi_analysis n\'existe pas dans la base de données');
      return res.status(404).json({ error: 'Table mme_imsi_analysis not found' });
    }

    let query;
    let queryParams;
    if (limit <= 0) {
      // Pas de limite : on retire LIMIT/OFFSET
      query = [
        "SELECT * FROM mme_imsi_analysis",
        "WHERE imsi LIKE ? OR misc_info1 LIKE ?",
        "ORDER BY imsi"
      ].join(' ');
      queryParams = [
        `%${searchTerm}%`,
        `%${searchTerm}%`
      ];
    } else {
      query = [
        "SELECT * FROM mme_imsi_analysis",
        "WHERE imsi LIKE ? OR misc_info1 LIKE ?",
        "ORDER BY imsi",
        "LIMIT ? OFFSET ?"
      ].join(' ');
      queryParams = [
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        limit,
        offset
      ];
    }

    let countQuery = `
      SELECT COUNT(*) as total FROM mme_imsi_analysis 
      WHERE imsi LIKE ? OR misc_info1 LIKE ?
    `;
    const countParams = [`%${searchTerm}%`, `%${searchTerm}%`];

    console.log('Exécution de la requête de comptage avec les paramètres:', countParams);
    
    connection.query(countQuery, countParams, (countError, countResults) => {
      if (countError) {
        console.error('Erreur lors du comptage des enregistrements MME IMSI:', countError);
        return res.status(500).json({ error: 'Error counting MME IMSI records', details: countError.message });
      }
      
      console.log('Résultat du comptage:', countResults[0].total);

      console.log('Exécution de la requête principale avec les paramètres:', queryParams);
      
      connection.query(query, queryParams, (dataError, results) => {
        if (dataError) {
          console.error('Erreur lors de la récupération des données MME IMSI:', dataError);
          return res.status(500).json({ error: 'Error fetching MME IMSI data', details: dataError.message });
        }
        
        console.log(`Récupération de ${results.length} enregistrements`);
        
        res.json({
          data: results,
          total: countResults[0].total,
          page,
          totalPages: limit > 0 ? Math.ceil(countResults[0].total / limit) : 1,
        });
      });
    });
  });
});

// Add IR21 file upload endpoint
const { extractDataFromXML } = require('./importIR21');
app.post('/api/import-ir21', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.error('Aucun fichier IR21 uploadé');
    return res.status(400).json({ error: 'Aucun fichier IR21 uploadé' });
  }

  try {
    const filePath = req.file.path;
    const fileData = await extractDataFromXML(filePath);
    if (!fileData) {
      return res.status(400).json({ error: 'Aucune donnée valide trouvée dans le fichier IR21' });
    }

    // Vérifier si l'entrée existe déjà
    connection.query('SELECT tadig FROM ir21_data WHERE tadig = ?', [fileData.tadig], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification de la base:', err);
        return res.status(500).json({ error: 'Erreur base de données' });
      }
      if (results.length > 0) {
        // Mise à jour avec CAMEL
        connection.query(
          `UPDATE ir21_data SET 
            pays = ?, 
            e212 = ?, 
            e214 = ?, 
            apn = ?, 
            ipaddress = ?, 
            date = ?,
            camel_inbound = ?,  // Nouveau champ
            camel_outbound = ?  // Nouveau champ
          WHERE tadig = ?`,
          [
            fileData.pays, 
            fileData.e212, 
            fileData.e214, 
            fileData.apn, 
            fileData.ips, 
            fileData.date,
            fileData.camelInbound,  // Ajouté
            fileData.camelOutbound, // Ajouté
            fileData.tadig
          ],
          (err2) => {
            if (err2) {
              console.error('Erreur lors de la mise à jour IR21:', err2);
              return res.status(500).json({ error: 'Erreur lors de la mise à jour IR21' });
            }
            return res.json({ success: true, message: `Mise à jour réussie pour ${fileData.tadig}` });
          }
        );
      } else {
        // Insertion avec CAMEL
        connection.query(
          `INSERT INTO ir21_data 
            (tadig, pays, e212, e214, apn, ipaddress, date, camel_inbound, camel_outbound) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, // 2 paramètres ajoutés
          [
            fileData.tadig, 
            fileData.pays, 
            fileData.e212, 
            fileData.e214, 
            fileData.apn, 
            fileData.ips, 
            fileData.date,
            fileData.camelInbound,  // Ajouté
            fileData.camelOutbound  // Ajouté
          ],
          (err3) => {
            if (err3) {
              console.error('Erreur lors de l\'insertion IR21:', err3);
              return res.status(500).json({ error: 'Erreur lors de l\'insertion IR21' });
            }
            return res.json({ success: true, message: `Insertion réussie pour ${fileData.tadig}` });
          }
        );
      }
    });
  } catch (error) {
    console.error('Erreur lors du traitement du fichier IR21:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du fichier IR21', details: error.message });
  }
});

app.post('/api/import-ir85', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.error('Aucun fichier IR85 uploadé');
    return res.status(400).json({ error: 'Aucun fichier IR85 uploadé' });
  }

  try {
    const filePath = req.file.path;
    const fileData = await extractIR85DataFromXML(filePath);
    if (!fileData) {
      return res.status(400).json({ error: 'Aucune donnée valide trouvée dans le fichier IR85' });
    }

    // Vérifier si l'entrée existe déjà
    connection.query('SELECT tadig FROM ir85_data WHERE tadig = ?', [fileData.tadig], (err, results) => {
      if (err) {
        console.error('Erreur lors de la vérification de la base:', err);
        return res.status(500).json({ error: 'Erreur base de données' });
      }
      if (results.length > 0) {
        // Mise à jour avec CAMEL
        connection.query(
          `UPDATE ir85_data SET 
            pays = ?, 
            e212 = ?, 
            e214 = ?, 
            apn = ?, 
            ipaddress = ?,
            camel_inbound = ?,  // Nouveau champ
            camel_outbound = ?  // Nouveau champ
          WHERE tadig = ?`,
          [
            fileData.pays, 
            fileData.e212, 
            fileData.e214, 
            fileData.apn, 
            fileData.ips,
            fileData.camelInbound,  // Ajouté
            fileData.camelOutbound, // Ajouté 
            fileData.tadig
          ],
          (err2) => {
            if (err2) {
              console.error('Erreur lors de la mise à jour IR85:', err2);
              return res.status(500).json({ error: 'Erreur lors de la mise à jour IR85' });
            }
            return res.json({ success: true, message: `Mise à jour réussie pour ${fileData.tadig}` });
          }
        );
      } else {
        // Insertion avec CAMEL
        connection.query(
          `INSERT INTO ir85_data 
            (tadig, pays, e212, e214, apn, ipaddress, camel_inbound, camel_outbound) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, // 2 paramètres ajoutés
          [
            fileData.tadig, 
            fileData.pays, 
            fileData.e212, 
            fileData.e214, 
            fileData.apn, 
            fileData.ips,
            fileData.camelInbound,  // Ajouté
            fileData.camelOutbound  // Ajouté
          ],
          (err3) => {
            if (err3) {
              console.error('Erreur lors de l\'insertion IR85:', err3);
              return res.status(500).json({ error: 'Erreur lors de l\'insertion IR85' });
            }
            return res.json({ success: true, message: `Insertion réussie pour ${fileData.tadig}` });
          }
        );
      }
    });
  } catch (error) {
    console.error('Erreur lors du traitement du fichier IR85:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du fichier IR85', details: error.message });
  }
});

// Add MME file upload endpoint
app.post('/api/upload-mme', upload.single('file'), async (req, res) => {
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  console.log('Received MME file:', {
    filename: req.file.originalname,
    path: req.file.path,
    size: req.file.size
  });

  try {
    const filePath = req.file.path;
    console.log('Reading MME file from:', filePath);
    
    const content = await fs.promises.readFile(filePath, 'utf-8');
    console.log('File content length:', content.length);
    
    // Split the content into IMSI blocks
    const imsiBlocks = content.split('IMSI:').slice(1);
    console.log('Number of IMSI blocks:', imsiBlocks.length);
    
    let successCount = 0;
    let errorCount = 0;
    let duplicateCount = 0;

    for (const block of imsiBlocks) {
      try {
        const lines = block.trim().split('\n');
        const imsi = lines[0].trim();
        
        const parsedData = {
          imsi: imsi,
          default_apn_operator_id: '',
          digits_to_add: '',
          misc_info1: '',
          hss_realm_name: ''
        };
        
        lines.slice(1).forEach(line => {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('dn (DefaultAPNOperatorID)')) {
            parsedData.default_apn_operator_id = trimmedLine.split(/\s+/)[2];
          } else if (trimmedLine.startsWith('ad (DigitsToAdd)')) {
            parsedData.digits_to_add = trimmedLine.split(/\s+/)[2];
          } else if (trimmedLine.startsWith('m1 (MiscInfo1)')) {
            parsedData.misc_info1 = trimmedLine.split(/\s+/).slice(2).join(' ').replace(/_/g, ' ').trim();
          } else if (trimmedLine.startsWith('rn (HssRealmName)')) {
            parsedData.hss_realm_name = trimmedLine.split(/\s+/)[2];
          }
        });
// Check if IMSI already exists
const checkQuery = 'SELECT id FROM mme_imsi_analysis WHERE imsi = ?';
const checkResult = await new Promise((resolve, reject) => {
  connection.query(checkQuery, [parsedData.imsi], (error, results) => {
    if (error) reject(error);
    else resolve(results);
  });
});

if (checkResult.length > 0) {
  // Update existing record
  const updateQuery = `
    UPDATE mme_imsi_analysis 
    SET default_apn_operator_id = ?,
        digits_to_add = ?,
        misc_info1 = ?,
        hss_realm_name = ?
    WHERE imsi = ?
  `;
  await new Promise((resolve, reject) => {
    connection.query(updateQuery, [
      parsedData.default_apn_operator_id,
      parsedData.digits_to_add,
      parsedData.misc_info1,
      parsedData.hss_realm_name,
      parsedData.imsi
    ], (error) => {
      if (error) {
        console.error('Error updating MME data:', error);
        reject(error);
      } else {
        successCount++;
        resolve();
      }
    });
  });
} else {
  // Insert new record
  const insertQuery = `
    INSERT INTO mme_imsi_analysis 
    (imsi, default_apn_operator_id, digits_to_add, misc_info1, hss_realm_name) 
    VALUES (?, ?, ?, ?, ?)
  `;
  await new Promise((resolve, reject) => {
    connection.query(insertQuery, [
      parsedData.imsi,
      parsedData.default_apn_operator_id,
      parsedData.digits_to_add,
      parsedData.misc_info1,
      parsedData.hss_realm_name
    ], (error) => {
      if (error) {
        console.error('Error inserting MME data:', error);
        reject(error);
      } else {
        successCount++;
        resolve();
      }
    });
  });
}
} catch (blockError) {
console.error('Error processing block:', blockError);
errorCount++;
}
}

console.log('Processing complete:', {
successCount,
errorCount,
totalBlocks: imsiBlocks.length
});
if (successCount > 0) {
  res.json({ 
    success: true, 
    message: `Successfully processed ${successCount} entries from MME file`,
    details: {
      successCount,
      errorCount,
      totalBlocks: imsiBlocks.length
    }
  });
} else {
  throw new Error('No valid entries were processed from the file');
}
} catch (error) {
console.error('Error processing MME file:', error);
res.status(500).json({ 
  error: 'Error processing MME file',
  details: error.message,
  stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
});
}
});

// Add MME delete endpoint
app.delete('/api/mme-imsi/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM mme_imsi_analysis WHERE id = ?', [id], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    res.json({ success: true, message: 'MME entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting MME entry:', error);
    res.status(500).json({ error: 'Error deleting MME entry' });
  }
});

// Add MME delete endpoint
app.delete('/api/mme-imsi/:id', async (req, res) => {
  const id = req.params.id;
  
  try {
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM mme_imsi_analysis WHERE id = ?', [id], (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    res.json({ success: true, message: 'MME entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting MME entry:', error);
    res.status(500).json({ error: 'Error deleting MME entry' });
  }
});

app.get('/hlrr', (req, res) => {
  // Utiliser le style de callback standard pour MySQL
  connection.query('SELECT id, tt, np, na, ns, gtrc,  created_at  FROM hlr', (error, rows) => {
    if (error) {
      console.error('Error fetching HLR data:', error);
      return res.status(500).json({ error: 'Failed to fetch HLR data' });
    }
    res.json({ data: rows });
  });
});

// Suppression d'une ligne HLR par id
app.delete('/hlrr/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM hlr WHERE id = ?', [id], (error, result) => {
    if (error) {
      console.error('Erreur lors de la suppression HLR:', error);
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Entrée non trouvée' });
    }
    res.json({ success: true });
  });
});



// Auth routes (authentification)
app.use('/auth', authRoutes);

// Associations Sequelize pour les signalements
User.hasMany(UserReport, { foreignKey: 'userId' });
UserReport.belongsTo(User, { foreignKey: 'userId' });

// Création de la table hlr si elle n'existe pas
const createHlrTable = `
CREATE TABLE IF NOT EXISTS hlr (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tt VARCHAR(50),
    np VARCHAR(50),
    na VARCHAR(50),
    ns VARCHAR(50),
    gtrc VARCHAR(50),
    node_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createHlrTable, (error) => {
    if (error) {
        console.error('Erreur lors de la création de la table hlr:', error);
    } else {
        console.log('Table hlr créée ou déjà existante');
    }
});

// Ajout de la colonne node_name à la table hlr si elle n'existe pas
// Correction de la syntaxe IF NOT EXISTS qui n'est pas supportée pour ADD COLUMN dans certaines versions MySQL
const checkColumnExistsQuery = "SHOW COLUMNS FROM hlr LIKE 'node_name'";

connection.query(checkColumnExistsQuery, (error, results) => {
    if (error) {
        console.error('Erreur lors de la vérification de l\'existence de la colonne node_name:', error);
        return;
    }

    // Si la colonne n'existe pas, l'ajouter
    if (results.length === 0) {
        const addColumnQuery = "ALTER TABLE hlr ADD COLUMN node_name VARCHAR(255)";
        connection.query(addColumnQuery, (alterError) => {
            if (alterError) {
                console.error('Erreur lors de l\'ajout de la colonne node_name:', alterError);
            } else {
                console.log('Colonne node_name ajoutée avec succès');
            }
        });
    } else {
        console.log('Colonne node_name déjà existante');
    }
});


// Route pour récupérer tous les réseaux Huawei
app.get('/api/huawei-networks', async (req, res) => {
  try {
    const query = 'SELECT * FROM mobile_networks ORDER BY id DESC';
    connection.query(query, (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération des réseaux Huawei:', error);
        return res.status(500).json({ error: 'Erreur lors de la récupération des réseaux Huawei' });
      }
      res.json(results);
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réseaux Huawei:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des réseaux Huawei' });
  }
});

//--------------------------------------------------------------------------------------------

function parseHlrData(text) {
    const lines = text.split('\n').map(line => line.trim());
    const dataStartIndex = lines.findIndex(line => line.startsWith('TT   NP  NA   NS'));
    if (dataStartIndex === -1) {
        console.warn('Warning: Could not find the data section in the HLR file.');
        return [];
    }
    const dataLines = lines.slice(dataStartIndex + 1).filter(line => line !== '' && !line.startsWith('OPERATING'));
    return dataLines.map(line => {
        const columns = line.split(/\s+/).filter(col => col !== '');
        if (columns.length === 5) {
            return {
                tt: columns[0],
                np: columns[1],
                na: columns[2],
                ns: columns[3],
                gtrc: columns[4],
                created_at: columns[5]
            };
        } else {
            console.warn(`Warning: Skipping line with incorrect number of columns: "${line}"`);
            return null;
        }
    }).filter(item => item !== null);
}

app.post('/import-hlr', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier fourni' });
    }
    fs.readFile(req.file.path, 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de lecture du fichier' });
        }
        const hlrData = parseHlrData(data);
        if (hlrData.length === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: 'Aucune donnée HLR valide trouvée dans le fichier' });
        }
        let importedCount = 0;
        try {
            for (const entry of hlrData) {
                await new Promise((resolve, reject) => {
                    connection.query(
                        'INSERT INTO hlr (tt, np, na, ns, gtrc) VALUES (?, ?, ?, ?, ?)',
                        [entry.tt, entry.np, entry.na, entry.ns, entry.gtrc],
                        (error) => {
                            if (error) reject(error);
                            else resolve();
                        }
                    );
                });
                importedCount++;
            }
            fs.unlinkSync(req.file.path);
            res.json({ success: true, importedCount });
        } catch (error) {
            fs.unlinkSync(req.file.path);
            console.error('Erreur lors de l\'import HLR:', error);
            res.status(500).json({ error: 'Erreur lors de l\'import HLR' });
        }
    });
});


// Route pour le test Inbound Roaming
app.get('/inbound-roaming', async (req, res) => {
  try {
    const [ir21] = await connection.promise().execute('SELECT * FROM ir21_data');
    const [ir85] = await connection.promise().execute('SELECT * FROM ir85_data');
    const [mss] = await connection.promise().execute('SELECT * FROM mss_imsi_analysis');
    const [mobiles] = await connection.promise().execute('SELECT * FROM mobile_networks');

    const resultsMap = {};

    const processTest = (source, label) => {
      for (const entry of source) {
        const country = entry.pays || 'Inconnu';
        const operateur = entry.tadig || 'Inconnu';
        const key = `${country}-${operateur}`;

        const e212_list = cleanPrefix(entry.e212).split(',').map(e => e.trim()).filter(Boolean);
        const e214_list = cleanPrefix(entry.e214).split(',').map(e => e.trim()).filter(Boolean);

        let phase1_success = false;
        let phase2_success = false;

        const e212_trouves = [];
        const e212_non_trouves = [];

        for (const imsi of e212_list) {
          const found = (
            mss.some(row => row.imsi_series && row.imsi_series.startsWith(imsi)) ||
            mobiles.some(row => row.imsi_prefix && row.imsi_prefix.startsWith(imsi))
          );
          if (found) e212_trouves.push(imsi);
          else e212_non_trouves.push(imsi);
        }

        if (e212_trouves.length > 0) {
          phase1_success = true;

          const e214_trouves = [];
          const e214_non_trouves = [];

          for (const e214 of e214_list) {
            const found = (
              mss.some(row => row.m_value && row.m_value.replace(/^m_/, '').trim() === e214) ||
              mobiles.some(row => row.msisdn_prefix && row.msisdn_prefix.trim() === e214)
            );
            if (found) e214_trouves.push(e214);
            else e214_non_trouves.push(e214);
          }

          if (e214_trouves.length > 0) {
            phase2_success = true;
          }

          if (!phase2_success) {
            const reason = `Les MSISDN Prefix (${e214_non_trouves.join(', ')}) ne sont pas trouvés dans ${label}. Cela indique une absence de configuration de routage E.214.`;
            if (!resultsMap[key]) resultsMap[key] = { country, operateur, phase_1: 'réussite', phase_2: 'échec', test_final: 'échec', commentaires: [] };
            resultsMap[key].phase_2 = 'échec';
            resultsMap[key].test_final = 'échec';
            resultsMap[key].commentaires.push(reason);
          }
        } else {
          const reason = `Les IMSI Prefix (${e212_non_trouves.join(', ')}) sont absents dans ${label}, phase 2 non exécutée. Cela signifie que les abonnés du partenaire ne seront pas reconnus dans les MSS/MSC.`;
          if (!resultsMap[key]) resultsMap[key] = { country, operateur, phase_1: 'échec', phase_2: 'non exécutée', test_final: 'échec', commentaires: [] };
          resultsMap[key].phase_1 = 'échec';
          resultsMap[key].phase_2 = 'non exécutée';
          resultsMap[key].test_final = 'échec';
          resultsMap[key].commentaires.push(reason);
        }

        if (phase1_success && phase2_success) {
          if (!resultsMap[key]) {
            resultsMap[key] = {
              country,
              operateur,
              phase_1: 'réussite',
              phase_2: 'réussite',
              test_final: 'réussite',
              commentaires: ['Les IMSI et MSISDN Prefix sont bien configurés dans les MSS et dans la base mobile_networks. Aucun problème détecté.'],
            };
          }
        }
      }
    };

    processTest(ir21, 'IR.21');
    processTest(ir85, 'IR.85');

    const finalResults = Object.values(resultsMap).map(entry => ({
      ...entry,
      commentaire: entry.commentaires.join(' '),
    }));

    res.json(finalResults);
  } catch (error) {
    console.error('Erreur Inbound Roaming:', error);
    res.status(500).json({ error: 'Erreur serveur Inbound Roaming' });
  }
});

// Route pour sauvegarder un rapport d'audit
app.post('/save-audit-report', async (req, res) => {
  try {
    const reportData = req.body;
    
    // Validation des champs requis
    if (!reportData.id || !reportData.test_id || !reportData.title || !reportData.date || !reportData.time) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    // Préparation de la requête SQL
    const sql = `
      INSERT INTO audit_reports (
        id, test_id, title, date, time, status, created_by, validated_by,
        total_operators, total_issues, camel_issues, gprs_issues, threeg_issues, lte_issues,
        results_data, solutions, attachments, validation_notes, implemented_changes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reportData.id,
      reportData.test_id,
      reportData.title,
      reportData.date,
      reportData.time,
      reportData.status,
      reportData.created_by,
      reportData.validated_by,
      reportData.total_operators,
      reportData.total_issues,
      reportData.camel_issues,
      reportData.gprs_issues,
      reportData.threeg_issues,
      reportData.lte_issues,
      reportData.results_data,
      reportData.solutions,
      reportData.attachments,
      reportData.validation_notes,
      reportData.implemented_changes
    ];

    // Exécution de la requête
    connection.query(sql, values, (error, results) => {
      if (error) {
        console.error('Erreur lors de la sauvegarde du rapport:', error);
        return res.status(500).json({ message: 'Erreur lors de la sauvegarde du rapport' });
      }
      
      console.log('Rapport sauvegardé avec succès:', results);
      res.status(200).json({ message: 'Rapport sauvegardé avec succès', id: reportData.id });
    });
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    res.status(500).json({ message: 'Erreur lors du traitement de la requête' });
  }
});

// Fonction utilitaire pour nettoyer les préfixes
function cleanPrefix(value) {
  return value ? value.replace(/\s/g, '').trim() : '';
}

// Route pour l'utilisateur courant
app.get('/current-user', async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur depuis le localStorage (envoyé dans les headers)
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'Non authentifié' });
    }

    // Récupérer l'utilisateur depuis la base de données
    const query = 'SELECT id, name, role FROM users WHERE id = ?';
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const user = results[0];

      // Renvoyer les données de l'utilisateur
      res.json({
        user_id: user.id,
        name: user.name,
        role: user.role,
        permissions: user.role === 'admin' ? [
          { resource_type: 'Report', access_level: 'Admin' }
        ] : []
      });
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes audit
app.use('/', auditRoutes);

// Route pour vérifier les données de situation_globales
app.get('/check-situation-globale', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM situation_globales LIMIT 5');
    console.log('Données trouvées:', rows);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Erreur lors de la vérification des données:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour récupérer la liste des tests
app.get('/tests', (req, res) => {
  const query = 'SELECT id, name, description FROM tests ORDER BY id';
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des tests:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des tests' });
    }
    res.json(results);
  });
});



// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});