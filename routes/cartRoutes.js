const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

router.use('/', CartController);

module.exports = router;
