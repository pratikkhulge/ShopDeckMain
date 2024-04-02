const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');

router.use('/', ReviewController);

module.exports = router;
