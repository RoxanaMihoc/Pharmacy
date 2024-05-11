// backend/models/productModel.js
const mongoose = require('mongoose');
const { usersDB, productsDB } = require('../config/database');

const productSchema = new mongoose.Schema({
  category: String,
  title: String,
  brand: String,
  price: Number,
  photo: String,
  subcategory1: String,
  subcategory2: String,
  availability: String,
  description: String
});

module.exports = productsDB.model('Product', productSchema, 'products');
