const express = require('express');
const CheckoutService = require('../services/checkoutService');
const authenticateSession = require('../middleware/authenticateSession'); 
const router = express.Router();

router.use(authenticateSession);

router.post('/', CheckoutService.checkout);


module.exports = router;
