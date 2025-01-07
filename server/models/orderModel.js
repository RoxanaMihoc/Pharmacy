// backend/models/productModel.js
const mongoose = require("mongoose");
const { ordersDB } = require("../config/database");

const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  identifier: String,
  address: String,
  county: String,
  city: String,
  payment: String,
  addressInfo: String,
  totalPrice: Number,
  user: String,
  status: { type: String, default: 'în așteptare' },
  pharmacist: String,
  orderNumber: String,
  date: { type: Date, default: Date.now },
  cart: {
    type: [
      {
        0: {
          _id: mongoose.Schema.Types.ObjectId,
          category: String,
          price: Number,
          title: String,
          brand: String,
          photo: String,
          insurance: String, // Add insurance if it's part of the product details
        },
        presId: {
          type: String,
          required: true,
        },
      },
    ],
    default: [], // Ensures the field is always an array
  },
  
});

module.exports = ordersDB.model("Order", orderSchema, "orders");
