// Secondarymenu.jsx

import React from "react";
import HoverButton from "./HoverButton";
import "./second-menu.css";
import "./hoover-button.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from "@fortawesome/free-solid-svg-icons";

const SecondaryMenu = () => {
  return (
    <div className="second-menu-content">
      {/* Add content for the secondary menu */}

      {/* Secondary menu items */}

      <div className="dropdown">
        <button className="dropbtn">
          <h2>
            <FontAwesomeIcon icon={faList} /> Categorii
          </h2>
        </button>
        <div className="dropdown-content">
          <div className="button-h">
            <HoverButton buttontext="Medicamente fara reteta" />
            <div className="additional-content-container">
              <div className="sub-div">
                <h2> Afectiuni Digestive </h2>
                <HoverButton buttontext="Afectiuni ale cavitatii bucale" />
                <HoverButton buttontext="Antiacide, Antispastice, Balonare" />
                <HoverButton buttontext="Enzime Digestive" />
                <HoverButton buttontext="Gastrita si ulcer, Greata si varsaturi" />
              </div>
              <div className="sub-div">
                <h2>Afectiuni dermatologice</h2>
                Arsuri Caderea parului Tratamente negi si bataturi Micoze Rani
                Herpes
              </div>
              <div className="sub-div">
                <h2>Afectiuni ORL </h2>
                Dureri de gat Picaturi pentru nas Sinuzita Afectiuni auriculare
              </div>
              <div className="sub-div">
                <h2>Altele</h2>
                Afectiuni venoase Alergii Durere Raceala si gripa Renuntare la
                fumat Sistemul genito-urinar Stres si oboseala Vitamine si
                minerale Afectiuni ale ficatului si ale bilei
              </div>
            </div>
          </div>

          <div className="button">
            <HoverButton buttontext="Button 1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecondaryMenu;
