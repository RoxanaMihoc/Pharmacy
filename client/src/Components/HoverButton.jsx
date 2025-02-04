// HoverButton.js
import React, { useState } from "react";
import { Link } from "react-router-dom";

const HoverButton = ({ buttontext, setCategory, setSubcategory }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // const setCategoryButton = () => {
  //   setCategory("medicamente-otc");
  //   switch (buttontext) {
  //     case "Afectiuni ale cavitatii bucale": {
  //       setSubcategory("afectiuni-ale-cavitatii-bucale");
  //       break;
  //     }
  //     case "Antiacide, Antispastice, Balonare": {
  //       setSubcategory("antispastice-balonare-constipatie");
  //       break;
  //     }
  //     case "Enzime Digestive": {
  //       setSubcategory("enzime-digestive");
  //       break;
  //     }
  //     case "Gastrita si ulcer, Greata si varsaturi": {
  //       setSubcategory("greata-gastrita");
  //       break;
  //     }
  //     default: {
  //       setSubcategory("");
  //       break;
  //     }
  //   }
  // };

  const getButtonLink = () => {
    // Add conditions for different buttontext values
    const linkMap = {
      "Medicamente fara reteta": "/home/medicamente-otc",
      "Hepatoprotectoare": "/home/medicamente-otc/hepatoprotectoare",
      "Afectiuni biliare": "/home/medicamente-otc/afectiuni-biliare",
      "Afectiuni ale cavitatii bucale":
        "/home/medicamente-otc/afectiuni-ale-cavitatii-bucale",
      "Antiacide, Antispastice, Balonare":
        "/home/medicamente-otc/antispastice-balonare-antiacide",
      "Enzime Digestive": "/home/medicamente-otc/enzime-digestive",
      "Gastrita si ulcer, Greata si varsaturi":
        "/home/medicamente-otc/greata-gastrita",

      "Afectiuni dermatologice": "/home/afectiuni-dermatologice",
      "Micoze": "/home/medicamente-otc/micoze",
      "Rani": "/home/medicamente-otc/rani",

      "Afectiuni ORL": "/home/afectiuni-orl",
      "Picaturi": "/home/medicamente-otc/picaturi",
      "Sinuzita": "/home/medicamente-otc/sinuzita",
      "Dureri de gat": "/home/medicamente-otc/dureri",

      "Suplimente alimentare": "/home/suplimente-alimentare",
      "Suplimente Vitamina A": "/home/suplimente-alimentare/vitamina-a",
      "Suplimente Vitamina C": "/home/suplimente-alimentare/vitamina-c",
      "Sistemul digestiv": "/home/suplimente-alimentare/sistemul-digestiv",

      " Frumusete si ingrijire": "/home/frumusete-si-ingrijire",
      "Machiaj":"/home/frumusete-si-ingrijire/machiaj",
      "Corp": "/home/frumusete-si-ingrijire/corp",
      "Ochi": "/home/frumusete-si-ingrijire/ochi",

      "Medicamente cu reteta": "/home/medicamente-cu-reteta", 
       "Laborator propriu": "/home/medicamente-reteta/laborator-propriu",

      // Add more mappings as needed
    };
    // Return the link for the current buttontext value or default to '/'
    console.log("Hover", buttontext);
    return linkMap[buttontext];
    // Add more conditions as needed

    // Default to '/' if no specific link is defined
    return "/";
  };

  return (
    <div className="hover-button-container">
      <Link to={getButtonLink()}>
        <div
          className="hover-button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {buttontext}
        </div>
      </Link>
    </div>
  );
};

export default HoverButton;
