const express = require('express');
const router = express.Router();
const ordersController  = require('../controllers/ordersController');
// Route to add a product to the cart
router.get('/orders', ordersController.getAllOrders);
router.get('/orders/:currentUser', ordersController.getOrdersForUser);
router.post('/orders', ordersController.addToOrders);

module.exports = router;