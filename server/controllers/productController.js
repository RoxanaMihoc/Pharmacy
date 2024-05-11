// backend/controllers/productController.js
const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

function removeNonLetters(str) {
  // Use a regular expression to replace non-letter characters with an empty string
  const formattedStr = str.replace(/[^a-zA-Z]/g, ' ').toLowerCase();
  // Capitalize the first letter and concatenate it with the rest of the string
  return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
}
// Route to get products by category
router.getProductsByCategory = async (req, res) => {
  const { category, subcategory } = req.params
  console.log("LALA "+ removeNonLetters(category) + " " + removeNonLetters(subcategory));

if(subcategory != 'undefined')
{
  query = {
    category:removeNonLetters(category),
    subcategory2: removeNonLetters(subcategory)
  };
}
else 
{
  query ={ category: removeNonLetters(category) };
}

  try {
    const products = await Product.find( query , 'category title brand price photo');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// for product/productId
router.getProductsById= async (req, res) =>{
  const {productId} = req.params;

  query ={ _id: productId};

  try {
    const product = await Product.find( query , 'category title brand price photo');
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}
//for product/details/productId
router.getProductById= async (req, res) =>{
  const {productId} = req.params;

  query ={ _id: productId};

  try {
    const product = await Product.find( query , 'category title brand price photo availability description subcategory1 subcategory2');
    console.log("In controler " + product);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

}

module.exports = router;
