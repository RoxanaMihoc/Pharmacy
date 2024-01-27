// backend/controllers/productController.js
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Route to get products by category
router.getProductsByCategory = async (req, res) => {
  const { category } = req.params
  categoryOk = category;
if(category == "medicamente-otc")
{
  categoryOk= "Medicamente OTC"
}
console.log(categoryOk);

  try {
    const products = await Product.find( {category: categoryOk} , 'category title brand price photo');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = router;
