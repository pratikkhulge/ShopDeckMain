const connection = require('../database/db');

// Process checkout
exports.checkout = (req, res) => {
    const userId = req.session.userId;
    const { shippingAddress, billingAddress, paymentMethod, items } = req.body;

    // Step 1: Create a new order in the database
    const createOrderSql = 'INSERT INTO orders (user_id, shipping_address, billing_address, payment_method) VALUES (?, ?, ?, ?)';
    connection.query(createOrderSql, [userId, JSON.stringify(shippingAddress), JSON.stringify(billingAddress), paymentMethod], (err, result) => {
        if (err) {
            console.error('Error creating order:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const orderId = result.insertId;

            // Step 2: Save order items
            const orderItems = items.map(item => [orderId, item.productId, item.quantity]);

            // Check if product IDs exist in the products table
            const productIds = items.map(item => item.productId);
            const getProductSql = 'SELECT id, price FROM products WHERE id IN (?)';
            connection.query(getProductSql, [productIds], (err, productResults) => {
                if (err) {
                    console.error('Error retrieving product details:', err);
                    res.status(500).json({ message: 'Internal server error' });
                } else {
                    const existingProducts = productResults.reduce((acc, cur) => {
                        acc[cur.id] = cur.price;
                        return acc;
                    }, {});

                    // Calculate total items and total amount
                    let totalItems = 0;
                    let totalAmount = 0;

                    for (const item of items) {
                        if (existingProducts.hasOwnProperty(item.productId)) {
                            totalItems += item.quantity;
                            totalAmount += existingProducts[item.productId] * item.quantity;
                        } else {
                            // Return error for non-existing products
                            return res.status(404).json({ message: `Product with ID ${item.productId} is not available or currently out of stock` });
                        }
                    }

                    // Insert order items if all product IDs exist
                    const saveOrderItemsSql = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';
                    connection.query(saveOrderItemsSql, [orderItems], (err, result) => {
                        if (err) {
                            console.error('Error saving order items:', err);
                            res.status(500).json({ message: 'Internal server error' });
                        } else {
                            // Step 3: Respond with success message, order ID, total items, and total amount
                            res.json({ message: 'Checkout successful', orderId, totalItems, totalAmount });
                        }
                    });
                }
            });
        }
    });
};
