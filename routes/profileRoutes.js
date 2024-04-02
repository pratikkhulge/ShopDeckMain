const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');

router.use('/', ProfileController);

module.exports = router;
