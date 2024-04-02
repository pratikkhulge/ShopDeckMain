const express = require('express');
const productService = require('../services/productService');
const authenticateSession = require('../middleware/authenticateSession'); 
const router = express.Router();

router.use(authenticateSession);

router.get('/all', productService.getProducts);
router.post('/add', productService.AddProducts);
router.put('/update/:id', productService.UpdateProducts);
router.delete('/delete/:id', productService.RemoveProducts);

module.exports = router;
