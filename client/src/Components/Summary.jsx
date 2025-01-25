import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { useHistory } from "react-router-dom";
import { fetchDoctorName } from "../Pages/Services/userServices";
import { submitOrderApi} from "../Pages/Services/orderServices";
import { deleteCart } from "../Pages/Services/cartServices";
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
  const [doctor, setDoctor] = useState("");
  const pharmacist = "66760074556be02d8a3594e6";
  const history = useHistory();
  console.log(cartItems);

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

  // const getPharmacist = async (pharmacy) => {
  //   try {
  //     // Replace '/api/pharmacy' with your actual endpoint that handles the request
  //     const response = await fetch(
  //       `http://localhost:3000/home/pharmacists/${pharmacy}`
  //     );

  //     if (!response.ok) {
  //       // If the server response is not ok, throw an error with the status
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json(); // Assuming the response is JSON formatted
  //     console.log("Pharmacist details:", data);
  //     setPharmacist(data); // Returning the fetched pharmacist details
  //   } catch (error) {
  //     console.error("Failed to fetch pharmacist:", error.message);
  //     // Handle errors, such as showing an error message to the user
  //   }
  // };


useEffect(() => {
  const getDoctorForPatient = async () => {
    if (currentUser) {
      const { success, data, error } = await  fetchDoctorName(currentUser);

      if (success) {
        setDoctor(data); // Set the doctor data in state
      } else {
        console.error("Error fetching doctor data:", error);
      }
    }
  };

  getDoctorForPatient();
}, [currentUser]);

const submitOrder = async () => {
  try {
    console.log(cartItems);

    // Submit the order
    const orderDetails = {
      cartItems,
      addressDetails,
      user,
      totalPrice,
      pharmacist,
      doctor,
    };

    const { success: orderSuccess, data: orderData } = await submitOrderApi(orderDetails);

    if (orderSuccess) {
      console.log("Order submitted:", orderData);

      // Delete the cart if the order was successfully submitted
      const { success: deleteSuccess, error } = await deleteCart(currentUser);

      if (deleteSuccess) {
        console.log("Cart deleted successfully");
        onOrderSubmitted(true);
      } else {
        console.error("Failed to delete cart:", error);
        onOrderSubmitted(false);
      }
    } else {
      console.error("Order submission failed");
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
                cartItems.map((item, index) => (
                  <Row className="product-row" key={index}>
                    {/* Access the product data from the "0" field */}
                    <React.Fragment>
                      <Col xs={4}>
                        <img
                          src={item[0]?.photo} // Access photo from the product object
                          alt={item[0]?.title} // Access title from the product object
                          className="cartImage"
                        />
                      </Col>
                      <Col xs={8}>
                        <div className="title">{item[0]?.title}</div>
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
                          {item[0]?.insurance === "no" ? (
                            <div>Preț: {item[0]?.price} Lei</div>
                          ) : (
                            <div>Acoperit de asigurare</div>
                          )}
                        </div>
                        {/* Display the presId */}
                        <div className="prescription-id">
                          <strong>Prescripție ID:</strong> {item.presId}
                        </div>
                      </Col>
                    </React.Fragment>
                  </Row>
                ))
              ) : (
                <div>
                  Niciun produs in coș.
                  <button className="go-to-button" onClick={handlePharmacy}>
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
