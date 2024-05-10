// Gallery.jsx

import React, { useState } from 'react';
import './gallery.css';

const images = [
  'https://th.bing.com/th/id/OIP.0pJkvGg99CrhiaNREWzg2gHaEN?rs=1&pid=ImgDetMain',
  'https://th.bing.com/th/id/R.a24febcb19eec58be8669a1ae926a443?rik=I2BU%2bzU%2fA5B9VQ&riu=http%3a%2f%2fk46.kn3.net%2ftaringa%2f5%2f1%2fA%2f1%2f9%2f8%2fCarloMancilla%2f25B.jpg&ehk=DdMhatGsOVCaVOYMsfee0jpKuwzvL4fqSsTQJ0ZzP80%3d&risl=&pid=ImgRaw&r=0',
  'https://via.placeholder.com/400',
];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="gallery-container">
      <button className="nav-button nav-prev" onClick={handlePrev}>&lt; Prev</button>
      <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
      <button className="nav-button nav-next" onClick={handleNext}>Next &gt;</button>
    </div>
  );
};

export default Gallery;
