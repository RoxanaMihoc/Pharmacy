const BASE_URL = "http://localhost:3000";

//get all brands
export const fetchBrands = async () => {
  try {
    const response = await fetch(`${BASE_URL}/home/brands`);
    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    const data = await response.json();
    return data; // Return the array of brands
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

//get all products by category
export const fetchProductsByCategory = async (category, subcategory) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/product/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data; // Return the array of products
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

//get details about product
export const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/home/product/details/${productId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product details");
    }
    const data = await response.json();
    return data[0]; // Return the first product object
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

//get products with the same brand as current product
export const fetchProductsByBrand = async (brand) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/products?brand=${encodeURIComponent(brand)}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products by brand");
    }
    const data = await response.json();
    return data; // Return the array of products
  } catch (error) {
    console.error("Failed to fetch products by brand:", error);
    throw error; // Re-throw the error for handling in the component
  }
};

// Services/productServices.js
export const fetchAllProducts = async () => {
  try {
    const response = await fetch("http://localhost:3000/home/all-products");

    if (!response.ok) {
      throw new Error("Something went wrong while fetching products!");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error in fetchAllProducts:", error);
    return { success: false, error: error.message };
  }
};


