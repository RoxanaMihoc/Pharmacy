// backend/models/productModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  category: String,
  title: String,
  brand: String,
  price: Number,
  photo: String,
  // ... other fields ...
});

module.exports = mongoose.model('Product', productSchema);
