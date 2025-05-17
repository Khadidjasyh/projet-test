const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserReport = require('../models/UserReport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Check if admin exists
router.get('/check-admin', async (req, res) => {
  const admin = await User.findOne({ where: { role: 'admin' } });
  res.json({ exists: !!admin });
});

// Create first admin account
router.post('/create-admin', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    role: 'admin',
    status: 'active',
    password: hashedPassword
  });
  res.status(201).json(user);
});

// Admin creates user account
router.post('/create-user', async (req, res) => {
  const { name, email, role } = req.body;
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  const activationToken = crypto.randomBytes(32).toString('hex');
  
  // Generate a temporary, unusable password. Will be overwritten on activation.
  const temporaryPassword = crypto.randomBytes(16).toString('hex'); 
  const hashedPassword = await bcrypt.hash(temporaryPassword, 1); // Hash it with low cost

  // DEBUGGING: Log environment variables for Gmail
  // console.log("DEBUG: Attempting to send email.");
  // console.log(`DEBUG: GMAIL_USER from env: ${process.env.GMAIL_USER}`)
  // console.log(`DEBUG: GMAIL_PASS from env (exists?): ${process.env.GMAIL_PASS ? 'Yes, exists' : 'No, undefined or empty'}`);
  // if (process.env.GMAIL_PASS) {
  //   console.log(`DEBUG: GMAIL_PASS length: ${process.env.GMAIL_PASS.length}`);
  // }

  try {
    const user = await User.create({
      name,
      email,
      role,
      status: 'pending',
      activationToken,
      password: hashedPassword // Provide the temporary hashed password
    });
    // Send activation email (ensure this part is robust)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Activate Your Account',
      text: `Click here to activate your account: http://localhost:5176/activate/${activationToken}`
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json(user);
  } catch (dbError) {
    console.error("Error creating user or sending email:", dbError);
    res.status(500).json({ error: 'Failed to create user account. Please try again.' });
  }
});

// Activate user account
router.post('/activate/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 8) { // Basic complexity check
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const user = await User.findOne({ where: { activationToken: token } });
  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired activation link' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.status = 'active';
  user.activationToken = null;
  await user.save();
  res.json({ message: 'Account activated successfully' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(400).json({ error: 'User not found' });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid password' });
  }
  res.json(user);
});

// PATCH /profile : utilisateur modifie son username et téléphone
router.patch('/profile', async (req, res) => {
  const { id, username, telephone, role } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing user id' });
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  // Un user ne peut modifier que username et telephone
  if (role !== 'admin') {
    if (username !== undefined) user.username = username;
    if (telephone !== undefined) user.telephone = telephone;
  } else {
    // Pour l'admin, on laisse tout modifier via une autre route
    return res.status(403).json({ error: 'Use admin route to update all fields' });
  }
  await user.save();
  res.json(user);
});

// PATCH /admin/user/:id : admin modifie tous les champs d'un utilisateur
router.patch('/admin/user/:id', async (req, res) => {
  const { id } = req.params;
  const { name, prenom, username, email, telephone, role, status } = req.body;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (name !== undefined) user.name = name;
  if (prenom !== undefined) user.prenom = prenom;
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (telephone !== undefined) user.telephone = telephone;
  if (role !== undefined) user.role = role;
  if (status !== undefined) user.status = status;
  await user.save();
  res.json(user);
});

// GET /admin/users : admin liste tous les utilisateurs
router.get('/admin/users', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// POST /profile/report : utilisateur signale une erreur sur ses infos
router.post('/profile/report', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) return res.status(400).json({ error: 'Missing userId or message' });
  const report = await UserReport.create({ userId, message });

  // Envoi d'un email à tous les admins
  try {
    const admins = await User.findAll({ where: { role: 'admin' } });
    if (admins.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      for (const admin of admins) {
        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: admin.email,
          subject: 'Nouveau signalement utilisateur',
          text: `Un utilisateur a signalé une erreur sur son profil :\n\n${message}\n\nUserId: ${userId}`
        });
      }
    }
  } catch (err) {
    console.error('Erreur lors de l\'envoi des emails aux admins:', err);
    // On ne bloque pas la création du report même si l'email échoue
  }

  res.status(201).json(report);
});

// GET /admin/reports : admin liste tous les signalements
router.get('/admin/reports', async (req, res) => {
  const reports = await UserReport.findAll({ include: User });
  res.json(reports);
});

// PATCH /admin/report/:id : admin marque un signalement comme traité
router.patch('/admin/report/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const report = await UserReport.findByPk(id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  report.status = status || 'traite';
  await report.save();
  res.json(report);
});

module.exports = router; 