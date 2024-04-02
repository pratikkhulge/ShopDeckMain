const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

router.use('/', ProductController);

module.exports = router;
