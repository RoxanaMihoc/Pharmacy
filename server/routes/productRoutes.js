// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
console.log("In route");
router.get('/:category', productController.getProductsByCategory);

module.exports = router;
