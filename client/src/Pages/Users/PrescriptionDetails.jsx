import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { addToCart } from '../Services/cartServices';
import "./styles/prescription-details.css";

const PrescriptionDetails = () => {
  const location = useLocation();
  const { notification } = location.state;
  const { currentUser } = useAuth();
  const history = useHistory();

  const addAllToCart = () => {
    notification.prescriptionDetails.products.forEach(async (product) => {
      try {
        const result = await addToCart(
          currentUser,
          product.medication._id,
          notification.prescriptionNumber
        );
        console.log("Product added to cart:", result);
      } catch (error) {
        console.error("Failed to add product to cart:", error.message);
      }
    });
    alert("All medications have been added to your cart.");
  };

  const handleBack = () => {
    history.push("/home/medicamente-otc");
  };

  const renderProducts = (products) => {
    if (!products || !products.length)
      return <p className="detailItem">No products listed.</p>;

    return products.map((product, index) => (
      <div key={index} className="medication-card">
        <img
          src={product.medication.photo}
          alt={product.medication.title}
          className="medication-image"
        />
        <p className="medication-title">
          <strong>{product.medication.title}</strong>, {product.medication.brand}
        </p>
        <p>
          <strong>Cantitate:</strong> {product.cantitate}
        </p>
        <p>
          <strong>Doză:</strong> {product.doza}
        </p>
        <p>
          <strong>Durata:</strong> {product.durata}
        </p>
        <p>
          <strong>Detalii:</strong> {product.detalii}
        </p>
      </div>
    ));
  };

  return (
    <div className="prescription-container">
        <h2>Detalii Rețetă:</h2>
      <div className="diagnosis-section">
        <h3 className="diagnosis-heading">Diagnostic</h3>
        <p>{notification.prescriptionDetails.diagnosis}</p>
      </div>

      <div className="investigation-section">
        <h3 className="investigation-heading">Investigații</h3>
        <p>{notification.prescriptionDetails.investigations}</p>
      </div>

      <div className="medications-section">
        <h3 className="medications-heading">Medicamente selectate</h3>
        <div className="medications-list">
          {renderProducts(notification.prescriptionDetails.products)}
        </div>
      </div>

      <div className="buttons-container">
        <button onClick={addAllToCart} className="buy-now-button">
          Cumpara acum
        </button>
        <button onClick={handleBack} className="buy-later-button">
          Cumpara mai tarziu
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetails;

