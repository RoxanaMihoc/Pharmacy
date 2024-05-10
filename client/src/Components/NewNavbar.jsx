// src/components/NewNavbar.js
import React, { useState } from 'react';
import './NewNavbar.css';

const NewNavbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div>
      <nav className="navbar">
        <ul className="navbar-menu">
          <li className="navbar-item">
            <button onClick={toggleDropdown} className="navbar-link">
              Categorii
            </button>
          </li>
          <li className="navbar-item"><a href="#" className="navbar-link">Cele mai citite</a></li>
          <li className="navbar-item"><a href="#" className="navbar-link">Precomenzi</a></li>
          <li className="navbar-item"><a href="#" className="navbar-link">Noutati</a></li>
          <li className="navbar-item"><a href="#" className="navbar-link">Edituri</a></li>
          <li className="navbar-item"><a href="#" className="navbar-link">Aboneaza-te la newsletter</a></li>
        </ul>
        <div className="navbar-contact">
          <span className="contact-icon">🎧</span>
          <span className="contact-number">0371.781.781</span>
        </div>
      </nav>
      <div className={`dropdown ${dropdownVisible ? 'show' : ''}`}>
        <div className="dropdown-content">
          <div className="dropdown-section">
            <h4>Carti</h4>
            <ul>
              <li>Afaceri Economie</li>
              <li>Arta Arhitectura Design</li>
              <li>Audiobook</li>
              <li>Beletristica</li>
              <li>Biografii Memorii Jurnale</li>
              <li>Calatorii Ghiduri Harti</li>
              <li>Carti Pentru Copii</li>
            </ul>
          </div>
          <div className="dropdown-section">
            <h4>Alte categorii</h4>
            <ul>
              <li>Carti in Engleza</li>
              <li>Ebooks</li>
              <li>Jocuri</li>
              <li>Muzica</li>
              <li>Filme</li>
              <li>Accesorii si Cadouri</li>
              <li>Card cadou</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewNavbar;
