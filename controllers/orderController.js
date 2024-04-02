const express = require('express');
const orderService = require('../services/orderService');
const authenticateSession = require('../middleware/authenticateSession'); 
const router = express.Router();

router.use(authenticateSession);

router.get('/all', orderService.getOrders);
router.put('/cancel/:id', orderService.cancelOrder);

module.exports = router;
