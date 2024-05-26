import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import "./summary.css";

const Summary = ({ cartItems, cartId, addressDetails, totalPrice, onOrderSubmitted}) => {
  console.log("Cart ", cartItems);
  console.log("Cart ID ",cartId);
  const { currentUser} = useAuth();
  const submitOrder = async () => {
    try {
      const response = await fetch(`http://localhost:3000/home/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems, addressDetails, currentUser, totalPrice }),
      });
      const data = await response.json();
      console.log('Order submitted:', data);
  
      // Proceed to delete the cart if the order was successfully submitted
      if (data.success) { // Assuming the API returns a 'success' attribute
        const deleteResponse = await fetch(
          `http://localhost:3000/home/cart/${currentUser}`,
          {
            method: "DELETE",
          }
        );

        console.log("ceva2");
  
        if (!deleteResponse.ok) {
          throw new Error('Failed to delete cart');
        }
  
        console.log('Cart deleted successfully');
        onOrderSubmitted(true);
      } else {
        onOrderSubmitted(false);
      }
    } catch (error) {
      console.error('Error during the order process:', error);
      onOrderSubmitted(false);
    }
  };
  
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

export default Summary;
