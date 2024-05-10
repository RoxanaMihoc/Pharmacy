import React, { useState, useEffect } from "react";
import "./address.css";

const AddressPage = () => {
  return (
    <div className="order-details">
      <h2>Detalii comanda</h2>
      
      <div className="section">
        <h3>1. Date livrare</h3>
        <div className="personal-info">
          <label>
            Nume și Prenume*
            <input type="text" placeholder="Nume și Prenume" required />
          </label>
          <label>
            Telefon*
            <input type="tel" placeholder="Telefon" required />
          </label>
          <label>
            E-mail*
            <input type="email" placeholder="E-mail" required />
          </label>
        </div>
        
        <div className="delivery-method">
          <h4>Modalitate livrare</h4>
          <div className="delivery-options">
            <label>
              <input type="radio" name="delivery" />
              Livrare prin curier
            </label>
            <label>
              <input type="radio" name="delivery" />
              Ridicare Personală
            </label>
          </div>
        </div>
        
        <div className="location-info">
          <label>
            România
            <select required>
              <option value="">Selectați județul</option>
              {/* Add your options here */}
            </select>
          </label>
          <label>
            Selectați localitatea
            <select required>
              <option value="">Selectați localitatea</option>
              {/* Add your options here */}
            </select>
          </label>
        </div>
        
        <label>
          Lasa-ne aici detalii privind livrarea comenzii tale
          <textarea placeholder="Lasa-ne aici detalii privind livrarea comenzii tale"></textarea>
        </label>
      </div>

      <div className="section">
        <h3>2. Modalitate de plata</h3>
        <div className="payment-methods">
          <label>
            <input type="radio" name="payment"  />
            Plata ramburs la primirea coletului
          </label>
          <label>
            <input type="radio" name="payment" />
            Plata online prin card PayU
          </label>
          <label>
            <input type="radio" name="payment" />
            Plata in avans prin op/depunere in cont
          </label>
        </div>
      </div>
      <div className="section">
      <button className="next-step">
          Pasul urmator <span className="arrow">→</span>
        </button>
        </div>
    </div>
  );
    
};

export default AddressPage;
