// routes/cart.js
const express = require('express');
const router = express.Router();
const  favoritesController  = require('../controllers/favoritesController');
const { verifyToken } = require('../middleware/verifyToken');
console.log("Inroute post");
// Route to add a product to the cart
router.post('/favorites', verifyToken, favoritesController.addToFavorites);
router.delete('/favorites/:productId', verifyToken, favoritesController.deleteProductFromFavorites);

module.exports = router;