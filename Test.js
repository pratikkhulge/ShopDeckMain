const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');

const app = express();
app.use(bodyParser.json());

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '1234', 
    database: 'shopdeck'
});

// Connect to MySQL
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});


// Authentication middleware
const authenticateSession = (req, res, next) => {
    if (req.session && req.session.userId) {
        // User is authenticated
        next();
    } else {
        res.sendStatus(401);
    }
};

// Register endpoint
app.post('/register', (req, res) => {
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
});

// Login endpoint
app.post('/login', (req, res) => {
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
});

// Logout endpoint
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logout successful' });
});

// Protected endpoint
app.get('/protected', authenticateSession, (req, res) => {
    res.json({ message: 'Protected endpoint accessed successfully' });
});


// Product Management

// Get all products
app.get('/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
});

// Add a new product
app.post('/products', authenticateSession, (req, res) => {
    const { title, description, price, images } = req.body;
    const sql = 'INSERT INTO products (title, description, price, images) VALUES (?, ?, ?, ?)';
    connection.query(sql, [title, description, price, JSON.stringify(images)], (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'Product added successfully', productId: result.insertId });
        }
    });
});

// Update a product
app.put('/products/:id', authenticateSession, (req, res) => {
    const productId = req.params.id;
    const { title, description, price, images } = req.body;
    const sql = 'UPDATE products SET title=?, description=?, price=?, images=? WHERE id=?';
    connection.query(sql, [title, description, price, JSON.stringify(images), productId], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json({ message: 'Product updated successfully', productId });
        }
    });
});

// Delete a product
app.delete('/products/:id', authenticateSession, (req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE id=?';
    connection.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json({ message: 'Product deleted successfully', productId });
        }
    });
});

// Shopping Cart Management

// Get shopping cart
app.get('/cart', authenticateSession, (req, res) => {
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
});

// Add item to cart
app.post('/cart', authenticateSession, (req, res) => {
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
});

// Remove item from cart
app.delete('/cart/:itemId', authenticateSession, (req, res) => {
    const userId = req.session.userId;
    const itemId = req.params.itemId;
    const sql = 'DELETE FROM cart WHERE user_id=? AND product_id=?';
    connection.query(sql, [userId, itemId], (err, result) => {
        if (err) {
            console.error('Error removing item from cart:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json({ message: 'Item removed from cart successfully' });
        }
    });
});

// Checkout

// Process checkout
app.post('/checkout', authenticateSession, (req, res) => {
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
            const saveOrderItemsSql = 'INSERT INTO order_items (order_id, product_id, quantity) VALUES ?';
            connection.query(saveOrderItemsSql, [orderItems], (err, result) => {
                if (err) {
                    console.error('Error saving order items:', err);
                    res.status(500).json({ message: 'Internal server error' });
                } else {
                    // Step 3: Calculate total amount
                    let totalAmount = 0;
                    for (const item of items) {
                        totalAmount += item.price * item.quantity;
                    }

                    // Step 4: Respond with success message and order ID
                    res.json({ message: 'Checkout successful', orderId, totalAmount });
                }
            });
        }
    });
});


// Order Management

// Get user's orders
app.get('/orders', authenticateSession, (req, res) => {
    const userId = req.session.userId;

    // Implement logic to fetch user's orders from the database
    const sql = 'SELECT * FROM orders WHERE user_id=?';
    connection.query(sql, [userId], (err, result) => {
        if (err) {
            console.error('Error fetching user orders:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
});

// Cancel an order
app.put('/orders/:id/cancel', authenticateSession, (req, res) => {
    const orderId = req.params.id;

    // Implement logic to cancel an order in the database
    const sql = 'UPDATE orders SET status=? WHERE id=?';
    connection.query(sql, ['Cancelled', orderId], (err, result) => {
        if (err) {
            console.error('Error cancelling order:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json({ message: 'Order cancelled successfully', orderId });
        }
    });
});

// User Profile

// Get user profile
app.get('/profile', authenticateSession, (req, res) => {
    const userId = req.session.userId;

    // Implement logic to fetch user's profile information from the database
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
});

// Update user profile
app.put('/profile', authenticateSession, (req, res) => {
    const userId = req.session.userId;
    const { email, password } = req.body;

    // Implement logic to update user's profile information in the database
    // For example, updating email or password
    const sql = 'UPDATE users SET email=?, password=? WHERE id=?';
    connection.query(sql, [email, password, userId], (err, result) => {
        if (err) {
            console.error('Error updating user profile:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json({ message: 'User profile updated successfully' });
        }
    });
}); 

// Review and Ratings

// Submit a review
app.post('/products/:productId/reviews', authenticateSession, (req, res) => {
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
});

// Get reviews for a product
app.get('/products/:productId/reviews', (req, res) => {
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
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});
