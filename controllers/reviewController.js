const express = require('express');
const ReviewsService = require('../services/reviewService');
const authenticateSession = require('../middleware/authenticateSession'); 
const router = express.Router();

router.use(authenticateSession);

router.get('/products/:productId', ReviewsService.getReviews);
router.post('/products/:productId', ReviewsService.AddReviews);

module.exports = router;
