const Order = require("../models/orderModel");
const express = require("express");
const router = express.Router();

exports.addToOrders = async (req, res, io, userSockets) => {
  const { cartItems, addressDetails, totalPrice, currentUser, pharmacist } = req.body;
  console.log("In add to orders:",pharmacist);
  console.log("In add to orders:", cartItems);

  const generateRandomNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

  const orderNumber = generateRandomNumber();
  const {
    firstName,
    lastName,
    phone,
    email,
    identifier,
    address,
    county,
    city,
    paymentMethod,
    additionalInfo,
  } = addressDetails;

  try {
    const newOrder = new Order({
      firstName,
      lastName,
      phone,
      email,
      identifier,
      address,
      county,
      city,
      paymentMethod,
      additionalInfo,
      cart: cartItems,
      totalPrice: totalPrice,
      user: currentUser,
      status: "Pending",
      pharmacist: pharmacist,
      orderNumber: orderNumber,
    });
    console.log("Attempting to save:", newOrder);
    await newOrder.save();
    console.log("Sockets: ",userSockets,userSockets[pharmacist] );

    if (userSockets[pharmacist] && userSockets[pharmacist].socketId) {
    io.to(userSockets[pharmacist].socketId).emit('new-order', {
      id: newOrder._id,
      message: 'A new order has been placed.',
      orderDetails: {
        firstName,
        lastName,
        phone,
        email,
        identifier,
        address,
        county,
        city,
        paymentMethod,
        additionalInfo,
        cart: cartItems,
        totalPrice: totalPrice,
        user: currentUser,
        status: "Comandă trimisă",
        pharmacist: pharmacist,
        orderNumber, orderNumber
      }
  });
}

    res.status(200).json({
      success: true,
      message: "Order saved successfully",
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    console.log("In orders admin");
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersForUser = async (req, res) => {
  const {currentUser} = req.params;
  try {
    const orders = await Order.find({ user: currentUser });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).send('Server error');
  }
  
};


