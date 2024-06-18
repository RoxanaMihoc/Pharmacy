import React, { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';

const addToCart = async (userId, productId) => {
  try {
    console.log('Product added to cart:', userId, productId);
    const response = await fetch(`http://localhost:3000/home/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, productId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const data = await response.json();
    printProductsToCart(data);
    return { success: true, message: 'Product added to cart successfully' };
    // Handle successful response (e.g., display a success message)
  } catch (error) {
    console.error('Error adding product to cart:', error);
    // Handle error (e.g., display an error message)
  }
};

const printProductsToCart = async (data) => {
  console.log("In print ");
  console.log(data);
};

const addToCartF = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:3000/home/product/${productId}`
    );

    if (!response.ok) {
      throw new Error('Failed to add product to cart');
    }

    const data = await response.json();
    printProductsToCart(data);
    return { success: true, data};
    // Handle successful response (e.g., display a success message)
  } catch (error) {
    console.error('Error adding product to cart:', error);
    // Handle error (e.g., display an error message)
  }
};

export {addToCart, addToCartF};

