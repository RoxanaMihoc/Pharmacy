import React from "react";
import { useHistory } from "react-router-dom";
import "./styles/order-confirmation.css"; // Add custom styles here

const PlacedOrder = () => {
  const history = useHistory();

  const handleGoHome = () => {
    history.push("/home"); // Adjust the route as per your app's home route
  };

  return (
    <div className="order-confirmation-container">
      <div className="order-card">
        <h1>Comanda ta a fost plasată cu succes! 🎉</h1>
        <p>
          Comanda ta este acum în curs de procesare.
        </p>
        <p>
          Vei primi un e-mail cu detalii despre livrare și estimările de livrare.
        </p>
        <button className="home-button" onClick={handleGoHome}>
        <span className="arrow">←</span> {"   "}
          Mergi la pagina principală
        </button>
      </div>
    </div>
  );
};

export default PlacedOrder;

