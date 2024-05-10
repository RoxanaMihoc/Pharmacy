// Secondarymenu.jsx

import React from "react";
import HoverButton from "./HoverButton";
import "./second-menu.css";
import "./hoover-button.css";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

const SecondaryMenu = () => {
  const contentForButton1 = [
    <p key="text">This is additional content for Button 1</p>,
    <img key="image" src="path/to/image1.jpg" alt="Image 1" />,
  ];
  return (
    <div className="second-menu-content">
      {/* Add content for the secondary menu */}

      {/* Secondary menu items */}

      <div className="dropdown">
        <button className="dropbtn">Categories</button>
        <div className="dropdown-content">
          <div className="button">
            <HoverButton buttontext="Medicamente fara reteta"  />
            <div className="additional-content-container">
              <div className="sub-additional-content-container1">
                <div className="sub-div">
                <h3> Afectiuni Digestive  </h3>
                  <HoverButton buttontext="Afectiuni ale cavitatii bucale" /> 
                  <HoverButton buttontext="Antiacide, Antispastice, Balonare"/>
                  <HoverButton buttontext="Enzime Digestive" />
                  <HoverButton buttontext="Gastrita si ulcer, Greata si varsaturi"/>
                </div>
                <div className="sub-div">
                  <h2>Afectiuni dermatologice</h2>
                  Arsuri Caderea parului Tratamente negi si bataturi Micoze Rani
                  Herpes
                </div>
                <div className="sub-div">
                  <h2>Afectiuni ORL </h2>
                  Dureri de gat Picaturi pentru nas Sinuzita Afectiuni
                  auriculare
                </div>
                <div className="sub-div">
                  <h2>Altele</h2>
                  Afectiuni venoase Alergii Durere Raceala si gripa Renuntare la
                  fumat Sistemul genito-urinar Stres si oboseala Vitamine si
                  minerale Afectiuni ale ficatului si ale bilei
                </div>
              </div>
              <div className="sub-additional-content-container2"></div>

              
            </div>
          </div>

          <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">LALALA</div>
          </div>
          {/* <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">NU</div>
          </div>
          <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">BLA BLA</div>
          </div>
          <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">LALALA</div>
          </div>
          <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">LALALA</div>
          </div>
          <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">LALALA</div>
          </div>
          <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">LALALA</div>
          </div>
          <div className="button">
            <HoverButton buttontext="Button 1" />
            <div className="additional-content-container">LALALA</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SecondaryMenu;
