const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

router.use('/', OrderController);

module.exports = router;
