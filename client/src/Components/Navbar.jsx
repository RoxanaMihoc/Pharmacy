import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";

const Navbar = () => {
  return (
    <>
      <div className="navbar">
        <div className="top-right">
          <p>&copy; 2023 Your Website Name</p>
        </div>

        {/* Navigation buttons */}
        <div className="navigation-buttons">
          <div className="icon-text">
            <button>
              <span>Login/Register</span>
              <FontAwesomeIcon
                icon={faUser}
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
