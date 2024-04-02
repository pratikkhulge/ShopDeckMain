const express = require('express');
const cartService = require('../services/cartService');
const authenticateSession = require('../middleware/authenticateSession'); 
const router = express.Router();

router.use(authenticateSession);

router.get('/all', cartService.getSoppingCart);
router.post('/add', cartService.AddToCart);
router.delete('/delete/:itemId', cartService.RemoveFromCart);

module.exports = router;
