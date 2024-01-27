// ProductList.jsx

import React from 'react';
import './product.css';

const products = [
  { id: 1, name: 'Product 1', price: 20, image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Product 2', price: 30, image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Product 3', price: 25, image: 'https://via.placeholder.com/150' },
  { id: 4, name: 'Product 4', price: 40, image: 'https://via.placeholder.com/150' },
  { id: 5, name: 'Product 5', price: 15, image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Product 6', price: 35, image: 'https://via.placeholder.com/150' },
  // Add more products as needed
];

const ProductList = () => {
  const handleAddToCart = (productId) => {
    // Implement your logic for adding to cart
    console.log(`Added product ${productId} to cart`);
  };

  const handleAddToWishlist = (productId) => {
    // Implement your logic for adding to wishlist
    console.log(`Added product ${productId} to wishlist`);
  };

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <div className='buttons'>
          <button onClick={() => handleAddToCart(product.id)}>Add to Cart</button>
          <button onClick={() => handleAddToWishlist(product.id)}>Add to Wishlist</button>
        </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
