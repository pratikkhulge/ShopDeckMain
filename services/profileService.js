const connection = require('../database/db');
// Get user profile
exports.getProfile = (req, res) => {
    const userId = req.session.userId;
    const sql = 'SELECT * FROM users WHERE id=?';
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user profile:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (result.length === 0) {
                res.status(404).json({ message: 'User profile not found' });
            } else {
                const userProfile = {
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email,
                };
                res.json(userProfile);
            }
        }
    });
};

// Update user profile
exports.updateProfile = (req, res) => {
    const userId = req.session.userId;
    const { email, password } = req.body;
    const sql = 'UPDATE users SET email=?, password=? WHERE id=?';
    connection.query(sql, [email, password, userId], (err, result) => {
        if (err) {
            console.error('Error updating user profile:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json({ message: 'User profile updated successfully' });
        }
    });
}; 