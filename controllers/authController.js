const express = require('express');
const { protected, Register, Login, Logout } = require('../services/authService');
const router = express.Router();
router.get('/protected', protected);
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);


module.exports = router;