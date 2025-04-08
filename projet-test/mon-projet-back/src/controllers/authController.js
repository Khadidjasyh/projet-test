const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const bcrypt = require('bcryptjs');

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email and password are required'
                });
            }

            // Get user from database
            const [users] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            const user = users[0];

            // Check password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password'
                });
            }

            // Generate token
            const token = jwt.sign(
                { 
                    id: user.user_id,
                    email: user.email,
                    role: user.role
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: user.user_id,
                    email: user.email,
                    name: user.name,
                    surname: user.surname,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during login',
                error: error.message
            });
        }
    }

    async register(req, res) {
        try {
            const { email, password, name, surname, role } = req.body;

            // Validate all required fields
            if (!email || !password || !name || !surname) {
                return res.status(400).json({
                    success: false,
                    message: 'Email, password, name, and surname are required'
                });
            }

            // Check if user already exists
            const [existing] = await db.execute(
                'SELECT user_id FROM users WHERE email = ?',
                [email]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Use default role if not provided
            const userRole = role || 'user';

            // Insert new user with all required fields
            const [result] = await db.execute(
                'INSERT INTO users (email, password, name, surname, role) VALUES (?, ?, ?, ?, ?)',
                [email, hashedPassword, name, surname, userRole]
            );

            // Generate token for new user
            const token = jwt.sign(
                { 
                    id: result.insertId,
                    email: email,
                    role: userRole
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token: token,
                user: {
                    id: result.insertId,
                    email: email,
                    name: name,
                    surname: surname,
                    role: userRole
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                message: 'Error during registration',
                error: error.message
            });
        }
    }
}

module.exports = new AuthController(); 