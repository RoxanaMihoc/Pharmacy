// src/components/CartPreviewModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import './cart-preview.css';

const CartPreview = ({ show, handleClose, cartItems, onRemoveItem }) => {
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sumar Coș</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ul className="cart-items">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <p className="cart-item-title">{item.title}</p>
                <p className="cart-item-quantity">x{item.quantity}</p>
                <p className="cart-item-price">{item.price} Lei</p>
                <p className="cart-item-original-price">{item.originalPrice} Lei</p>
                <button className="cart-item-remove" onClick={() => onRemoveItem(item.id)}>
                  <FontAwesomeIcon icon={faTrash} /> Șterge
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="cart-summary">
          <p>Total {cartItems.length} produse</p>
          <p>{totalPrice} Lei</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Vezi detalii coș
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartPreview;
