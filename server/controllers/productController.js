// backend/controllers/productController.js
const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");

function removeNonLetters(str) {
  // Use a regular expression to replace non-letter characters with an empty string
  const formattedStr = str.replace(/[^a-zA-Z]/g, " ").toLowerCase();
  // Capitalize the first letter and concatenate it with the rest of the string
  return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
}
router.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};
// Route to get products by category
router.getProductsByCategory = async (req, res) => {
  const { category, subcategory } = req.params;

  if (subcategory != "undefined") {
    query = {
      category: removeNonLetters(category),
      subcategory2: removeNonLetters(subcategory),
    };
  } else {
    query = { category: removeNonLetters(category) };
  }

  try {
    // Define default fields
    let fields = "category title brand price photo insurance permitted";

    // Fetch products with dynamic projection
    const products = await Product.find(query, fields);

    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found with given category." });
    }
    
    console.log(
        "BLABLA",
        removeNonLetters(category),
        removeNonLetters(subcategory),
        products
    );

    res.json(products);
} catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
}
};

// for product/productId
router.getProductsById = async (req, res) => {
  const { productId } = req.params;
  console.log("Product: ", productId);

  query = { _id: productId };

  try {
    const product = await Product.find(
      query,
      "category title brand price photo insurance"
    );
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};
//for product/details/productId
router.getProductById = async (req, res) => {
  const { productId } = req.params;

  query = { _id: productId };

  try {
    const product = await Product.find(
      query,
      "category title brand price photo availability description subcategory1 subcategory2 prospect"
    );
    console.log("In controler " + product);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

// for product/productId
router.getProductsByBrand = async (req, res) => {
  const brand = req.query.brand;

  query = { brand: brand };

  try {
    const product = await Product.find(
      query,
      "category title brand price photo"
    );
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Error" });
  }
};

router.getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = router;
