import React, { useState } from "react";
import HoverButton from "./HoverButton";
import "./styles/second-menu.css";
import "./styles/hoover-button.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons";

// Categories Data
const categoriesData = {
  "Medicamente fara reteta": {
    "Afectiuni ale ficatului si bilei": {
      "1": "Hepatoprotectoare",
      "2":"Afectiuni biliare",
    },
    "Afectiuni digestive": {
      "1": "Antiacide, Antispastice, Balonare",
      "2": "Gastrita si ulcer, Greata si varsaturi",
      "3": "Enzime Digestive",
      "4":"Afectiuni ale cavitatii bucale",
    },
    "Afectiuni dermatologice": {
      "1": "Micoze",
      "2": "Rani",
    },
    "Afectiuni ORL":{
      "1": "Picaturi",
      "2":"Sinuzita",
      "3": "Dureri de gat",
    }
  },
  "Medicamente cu reteta": {
    "Medicamente": {
      "1": "Laborator propriu",
    },
  },
  "Suplimente alimentare": {
    "Vitamine si minerale": {
      "1": "Suplimente Vitamina A",
      "2": "Suplimente Vitamina C",
      "3": "Sistemul digestiv",
    },
  },
  " Frumusete si ingrijire": {
    "Dermatocosmetice": {
      "1": "Machiaj",
      "2": "Corp",
      "3": "Ochi",
    },
  },

};

const SecondaryMenu = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [activeSubmenu2, setActiveSubmenu2] = useState(null);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
    setActiveSubmenu(null);
    setActiveSubmenu2(null);
  };

  const toggleSubmenu = (submenu) => {
    setActiveSubmenu((prev) => (prev === submenu ? null : submenu));
    setActiveSubmenu2(null); // Reset deeper submenu when changing main one
  };

  const toggleSubmenu2 = (submenu) => {
    setActiveSubmenu2((prev) => (prev === submenu ? null : submenu));
  };

  return (
    <div className="second-menu-content">
      <div className="dropdown">
        {/* Categorii Button */}
        <button className="dropbtn" onClick={toggleDropdown}>
          <h2>
            <FontAwesomeIcon icon={faList} /> Categorii
          </h2>
        </button>

        {/* Dropdown Content */}
        {isDropdownVisible && (
          <div className="dropdown-content">
            {Object.keys(categoriesData).map((category) => (
              <div key={category} className="dropright-container">
                <button
                  className="dropright-button"
                  onClick={() => toggleSubmenu(category)}
                >
                  {category}
                </button>

                {/* First Level Dropright Content */}
                {activeSubmenu === category && (
                  <div className="additional-content-container">
                    {Object.keys(categoriesData[category]).map((subcategory) => (
                      <div key={subcategory} className="dropright-container">
                        <button
                          className="dropright-button"
                          onClick={() => toggleSubmenu2(subcategory)}
                        >
                          {subcategory}
                        </button>

                        {/* Second Level Dropright Content */}
                        {activeSubmenu2 === subcategory && (
                          <div className="additional-content-container2">
                            <div className="sub-div2">
                              {Object.values(categoriesData[category][subcategory]).map(
                                (subItem, index) => (
                                  <HoverButton key={index} buttontext={subItem} />
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryMenu;
