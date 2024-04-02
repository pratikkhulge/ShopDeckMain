const connection = require('../database/db');

exports.getProducts= (req, res) => {
    const sql = 'SELECT * FROM products';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching products:', err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
};

// Add a new product
exports.AddProducts = (req, res) => {
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
};

// Update a product
exports.UpdateProducts = (req, res) => {
    const productId = req.params.id;
    const { title, description, price, images } = req.body;
    const sql = 'UPDATE products SET title=?, description=?, price=?, images=? WHERE id=?';
    connection.query(sql, [title, description, price, JSON.stringify(images), productId], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            res.status(500).json({ message: 'Internal server error' });
        } 
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product updated successfully', productId });
    });
};

// Delete a product
exports.RemoveProducts=(req, res) => {
    const productId = req.params.id;
    const sql = 'DELETE FROM products WHERE id=?';
    connection.query(sql, [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ message: 'Internal server error' });
        } 
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully', productId });

    });
};