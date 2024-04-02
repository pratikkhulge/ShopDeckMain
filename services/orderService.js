const connection = require('../database/db');

exports.getOrders = (req, res) => {
    const userId = req.session.userId;
    const sql = 'SELECT * FROM orders WHERE user_id=?';
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user orders:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
};

// Cancel an order
exports.cancelOrder = (req, res) => {
    const orderId = req.params.id;
    const sql = 'UPDATE orders SET status=? WHERE id=?';
    connection.query(sql, ['Cancelled', orderId], (err, result) => {
        if (err) {
            console.error('Error cancelling order:', err);
            res.status(500).json({ message: 'Internal server error' });
        } 
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order cancelled successfully', orderId });
        
    });
};