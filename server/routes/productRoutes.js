const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken'); // Import middleware
const productController = require('../controllers/productController');

console.log("In route");

router.get('/product/details/:productId', verifyToken, productController.getProductById);
router.get('/product/:category/:subcategory', verifyToken, productController.getProductsByCategory);
router.get('/product/:productId', verifyToken, productController.getProductsById);
router.get('/products', verifyToken, productController.getProductsByBrand);
router.get('/favorites/:productId', verifyToken, productController.getProductById);
router.get('/all-products', verifyToken, productController.getAllProducts);
router.get('/brands', verifyToken, productController.getBrands);

module.exports = router;
