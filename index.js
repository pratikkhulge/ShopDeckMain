const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');
const checkoutRoutes = require('./routes/checkoutRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const profileRoutes = require('./routes/profileRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');


const app = express();
app.use(bodyParser.json());

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true
}));


app.use('/cart',cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/users', authRoutes);
app.use('/profile', profileRoutes);


// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}`);
});
