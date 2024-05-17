// src/components/menu.js
import React, { useState } from "react";
import CartPreview from "./CartPreview";
import { useLocation, useHistory } from "react-router-dom";
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
  const [showCartPreview, setShowCartPreview] = useState(false);
  const history = useHistory();

  const location = useLocation();

  const handleShowCartPreview = async() => {
    if (location.pathname !== "/home/cart-page") {
      setShowCartPreview(true);
    }
  };
  const handleCloseCartPreview = () => setShowCartPreview(false);

  const handleFavoritesButton = () =>{
    history.push('/home/favorites-page');
  }


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
                onClick={handleFavoritesButton}
                style={{ marginRight: "5px", fontSize: "30px" }}
              />
            </button>
            <button onClick={handleShowCartPreview} disabled={location.pathname === "/home/cart-page"}>
              <FontAwesomeIcon icon={faCartShopping} 
               style={{ marginRight: "5px", fontSize: "30px" }}/>
            </button>
          </div>
          <CartPreview
            show={showCartPreview}
            handleClose={handleCloseCartPreview}
          />
        </div>
      </div>
    </>
  );
};

export default Menu;
