const connection = require('../database/db');
// Submit a review
exports.AddReviews =  (req, res) => {
    const userId = req.session.userId;
    const productId = req.params.productId;
    const { rating, comment } = req.body;
    const sql = 'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)';
    connection.query(sql, [userId, productId, rating, comment], (err, result) => {
        if (err) {
            console.error('Error submitting review:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'Review submitted successfully' });
        }
    });
};

// Get reviews for a product
exports.getReviews = (req, res) => {
    const productId = req.params.productId;
    const sql = 'SELECT * FROM reviews WHERE product_id=?';
    connection.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
};
