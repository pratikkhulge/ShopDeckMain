const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.use('/', AuthController);

module.exports = router;
