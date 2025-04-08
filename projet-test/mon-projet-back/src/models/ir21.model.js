const db = require('../config/db.config');
const path = require('path');
const fs = require('fs');

class IR21Document {
  static async create(documentData) {
    const { partner_id, file_name, file_path, file_format, content, uploaded_by } = documentData;
    
    const [result] = await db.execute(
      `INSERT INTO ir21_documents 
       (partner_id, file_name, file_path, file_format, content, uploaded_by, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
      [partner_id, file_name, file_path, file_format, content, uploaded_by]
    );
    
    return result.insertId;
  }

  static async findByPartner(partner_id) {
    const [rows] = await db.execute(
      'SELECT * FROM ir21_documents WHERE partner_id = ?',
      [partner_id]
    );
    return rows;
  }

  static async findById(document_id) {
    const [rows] = await db.execute(
      'SELECT * FROM ir21_documents WHERE document_id = ?',
      [document_id]
    );
    return rows[0];
  }

  static async updateStatus(document_id, status) {
    await db.execute(
      'UPDATE ir21_documents SET status = ? WHERE document_id = ?',
      [status, document_id]
    );
    return true;
  }

  static async delete(document_id) {
    // First get the file path
    const [document] = await db.execute(
      'SELECT file_path FROM ir21_documents WHERE document_id = ?',
      [document_id]
    );

    if (document[0] && document[0].file_path) {
      // Delete the file from storage
      const filePath = path.join(__dirname, '..', '..', 'uploads', document[0].file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete from database
    await db.execute(
      'DELETE FROM ir21_documents WHERE document_id = ?',
      [document_id]
    );
    return true;
  }

  static async parseRAEXContent(content) {
    // This is a placeholder for RAEX parsing logic
    // In a real implementation, this would parse the XML/RAEX content
    try {
      // For now, just return the content as is
      return { success: true, data: content };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = IR21Document; 