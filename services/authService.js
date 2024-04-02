const connection = require('../database/db');
const bcrypt = require('bcrypt');

// Register endpoint
exports.Register = (req, res) => {
    const { username,email,password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const sql = 'INSERT INTO users (username,email, password) VALUES (?, ?, ?)';
            connection.query(sql, [username, email, hash], (err, result) => {
                if (err) {
                    console.error('Error registering user:', err);
                    res.status(500).json({ message: 'Internal server error' });
                } else {
                    res.status(201).json({ message: 'User registered successfully' });
                }
            });
        }
    });
};

// Login endpoint
exports.Login = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username=?';
    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
                    if (bcryptErr || !bcryptResult) {
                        res.status(401).json({ message: 'Invalid username or password' });
                    } else {
                        // Set session
                        req.session.userId = user.id;
                        res.json({ message: 'Login successful' });
                    }
                });
            } else {
                res.status(401).json({ message: 'Invalid username or password' });
            }
        }
    });
};

// Logout endpoint
exports.Logout = (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
};

// Protected endpoint
exports.protected = (req, res) => {
    res.json({ message: 'Protected endpoint accessed successfully' });
};
