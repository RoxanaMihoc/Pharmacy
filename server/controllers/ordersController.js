const Order = require("../models/orderModel");
const express = require("express");
const router = express.Router();

const addToOrders = async (req, res) => {
  const { cartItems, addressDetails, totalPrice, currentUser } = req.body;
  console.log("In add to orders:", cartItems);

  const {
    firstName,
    lastName,
    phone,
    email,
    CNP,
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
      CNP,
      address,
      county,
      city,
      paymentMethod,
      additionalInfo,
      cart: cartItems,
      totalPrice: totalPrice,
      user: currentUser,
      status: "Pending",
    });
    console.log("Attempting to save:", newOrder);
    await newOrder.save();
    res.status(200).json({
      success: true,
      message: "Order saved successfully",
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getAllOrders = async (req, res) => {
  try {
    console.log("In orders admin");
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getOrdersForUser = async (req, res) => {
  const {currentUser} = req.params;
  try {
    const orders = await Order.find({ user: currentUser });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).send('Server error');
  }
  
};
module.exports = { addToOrders, getAllOrders, getOrdersForUser };

