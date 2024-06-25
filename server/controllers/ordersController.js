const Order = require("../models/orderModel");
const express = require("express");
const router = express.Router();

exports.addToOrders = async (req, res, io, userSockets) => {
  const { cartItems, addressDetails, totalPrice, user, pharmacist } = req.body;
  console.log("In add to orders:", pharmacist);
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
      user: user,
      status: "în așteptare",
      pharmacist: pharmacist,
      orderNumber: orderNumber,
    });
    console.log("Attempting to save:", newOrder);
    await newOrder.save();
    console.log("Sockets: ", userSockets, userSockets[pharmacist]);
    let date = newOrder.date;
    console.log(date);

    if (userSockets[pharmacist] && userSockets[pharmacist].socketId) {
      io.to(userSockets[pharmacist].socketId).emit("new-order", {
        id: newOrder._id,
        message: "A fost plasată o noua comanda.",
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
          user: user,
          status: "Comandă trimisă",
          pharmacist: pharmacist,
          orderNumber,
          orderNumber,
          date,
        },
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
  const { currentUser } = req.params;
  console.log("in get orders");
  try {
    const orders = await Order.find({ user: currentUser });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).send("Server error");
  }
};

exports.changeStatusOrder = async (req, res, io, userSockets) => {
  const { orderNumber, status, patientId } = req.body;

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: orderNumber },
      { $set: { status: status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("Sockets: ", userSockets, userSockets[patientId]);

    if (userSockets[patientId] && userSockets[patientId].socketId) {
      io.to(userSockets[patientId].socketId).emit("order-update", {
      message: `Comanda cu numărul #${orderNumber} este gata de ridicare!`,
      orderNumber: orderNumber,
      status: "Gata de ridicare",
    });
  }

    res.json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res
      .status(500)
      .json({ message: "Failed to update order status due to server error" });
  }
};
