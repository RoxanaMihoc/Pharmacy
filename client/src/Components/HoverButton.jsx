// HoverButton.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HoverButton = ({ buttonText, additionalContent }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getButtonLink = () => {
    // Add conditions for different buttonText values
    if (buttonText === 'Medicamente fara reteta') {
      return '/home/medicamente-otc';
    } else if (buttonText === 'Afectiuni Digestive') {
      return '/home/medicamente-otc/afectiuni-digestive';
    }
    // Add more conditions as needed

    // Default to '/' if no specific link is defined
    return '/';
  };

  return (
    <div className="hover-button-container">
      <Link to={getButtonLink()}>
        <button
          className="hover-button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {buttonText}
        </button>
      </Link>
    </div>
  );
};

export default HoverButton;

