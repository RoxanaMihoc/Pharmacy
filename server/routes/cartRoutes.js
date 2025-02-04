// routes/cart.js
const express = require('express');
const router = express.Router();
const  cartController  = require('../controllers/cartController');
const { verifyToken } = require('../middleware/verifyToken');
console.log("Inroute post");
// Route to add a product to the cart
router.post('/add', verifyToken, cartController.addToCart);
router.delete('/cart/:currentUser/:productId', verifyToken, cartController.deleteProductFromCart);
router.delete('/cart/:currentUser', verifyToken, cartController.deleteCartFromUser);

module.exports = router;
