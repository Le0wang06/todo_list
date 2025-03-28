const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register endpoint
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    // Validate input
    if (!username || !email || !password) {
        return res.json({ 
            code: 400,
            msg: 'Please fill in all required fields',
            data: null
        });
    }

    try {
        // Check if username or email already exists
        const [existingUser] = await db.promise().query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser[0] && existingUser[0].length > 0) {
            return res.json({ 
                code: 400,
                msg: 'Username or email already exists',
                data: null
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user
        const [result] = await db.promise().query(
            'INSERT INTO users (username, email, passwordHash) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        res.json({
            code: 0,
            msg: 'Registration successful',
            data: {
                userId: result.insertId
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.json({ 
            code: 500,
            msg: 'Server error',
            data: null
        });
    }
});

// Login endpoint

// req: request
// res: response
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.json({ 
            code: 400,
            msg: 'Please provide username and password',
            data: null
        });
    }

    try {
        // Find user
        const [users] = await db.promise().query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.json({ 
                code: 401,
                msg: 'Invalid username or password',
                data: null
            });
        }

        const user = users[0];

        // Verify password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.json({ 
                code: 401,
                msg: 'Invalid username or password',
                data: null
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, username: user.username },
            'your-secret-key', // In production, use environment variable
            { expiresIn: '24h' }
        );

        res.json({
            code: 0,
            msg: 'Login successful',
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.json({ 
            code: 500,
            msg: 'Server error',
            data: null
        });
    }
});

module.exports = router; 