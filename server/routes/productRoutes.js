// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
console.log("In route");
router.get('/product/details/:productId', productController.getProductById);
router.get('/product/:category/:subcategory', productController.getProductsByCategory);
router.get('/product/:productId', productController.getProductsById);
router.get('/products', productController.getProductsByBrand);
router.get('/favorites/:productId', productController.getProductById);

module.exports = router;
