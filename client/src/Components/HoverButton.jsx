// HoverButton.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HoverButton = ({ buttontext, additionalContent }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getButtonLink = () => {
    // Add conditions for different buttontext values
    const linkMap = {
      'Medicamente fara reteta': '/home/medicamente-otc',
      'Afectiuni ale cavitatii bucale': '/home/medicamente-otc/afectiuni-ale-cavitatii-bucale',
      'Antiacide, Antispastice, Balonare': '/home/medicamente-otc/antispastice-balonare-constipatie',
      'Enzime Digestive': '/home/medicamente-otc/enzime-digestive',
      'Gastrita si ulcer, Greata si varsaturi': '/home/medicamente-otc/greata-gastrita'
      // Add more mappings as needed
    };
    // Return the link for the current buttontext value or default to '/'
    return linkMap[buttontext];
    // Add more conditions as needed

    // Default to '/' if no specific link is defined
    return '/';
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

