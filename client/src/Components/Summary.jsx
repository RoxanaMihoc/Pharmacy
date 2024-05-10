import React from 'react';
import './summary.css';

const Summary = () => {
  return (
    <div className="order-summary-container">
      <h2>Sumar comanda</h2>
      
      <div className="summary-section">
        <div className="summary-box">
          <h3>Modalitate livrare</h3>
          <p>Livrare prin Urgent Cargus</p>
          <p>Roxana-Gabriela Mihoc, 0727476778</p>
          <p>Radu Voda nr 18, Romania, Iasi, Rachiteni</p>
          <button className="edit-button">Editeaza</button>
        </div>
        
        <div className="summary-box">
          <h3>Date facturare</h3>
          <p>Persoana fizica</p>
          <p>Roxana-Gabriela Mihoc, 0727476778</p>
          <p>Radu Voda nr 18, Romania, Iasi, Rachiteni</p>
          <button className="edit-button">Editeaza</button>
        </div>
        
        <div className="summary-box">
          <h3>Modalitate de plata</h3>
          <p>Plata ramburs la primirea coletului</p>
          <button className="edit-button">Editeaza</button>
        </div>
      </div>
      
      <div className="order-items">
        <p>1 x Un om mai bun - Louise Penny</p>
        <p>1 x Gazeta Libris</p>
        <div className="cost-summary">
          <p>Cost livrare <span>12.90 lei</span></p>
          <p>Total: <span>27.60 lei</span></p>
        </div>
      </div>
      
      <div className="terms">
        <label>
          <input type="checkbox" required /> Am citit, am minimum 18 ani si sunt de acord cu Termenii de utilizare si Conditiile prezentate pe acest site.
        </label>
        <label>
          <input type="checkbox" /> Doresc sa primesc prin e-mail noutatile si promotiile Libris cu privire la produsele si serviciile similare celor achizitionate.
        </label>
      </div>
      
      <button className="submit-button">Trimite comanda <span className="arrow">→</span></button>
    </div>
  );
};

export default Summary;
