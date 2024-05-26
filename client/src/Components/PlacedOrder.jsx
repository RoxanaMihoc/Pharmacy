import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import "./summary.css";

const PlacedOrder = () => {
  return (
    <div>
      <Container>
      <h2>Summary of Your Order</h2>
      <Row className="mt-3">
        <Col md={6}>
          <div className="mb-3">
            <h3>Order Details</h3>
            {cartItems.length > 0 ? (
              cartItems.map((itemArray, index) => (
                <Row className="product-row" key={index}>
                  {itemArray.map((product, productIndex) => (
                    <React.Fragment key={productIndex}>
                      <Col xs={4}>
                        <img src={product.photo} alt={product.title} className="cartImage" />
                      </Col>
                      <Col xs={8}>
                        <div className="title">{product.title}</div>
                        <div>Quantity: <FormControl type="number" defaultValue={1} min={1} readOnly /></div>
                        <div>Price: ${product.price}</div>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              ))
            ) : (
              <div>No products in cart.</div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="mb-3">
            <div className="address-details">
            <h3>Address Details</h3>
              <p><strong>First Name:</strong> {addressDetails.firstName}</p>
              <p><strong>Last Name:</strong> {addressDetails.lastName}</p>
              <p><strong>Phone:</strong> {addressDetails.phone}</p>
              <p><strong>Email:</strong> {addressDetails.email}</p>
              <p><strong>Address:</strong> {`${addressDetails.address}, ${addressDetails.city}, ${addressDetails.county}`}</p>
              <p><strong>Additional Info:</strong> {addressDetails.additionalInfo || "N/A"}</p>
            </div>
          </div>
          <button className="submit-order-button" onClick={submitOrder}>
              Submit Order
            </button>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default PlacedOrder;
