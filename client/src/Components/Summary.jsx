import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { useHistory } from 'react-router-dom';
import "./summary.css";

const Summary = ({
  cartItems,
  cartId,
  addressDetails,
  totalPrice,
  onOrderSubmitted,
  pharmacy,
}) => {
  const { currentUser } = useAuth();
  const user = currentUser;
  const [price, setTotalPrice] = useState(0);
  const pharmacist = "66760074556be02d8a3594e6";
  const history = useHistory();

  const handlePharmacy = () => {
    history.push("/home/medicamente-otc");
  };
  

  useEffect(() => {
    const priceAfterInsurance = calculateTotalPrice(cartItems);
    setTotalPrice(priceAfterInsurance);
  }, [cartItems]);

  function calculateTotalPrice(cartItems) {
    // Initialize total to 0 and iterate through each cart item
    let total = 0;
    const totalPrice = cartItems.map((item) => {
      // Check if the item is not covered by insurance
      if (item[0].insurance === "no") {
        // Add the product's price multiplied by its quantity to the total price
        total = total + item[0].price;
      }
      // If the item is covered by insurance, add nothing to the total
      return Number(total.toFixed(2));
    }, 0);

    return Number(total.toFixed(2));
  }

  const handleOrderClick = () => {
    if (price === 0) {
      submitOrder();
    } else {
      submitOrder();
    }
  };

  const getPharmacist = async (pharmacy) => {
    try {
      // Replace '/api/pharmacy' with your actual endpoint that handles the request
      const response = await fetch(
        `http://localhost:3000/home/pharmacists/${pharmacy}`
      );

      if (!response.ok) {
        // If the server response is not ok, throw an error with the status
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Assuming the response is JSON formatted
      console.log("Pharmacist details:", data);
      setPharmacist(data); // Returning the fetched pharmacist details
    } catch (error) {
      console.error("Failed to fetch pharmacist:", error.message);
      // Handle errors, such as showing an error message to the user
    }
  };

  const submitOrder = async () => {
    try {
      const response = await fetch(`http://localhost:3000/home/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          addressDetails,
          user,
          totalPrice,
          pharmacist,
        }),
      });
      const data = await response.json();
      console.log("Order submitted:", data);

      // Proceed to delete the cart if the order was successfully submitted
      if (data.success) {
        // Assuming the API returns a 'success' attribute
        const deleteResponse = await fetch(
          `http://localhost:3000/home/cart/${currentUser}`,
          {
            method: "DELETE",
          }
        );

        if (!deleteResponse.ok) {
          throw new Error("Failed to delete cart");
        }

        console.log("Cart deleted successfully");
        onOrderSubmitted(true);
      } else {
        onOrderSubmitted(false);
      }
    } catch (error) {
      console.error("Error during the order process:", error);
      onOrderSubmitted(false);
    }
  };



  return (
    <div>
      <Container>
        <h2>Sumar Comandă</h2>
        <Row className="mt-3">
          <Col md={6}>
            <div className="details-order">
              <h3> Produse:</h3>
              {cartItems.length > 0 ? (
                cartItems.map((itemArray, index) => (
                  <Row className="product-row" key={index}>
                    {itemArray.map((product, productIndex) => (
                      <React.Fragment key={productIndex}>
                        <Col xs={4}>
                          <img
                            src={product.photo}
                            alt={product.title}
                            className="cartImage"
                          />
                        </Col>
                        <Col xs={8}>
                          <div className="title">{product.title}</div>
                          <div>
                            Cantitate:{" "}
                            <FormControl
                              type="number"
                              defaultValue={1}
                              min={1}
                              readOnly
                            />
                          </div>
                          <div className="price-detail">
                            {product.insurance === "no" ? (
                              <div>Preț: {product.price} Lei</div>
                            ) : (
                              <div>Acoperit de asigurare</div>
                            )}
                          </div>
                        </Col>
                      </React.Fragment>
                    ))}
                  </Row>
                ))
              ) : (
                <div>
                  Niciun produs in coș.
                  <button
                    className="go-to-button"
                    onClick={handlePharmacy}
                  >
                    Caută produse în farmacie.
                  </button>
                </div>
              )}
            </div>
          </Col>
          <Col md={6}>
            <div className="mb-3">
              <div className="address-details">
                <h3>Detalii client</h3>
                <p>
                  <strong>Nume:</strong> {addressDetails.lastName}
                </p>
                <p>
                  <strong>Prenume:</strong> {addressDetails.firstName}
                </p>
                <p>
                  <strong>Telefon:</strong> {addressDetails.phone}
                </p>
                <p>
                  <strong>Email:</strong> {addressDetails.email}
                </p>
                <p>
                  <strong>Adresă:</strong>{" "}
                  {`${addressDetails.address}, ${addressDetails.city}, ${addressDetails.county}`}
                </p>
                <p>
                  <strong>Informații adiționale:</strong>{" "}
                  {addressDetails.additionalInfo || "N/A"}
                </p>
              </div>
            </div>
            <div className="price-submit">
              <h3> Preț total: {price} Lei </h3>
              <button
                className="submit-order-button"
                onClick={handleOrderClick}
                disabled={totalPrice === 0}
              >
                Trimite Comanda
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Summary;
