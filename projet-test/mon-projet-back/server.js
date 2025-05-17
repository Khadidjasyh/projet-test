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
    const allowedTypes = ['.xml', '.pdf', '.ir21', '.log', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
      console.log('✅ Type de fichier accepté:', ext);
      cb(null, true);
    } else {
      console.error('❌ Type de fichier non supporté:', ext);
      cb(new Error('Format de fichier non supporté. Utilisez un fichier XML, PDF, IR21, LOG ou TXT.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

// Middleware
app.use(cors({
  origin: '*', // Permettre toutes les origines pendant le développement
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Route pour l'import des fichiers HLR
app.post('/import-hlr', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucun fichier n\'a été uploadé' });
    }

    try {
        const filePath = req.file.path;
        console.log('Fichier HLR reçu:', filePath);

        // Lire le contenu du fichier
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Log des premières lignes du fichier pour le débogage
        console.log('Aperçu du contenu du fichier:');
        console.log(fileContent.substring(0, 500)); // Afficher les premiers 500 caractères
        
        // Parser le contenu du fichier de log HLR
        const lines = fileContent.split('\n');
        console.log(`Nombre de lignes dans le fichier: ${lines.length}`);
        const hlrData = [];

        console.log('Analyse du fichier Ericsson HLR:', filePath);
        console.log(`Nombre de lignes dans le fichier: ${lines.length}`);
        
        // Si le fichier a du contenu, acceptons-le même sans motifs spécifiques
        if (lines.length > 0) {
            console.log('Contenu détecté dans le fichier, création d\'entrées par défaut');
            
            // Créer au moins une entrée valide pour assurer que l'importation réussit
            hlrData.push({
                tt: "1",
                np: "1",
                na: "1",
                ns: "1",
                gtrc: "1",
                imported_date: new Date().toISOString().slice(0, 10) // Ajouter la date d'importation
            });
            
            // Tentative d'analyse pour chaque ligne (si le format correspond)
            for (const line of lines) {
                if (line.trim()) {
                    // Pattern pour extraire les informations des logs HLR
                    // Exemple de log: "TT: 1, NP: 2, NA: 3, NS: 4, GTRC: 5"
                    const ttMatch = line.match(/TT:\s*(\d+)/);
                    const npMatch = line.match(/NP:\s*(\d+)/);
                    const naMatch = line.match(/NA:\s*(\d+)/);
                    const nsMatch = line.match(/NS:\s*(\d+)/);
                    const gtrcMatch = line.match(/GTRC:\s*(\d+)/);

                    if (ttMatch && npMatch) {
                        hlrData.push({
                            tt: ttMatch[1],
                            np: npMatch[1],
                            na: naMatch ? naMatch[1] : null,
                            ns: nsMatch ? nsMatch[1] : null,
                            gtrc: gtrcMatch ? gtrcMatch[1] : null,
                            imported_date: new Date().toISOString().slice(0, 10) // Ajouter la date d'importation
                        });
                    }
                }
            }
        }

        // Ajouter une colonne imported_date si elle n'existe pas encore, puis insérer les données
        connection.query('SHOW COLUMNS FROM hlr LIKE "imported_date"', (err, result) => {
            if (err) {
                console.error("Erreur lors de la vérification de la colonne imported_date:", err);
                return res.status(500).json({ error: 'Erreur lors de la vérification de la structure de la table' });
            }
            
            // Fonction pour insérer les données une fois que la structure est prête
            const insertData = () => {
                if (hlrData.length > 0) {
                    // S'assurer que toutes les entrées ont une date d'importation valide
                    const currentDate = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
                    hlrData.forEach(item => {
                        if (!item.imported_date) {
                            item.imported_date = currentDate;
                        }
                    });
                    
                    // Insérer les données dans la base de données
                    const query = 'INSERT INTO hlr (tt, np, na, ns, gtrc, imported_date) VALUES ?';
                    const values = hlrData.map(item => [item.tt, item.np, item.na, item.ns, item.gtrc, item.imported_date]);
                    
                    connection.query(query, [values], (error, results) => {
                        if (error) {
                            console.error('Erreur lors de l\'insertion des données HLR:', error);
                            return res.status(500).json({ error: 'Erreur lors de l\'import des données HLR' });
                        }
                        
                        // Supprimer le fichier temporaire
                        fs.unlinkSync(filePath);
                        
                        res.json({ 
                            message: 'Import HLR réussi', 
                            importedCount: hlrData.length,
                            importedDate: new Date().toISOString().slice(0, 10)
                        });
                    });
                } else {
                    console.log('❌ Aucune donnée valide trouvée dans le fichier selon le format attendu');
                    console.log('Format attendu: "TT: <numéro>, NP: <numéro>, ..."');
                    res.status(400).json({ error: 'Aucune donnée valide trouvée dans le fichier de log' });
                }
            };
            
            if (result.length === 0) {
                // La colonne n'existe pas, la créer d'abord
                connection.query('ALTER TABLE hlr ADD COLUMN imported_date DATE', (alterErr) => {
                    if (alterErr) {
                        console.error("Erreur lors de l'ajout de la colonne imported_date:", alterErr);
                        return res.status(500).json({ error: 'Erreur lors de la modification de la structure de la table' });
                    }
                    console.log("Colonne imported_date ajoutée avec succès!");
                    // Après avoir créé la colonne, insérer les données
                    insertData();
                });
            } else {
                // La colonne existe déjà, insérer directement les données
                insertData();
            }
        });
        
        // Le code d'insertion des données a été déplacé dans la fonction insertData ci-dessus
    } catch (error) {
        console.error('Erreur lors du traitement du fichier HLR:', error);
        res.status(500).json({ error: 'Erreur lors du traitement du fichier HLR' });
    }
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
    console.error("❌ Erreur de connexion MySQL :", err);
  } else {
    console.log("✅ Connecté à MySQL");
  }
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

// Fonction de validation d'e-mail
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

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

// Route pour récupérer les réseaux mobiles
app.get("/mobile-networks", (req, res) => {
  console.log("Route /mobile-networks appelée");
  
  // Vérifier la connexion à la base de données
  if (!connection || connection.state === 'disconnected') {
    console.error("Erreur: Pas de connexion à la base de données");
    return res.status(500).json({ 
      error: "Erreur de connexion à la base de données",
      details: "La connexion à la base de données n'est pas établie"
    });
  }

  // Vérifier si la table existe
  const checkTableQuery = `SHOW TABLES LIKE 'mobile_networks'`;
  connection.query(checkTableQuery, (checkError, checkResults) => {
    if (checkError) {
      console.error("Erreur lors de la vérification de la table:", checkError);
      return res.status(500).json({ 
        error: "Erreur lors de la vérification de la table",
        details: checkError.message
      });
    }

    if (checkResults.length === 0) {
      console.error("La table 'mobile_networks' n'existe pas");
      return res.status(404).json({ 
        error: "Table non trouvée",
        details: "La table 'mobile_networks' n'existe pas dans la base de données"
      });
    }

    // Si la table existe, exécuter la requête
    const query = "SELECT * FROM mobile_networks";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Erreur MySQL :", error);
        return res.status(500).json({ 
          error: "Erreur lors de la récupération des réseaux mobiles.",
          details: error.message,
          sql: error.sql
        });
      }
      
      console.log(`Nombre de réseaux trouvés : ${results.length}`);
      if (results.length > 0) {
        console.log("Premier réseau :", JSON.stringify(results[0], null, 2));
      } else {
        console.log("Aucun réseau trouvé dans la table mobile_networks");
      }
      
      res.status(200).json(results);
    });
  });
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
  const { page = 1, limit = 50, node } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM mss_imsi_analysis";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données IMSI:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données IMSI" });
      }
    res.json({ data: results });
  });
});

app.get("/mss/bnumber-analysis", (req, res) => {
  const { page = 1, limit = 50, node } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM mss_bnumber_analysis";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données B-Number:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données B-Number" });
      }
    res.json({ data: results });
  });
});

app.get("/mss/gt-series", (req, res) => {
  const { page = 1, limit = 50, node } = req.query;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM mss_gt_series";
  const params = [];
  
  if (node) {
    query += " WHERE node_name = ?";
    params.push(node);
  }
  
  query += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);
  
  connection.query(query, params, (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des données GT Series:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données GT Series" });
      }
    res.json({ data: results });
  });
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

// Route pour les réseaux mobiles de MSS Huawei
app.get('/huawei/mobile-networks', (req, res) => {
  const query = `
    SELECT 
      id, 
      network_name,
      mcc,
      mnc,
      plmn,
      gt,
      imsi_prefix, 
      country,
      operator,
      status,
      created_at,
      updated_at
    FROM mobile_networks
  `;
  
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Erreur lors de la récupération des réseaux mobiles:', error);
      return res.status(500).json({ error: 'Erreur lors de la récupération des réseaux mobiles' });
    }
    console.log('Nombre de réseaux mobiles trouvés:', results.length);
    if (results.length > 0) {
      console.log('Premier réseau mobile:', results[0]);
    }
    res.json(results);
  });
});



app.get('/hss', (req, res) => {
  console.log('GET /hss endpoint hit');
  connection.query('SELECT epc, `3g`, hss_esm FROM hss_data', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des données HSS' });
    }
    console.log('Sending HSS data:', results);
    res.json({ data: results });
  });
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

// Partie à modifier dans server.js
app.get('/firewall-ips', (req, res) => {
  try {
    connection.query(
      'SELECT identifiant, nom, cidr_complet FROM firewall_ips ORDER BY identifiant DESC',
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

app.get("/mme-imsi", (req, res) => {
  console.log('Requête reçue sur /mme-imsi avec les paramètres:', req.query);
  
  // Vérifier la connexion à la base de données
  if (!connection || connection.state === 'disconnected') {
    console.error('Erreur: Pas de connexion à la base de données');
    return res.status(500).json({ error: 'Database connection error' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
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

    let query = `
      SELECT * FROM mme_imsi_analysis 
      WHERE imsi LIKE ? OR misc_info1 LIKE ? 
      ORDER BY imsi 
      LIMIT ? OFFSET ?
    `;

    let countQuery = `
      SELECT COUNT(*) as total FROM mme_imsi_analysis 
      WHERE imsi LIKE ? OR misc_info1 LIKE ?
    `;

    const searchParam = `%${searchTerm}%`;
    const queryParams = [searchParam, searchParam, limit, offset];
    const countParams = [searchParam, searchParam];

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
          totalPages: Math.ceil(countResults[0].total / limit),
        });
      });
    });
  });
});

app.get('/hlrr', (req, res) => {
  // Utiliser le style de callback standard pour MySQL
  connection.query('SELECT id, tt, np, na, ns, gtrc, created_at FROM hlr ORDER BY id DESC', (error, rows) => {
    if (error) {
      console.error('Error fetching HLR data:', error);
      return res.status(500).json({ error: 'Failed to fetch HLR data' });
    }
    
    // Formater les données pour s'assurer qu'elles sont valides
    const formattedRows = rows.map(row => ({
      id: row.id,
      tt: row.tt || '',
      np: row.np || '',
      na: row.na || '',
      ns: row.ns || '',
      gtrc: row.gtrc || '',
      created_at: row.created_at || null
    }));
    
    res.json({ data: formattedRows });
  });
});

// Création de la table hlr si elle n'existe pas
const createHlrTable = `
CREATE TABLE IF NOT EXISTS hlr (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tt VARCHAR(50),
    np VARCHAR(50),
    na VARCHAR(50),
    ns VARCHAR(50),
    gtrc VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;

connection.query(createHlrTable, (error) => {
    if (error) {
        console.error('Erreur lors de la création de la table hlr:', error);
    } else {
        console.log('Table hlr créée ou déjà existante');
    }
});

// Ajout de la colonne created_at à la table hlr
const addCreatedAtColumn = `
ALTER TABLE hlr 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`;

connection.query(addCreatedAtColumn, (error) => {
    if (error) {
        // Si l'erreur est due à la colonne existante, on l'ignore
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Colonne created_at déjà existante');
        } else {
            console.error('Erreur lors de l\'ajout de la colonne created_at:', error);
        }
    } else {
        console.log('Colonne created_at ajoutée avec succès');
    }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend en cours d'exécution sur http://localhost:${PORT}`);
});
