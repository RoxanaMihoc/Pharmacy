// src/components/menu.js
import React, { useState } from "react";
import CartPreview from "./CartPreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faHeart,
  faArrowCircleRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import "./menu.css";

const Menu = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      image: "path/to/image.jpg",
      title: "Un om mai bun - Louise Penny",
      quantity: 1,
      price: 14.7,
      originalPrice: 55.0,
    },
    // Add more items here for testing
  ]);
  const [showCartPreview, setShowCartPreview] = useState(false);

  const handleShowCartPreview = () => setShowCartPreview(true);
  const handleCloseCartPreview = () => setShowCartPreview(false);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="menu">
        <div className="menu-content">
          <p>&copy; 2023 Your Website Name</p>

          {/* Search bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search a product..."
              className="inputSearch"
            />
            <button className="searchButton">
              <FontAwesomeIcon
                icon={faSearch}
                style={{ marginRight: "0.5px", fontSize: "16px" }}
              />
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="navigation-buttons">
            <button>
              <FontAwesomeIcon
                icon={faUser}
                style={{ marginRight: "5px", fontSize: "30px" }}
              />
            </button>
            <button>
              <FontAwesomeIcon
                icon={faHeart}
                style={{ marginRight: "5px", fontSize: "30px" }}
              />
            </button>
            <button onClick={handleShowCartPreview}>
              <FontAwesomeIcon icon={faCartShopping} 
               style={{ marginRight: "5px", fontSize: "30px" }}/>
            </button>
          </div>
          <CartPreview
            show={showCartPreview}
            handleClose={handleCloseCartPreview}
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
          />
        </div>
      </div>
    </>
  );
};

export default Menu;
