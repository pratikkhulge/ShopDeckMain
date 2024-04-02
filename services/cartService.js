const connection = require('../database/db');

// Get shopping cart
exports.getSoppingCart =  (req, res) => {
    const userId = req.session.userId;
    const sql = 'SELECT * FROM cart WHERE user_id=?';
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching cart:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
};

// Add item to cart
exports.AddToCart=(req, res) => {
    const userId = req.session.userId;
    const { productId, quantity } = req.body;
    const sql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
    connection.query(sql, [userId, productId, quantity], (err, result) => {
        if (err) {
            console.error('Error adding item to cart:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'Item added to cart successfully' });
        }
    });
};

// Remove item from cart
exports.RemoveFromCart = (req, res) => {
    const userId = req.session.userId;
    const itemId = req.params.itemId;
    const sqlSelect = 'SELECT * FROM cart WHERE user_id=? AND product_id=?';
    connection.query(sqlSelect, [userId, itemId], (err, result) => {
        if (err) {
            console.error('Error checking item in cart:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            // Check if the item exists in the cart
            if (result.length === 0) {
                res.status(404).json({ message: 'No such item in cart' });
            } else {
                const removedItem = result[0]; // Get the details of the removed item
                // Item exists, proceed to delete it
                const sqlDelete = 'DELETE FROM cart WHERE user_id=? AND product_id=?';
                connection.query(sqlDelete, [userId, itemId], (err, result) => {
                    if (err) {
                        console.error('Error removing item from cart:', err);
                        res.status(500).json({ message: 'Internal server error' });
                    } else {
                        res.json({
                            message: 'Item removed from cart successfully',
                            removedItem: {
                                itemId: removedItem.product_id,
                                quantity: removedItem.quantity
                            }
                        });
                    }
                });
            }
        }
    });
};
