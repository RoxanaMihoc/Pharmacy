// src/components/menu.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "./menu.css";

const Menu = () => {
  return (
    <>
      <div className="menu">
          <div className="menu-content">
            <p>&copy; 2023 Your Website Name</p>

            {/* Search bar */}
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
              <button type="button">Search</button>
            </div>

            {/* Navigation buttons */}
            <div className="navigation-buttons">
              <button>
                <FontAwesomeIcon
                  icon={faUser}
                  style={{ marginRight: "5px", fontSize: "30px" }}
                />
                <div className="icon-text">
                  <span>Login/Register</span>
                </div>
              </button>
              <button>
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{ marginRight: "5px", fontSize: "30px" }}
                />
                <div className="icon-text">
                  <span>Wishlist</span>
                </div>
              </button>

              <button>
                <FontAwesomeIcon
                  icon={faCartShopping}
                  style={{ marginRight: "5px", fontSize: "30px" }}
                />
                <div className="icon-text">
                  <span>Cart</span>
                  <span>0.00 Lei</span>
                </div>
              </button>
            </div>
          </div>
        </div>
        
    </>
  );
};

export default Menu;
