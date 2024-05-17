// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
console.log("In login");
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/cart/:currentUser', userController.getCartbyId);
router.get('/cart/:currentUser/:productId', userController.getCartbyId);
router.get('/favorites/:currentUser', userController.getFavoritesbyId);

module.exports = router;
