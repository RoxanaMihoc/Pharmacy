import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faInfoCircle,
  faCashRegister,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/order-overview.css";

const OrderOverview = () => {
  const location = useLocation();
  const { notification } = location.state;
  console.log(notification);

  const handleOrderAcceptance = async () => {
    // This function would ideally check stock availability and update order status
    console.log("Processing Order:", notification.orderId);
    // Placeholder for order processing simulation
  };

  if (!notification) return <p>No order details available.</p>;
  const isInStock = (product) => product.quantity <= 10; // example condition

  return (
    <div className="order-container">
      <div className="order-header">
        <div className="order-info">
          <h1>Comanda #{notification.orderDetails.orderNumber}</h1>
          <div className="order-date">20 Jun, 2021 · 10:20PM</div>
          <div className="order-status">
            Status: {notification.orderDetails.status}
          </div>
        </div>
        <div className="order-actions">
          <button className="button-order">Confirmă ridicare comandă</button>
        </div>
      </div>

      <div className="order-overview-container">
        <div className="order-details">
          <h1>Produse</h1>
          <div className="order-header">
            <span>Medicament</span>
            <span>Preț</span>
            <span>Cantitate</span>
            <span>Pret total</span>
            <span>In stoc</span>
          </div>
          {notification.orderDetails.cart.map((product, index) => (
            <div className="order-item" key={index}>
              <div className="product-detail">
                <img
                  src={product[0].photo}
                  alt={product[0].title}
                  className="product-image"
                />
                <div>
                  <p>{product[0].title}</p>
                </div>
              </div>
              <p className="price-in-order">
                {product[0].price.toFixed(2)} Lei
              </p>
              <p className="quantity">1</p>
              <p className="total-price">
                {(product[0].price * 1).toFixed(2)} Lei
              </p>
              <p className="stock-status">
                {isInStock(product[0]) ? "Da" : "Nu"}
              </p>
            </div>
          ))}
        </div>
        <div className="customer-details">
          <h4>Client</h4>
          <div className="customer-info">
            <div className="customer-photo-title">
              <img
                src={notification.orderDetails.photoUrl || "default_avatar.png"}
                alt="Customer Photo"
                className="customer-photo"
              />
              <p className="customer-name">
                {notification.orderDetails.firstName}{" "}
                {notification.orderDetails.lastName}
              </p>
            </div>
            <div className="customer-stats">
              <h4 class="contact-info-header">Informații de contact:</h4>

              <p>
                <FontAwesomeIcon icon={faEnvelope} /> Email:{" "}
                {notification.orderDetails.email}
<br />
                <FontAwesomeIcon icon={faPhone} /> Telefon: +1234567890
              </p>
              <h4 class="contact-info-header">Adresă:</h4>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                {notification.orderDetails.address},
                {notification.orderDetails.city},{" "}
                {notification.orderDetails.county}
              </p>
              <h4 class="contact-info-header">Metoda de plată:</h4>
              <p>
                <FontAwesomeIcon icon={faCashRegister} />{" "}
                {notification.orderDetails.paymentMethod}
              </p>
              <h4 class="contact-info-header">Alte informații:</h4>
              <p>
                <FontAwesomeIcon icon={faInfoCircle} />{" "}
                {notification.orderDetails.additionalInfo}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderOverview;
