const express = require('express');
const ordersController  = require('../controllers/ordersController');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();
// Route to add a product to the cart
router.get('/orders/user', verifyToken, ordersController.getOrdersForUser);
// router.put('/orders/:currentUser', verifyToken, ordersController.getOrdersForUser);

module.exports = (io, userSockets) => {
    console.log("in rout o",userSockets);
    router.post('/orders', verifyToken, (req, res) => ordersController.addToOrders(req, res, io, userSockets));
    router.put('/update-order',verifyToken, (req, res) => ordersController.changeStatusOrder(req, res, io, userSockets));
    return router;
  };
