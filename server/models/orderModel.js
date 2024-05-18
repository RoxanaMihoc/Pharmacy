// backend/models/productModel.js
const mongoose = require('mongoose');
const { ordersDB } = require('../config/database');

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
  cart: Array
});

module.exports = ordersDB.model('Order', orderSchema, 'orders');