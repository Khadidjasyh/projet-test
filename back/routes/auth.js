const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Vérification de l'existence d'un admin
router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' } });
    res.json({ exists: !!admin });
  } catch (error) {
    console.error('Erreur check-admin:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// Création du premier admin
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    const existingAdmin = await User.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      role: 'admin',
      status: 'active',
      password: hashedPassword
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur création admin:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Création d'utilisateur (version unifiée)
router.post('/create-user', async (req, res) => {
  try {
    const { name, prenom, username, email, telephone, role } = req.body;
    
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'Champs obligatoires manquants' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    const activationToken = encodeURIComponent(crypto.randomBytes(32).toString('hex'));
    const temporaryPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

    const user = await User.create({
      name,
      prenom,
      username,
      email,
      telephone,
      role,
      status: 'pending',
      activationToken,
      password: hashedPassword
    });

    // Configuration de l'email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Activation de compte',
      html: `
        <h1>Activation de compte</h1>
        <p>Cliquez sur ce lien pour activer votre compte :</p>
        <a href="http://localhost:5178/api/auth/activate/${activationToken}">
          Activer mon compte
        </a>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur création utilisateur:', error);
    res.status(500).json({ error: 'Échec de la création' });
  }
});


// Activation de compte (GET - Affiche le formulaire)
router.get('/activate/:token', async (req, res) => {
  try {
    const decodedToken = decodeURIComponent(req.params.token);
    const user = await User.findOne({ 
      where: { 
        activationToken: decodedToken,
        status: 'pending'
      }
    });

    if (!user) {
      return res.status(400).send(`
        <h1>Erreur d'activation</h1>
        <p>Lien invalide ou expiré</p>
      `);
    }

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Activation de compte</title>
      </head>
      <body>
        <h1>Définir votre mot de passe</h1>
        <form method="POST" action="/api/auth/activate/${encodeURIComponent(decodedToken)}">
          <input type="password" name="password" placeholder="Nouveau mot de passe (8 caractères min)" required>
          <button type="submit">Activer le compte</button>
        </form>
      </body>
      </html>
    `);
  } catch (error) {
    console.error('Erreur activation:', error);
    res.status(500).send('Erreur serveur');
  }
});

// Activation de compte (POST - Traitement du mot de passe)
router.post('/activate/:token', async (req, res) => {
  try {
    const decodedToken = decodeURIComponent(req.params.token);
    const { password } = req.body;

    // Validation du mot de passe
    if (!password || password.length < 8) {
      return res.status(400).json({ 
        error: 'Le mot de passe doit contenir au moins 8 caractères' 
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ 
      where: { 
        activationToken: decodedToken,
        status: 'pending' 
      }
    });

    if (!user) {
      return res.status(400).json({ 
        error: 'Lien d\'activation invalide ou expiré' 
      });
    }

    // Mise à jour du compte
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.status = 'active';
    user.activationToken = null;
    await user.save();

    // Réponse adaptée (HTML ou JSON)
    if (req.accepts('html')) {
      return res.send(`
        <h1>Compte activé !</h1>
        <p>Vous pouvez maintenant vous connecter.</p>
      `);
    }
    
    res.json({ 
      success: true, 
      message: 'Compte activé avec succès' 
    });

  } catch (error) {
    console.error('Erreur activation:', error);
    res.status(500).json({
      error: 'Échec de l\'activation',
      details: error.message
    });
  }
});

// Connexion utilisateur
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur de connexion' });
  }
});

// Récupérer l'utilisateur courant par ID (pour contrôle d'accès frontend)
router.get('/current-user', async (req, res) => {
  try {
    // Prendre l'ID utilisateur depuis le header
    const userId = req.header('user-id');
    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur manquant' });
    }
    // Chercher l'utilisateur en base
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    // Retourner les infos nécessaires (rôle, etc.)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

module.exports = router;