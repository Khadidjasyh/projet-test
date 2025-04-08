const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, name, surname, role = 'User' } = userData;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.execute(
      'INSERT INTO users (email, password, name, surname, role) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, name, surname, role]
    );
    
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, userData) {
    const { name, surname, email, role } = userData;
    await db.execute(
      'UPDATE users SET name = ?, surname = ?, email = ?, role = ? WHERE user_id = ?',
      [name, surname, email, role, id]
    );
    return true;
  }

  static async delete(id) {
    await db.execute(
      'DELETE FROM users WHERE user_id = ?',
      [id]
    );
    return true;
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User; 