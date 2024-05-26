// backend/models/productModel.js
const mongoose = require("mongoose");
const { ordersDB } = require("../config/database");

const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  CNP: String,
  address: String,
  county: String,
  city: String,
  payment: String,
  addressInfo: String,
  totalPrice: Number,
  user: String,
  status: String,
  cart: {
    type: [[{
      _id: mongoose.Schema.Types.ObjectId,
      category: String,
      price: Number,
      title: String,
      brand: String,
      photo: String
    }]],
    default: [] // Ensures the field is always an array
  }
});

module.exports = ordersDB.model("Order", orderSchema, "orders");
