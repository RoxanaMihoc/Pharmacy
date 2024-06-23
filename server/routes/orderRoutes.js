const express = require('express');
const ordersController  = require('../controllers/ordersController');
const router = express.Router();
// Route to add a product to the cart
router.get('/orders', ordersController.getAllOrders);
router.get('/orders/:currentUser', ordersController.getOrdersForUser);

module.exports = (io, userSockets) => {
    console.log("in rout o",userSockets);
    router.post('/orders', (req, res) => ordersController.addToOrders(req, res, io, userSockets));
    return router;
  };
