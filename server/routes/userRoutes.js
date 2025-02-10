// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken');
const userController = require('../controllers/userController');
console.log("In login");
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/details',verifyToken, userController.getDetailsOfCurrentUser);
router.get('/cart',verifyToken, userController.getCartbyId);
router.get('/cart/:productId',verifyToken, userController.getCartbyId);
router.get('/favorites-list',verifyToken, userController.getFavoritesbyId);

module.exports = router;
