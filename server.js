const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Création de la table des messages de contact
async function createContactTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('new', 'read', 'replied') DEFAULT 'new'
      )
    `);
    connection.release();
    console.log('Table contact_messages créée avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de la table contact_messages:', error);
  }
}

// Route pour envoyer un message de contact
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Insertion dans la base de données
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    connection.release();

    // Envoi de l'email de notification
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Nouveau message de contact: ${subject}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Sujet:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès',
      messageId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
});

// Route pour récupérer tous les messages (admin)
app.get('/api/contact/messages', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [messages] = await connection.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    connection.release();
    res.status(200).json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages'
    });
  }
});

// Route pour marquer un message comme lu (admin)
app.put('/api/contact/messages/:id/read', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      ['read', req.params.id]
    );
    connection.release();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du message'
    });
  }
});

// Route pour répondre à un message (admin)
app.post('/api/contact/messages/:id/reply', async (req, res) => {
  const { reply } = req.body;

  try {
    const connection = await pool.getConnection();
    const [message] = await connection.query(
      'SELECT * FROM contact_messages WHERE id = ?',
      [req.params.id]
    );

    if (!message.length) {
      connection.release();
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: message[0].email,
      subject: `Re: ${message[0].subject}`,
      html: `
        <p>Bonjour ${message[0].name},</p>
        <p>${reply}</p>
        <p>Cordialement,<br>L'équipe Mobilis</p>
      `
    };

    await transporter.sendMail(mailOptions);
    await connection.query(
      'UPDATE contact_messages SET status = ? WHERE id = ?',
      ['replied', req.params.id]
    );
    connection.release();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la réponse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de la réponse'
    });
  }
});

// Initialisation de la base de données
createContactTable();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
}); 