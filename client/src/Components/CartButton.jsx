import React, { useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import "./cart-button.css"

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


function CartButton() {
  const [isHovered, setIsHovered] = useState(false);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Product 1', price: 10.00 },
    { id: 2, name: 'Product 2', price: 15.00 },
    { id: 3, name: 'Product 3', price: 20.00 }
  ]);
  const [total, setTotal] = useState(45.00); // Total price of the example products

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className="cart-button" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <FontAwesomeIcon
        icon={faCartShopping}
        style={{ marginRight: "5px", fontSize: "30px" }}
      />
      {isHovered && (
        <div className="cart-preview">
          <h3>Products in Cart</h3>
          <ul>
            {cartItems.map(item => (
              <li key={item.id}>{item.name} - ${item.price.toFixed(2)}</li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
          <button>View Cart</button>
        </div>
      )}
    </div>
  );
}

export {CartButton,addToCart, addToCartF};

