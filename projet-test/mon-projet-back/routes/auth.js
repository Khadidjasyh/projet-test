const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserReport = require('../models/UserReport');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Check if admin exists
router.get('/check-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ where: { role: 'admin' } });
    res.json({ exists: !!admin });
  } catch (error) {
    console.error('Erreur lors du check-admin:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// Create first admin account
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields: name, email, and password' });
    }
    // Vérifie si un admin existe déjà avec ce mail
    const existingAdmin = await User.findOne({ where: { email, role: 'admin' } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists with this email' });
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
    console.error('Erreur lors de la création de l\'admin:', error);
    res.status(500).json({ error: 'Erreur serveur', details: error.message });
  }
});

// Admin creates user account
router.post('/create-user', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { name, prenom, username, email, telephone, role } = req.body;
    
    if (!name || !email || !role) {
      console.error('Missing required fields:', { name, email, role });
      return res.status(400).json({ error: 'Missing required fields: name, email, and role' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }

    console.log('Generating activation token...');
    const activationToken = crypto.randomBytes(32).toString('hex');
    console.log('Generating temporary password...');
    const temporaryPassword = crypto.randomBytes(16).toString('hex');
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(temporaryPassword, 1);

    console.log('Creating user...');
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
    console.log('User created successfully:', user);
    
    console.log('Setting up email transport...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    });
    
    console.log('Creating email options...');
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Activate Your Account',
      text: `Click here to activate your account: http://localhost:5177/api/auth/activate/${activationToken}`
    };
    
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error details:', {
      error: error.message,
      stack: error.stack,
      env: process.env.NODE_ENV,
      db: process.env.DB_NAME
    });
    res.status(500).json({ error: 'Failed to create user account. Please try again.' });
  }
});

// Duplicate route for frontend compatibility
router.post('/auth/create-user', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { name, prenom, username, email, telephone, role } = req.body;
    
    if (!name || !email || !role) {
      console.error('Missing required fields:', { name, email, role });
      return res.status(400).json({ error: 'Missing required fields: name, email, and role' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }

    console.log('Generating activation token...');
    const activationToken = crypto.randomBytes(32).toString('hex');
    console.log('Generating temporary password...');
    const temporaryPassword = crypto.randomBytes(16).toString('hex');
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(temporaryPassword, 1);

    console.log('Creating user...');
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
    console.log('User created successfully:', user);
    
    console.log('Setting up email transport...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });
    
    console.log('Creating email options...');
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Activate Your Account',
      text: `Click here to activate your account: http://localhost:5177/api/auth/activate/${activationToken}`
    };
    
    console.log('Sending email...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    
    res.status(201).json(user);
  } catch (error) {
    console.error('Error details:', {
      error: error.message,
      stack: error.stack,
      env: process.env.NODE_ENV,
      db: process.env.DB_NAME
    });
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

module.exports = router;
