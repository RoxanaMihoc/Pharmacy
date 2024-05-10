// routes/cart.js
const express = require('express');
const router = express.Router();
const  cartController  = require('../controllers/cartController');
console.log("Inroute post");
// Route to add a product to the cart
router.post('/add', cartController.addToCart);
router.delete('/cart/:currentUser/:productId', cartController.deleteProductFromCart);

module.exports = router;
