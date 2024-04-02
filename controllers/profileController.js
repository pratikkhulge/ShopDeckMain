const express = require('express');
const profileService = require('../services/profileService');
const authenticateSession = require('../middleware/authenticateSession'); 
const router = express.Router();

router.use(authenticateSession);

router.get('/', profileService.getProfile);
router.put('/update', profileService.updateProfile);


module.exports = router;
