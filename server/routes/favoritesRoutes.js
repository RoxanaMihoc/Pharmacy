// routes/cart.js
const express = require('express');
const router = express.Router();
const  favoritesController  = require('../controllers/favoritesController');
console.log("Inroute post");
// Route to add a product to the cart
router.post('/favorites', favoritesController.addToFavorites);
router.delete('/favorites/:currentUser/:productId', favoritesController.deleteProductFromFavorites);

module.exports = router;