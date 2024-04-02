const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkoutController');

router.use('/', CheckoutController);

module.exports = router;
