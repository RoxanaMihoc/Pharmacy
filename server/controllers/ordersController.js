const Order = require("../models/orderModel");
const express = require("express");
const router = express.Router();

const addToOrders = async (req, res) => {
  const { cartId, addressDetails } = req.body;
  console.log(cartId);

  const {firstName, lastName, phone, email, CNP, address,county,city,paymentMethod, additionalInfo} = addressDetails;

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
      cartId: [],
    });
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

module.exports = { addToOrders };
