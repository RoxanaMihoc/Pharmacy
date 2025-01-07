import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import AddressPage from "../../Components/AddressPage";
import Summary from "../../Components/Summary";
import { useAuth } from "../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import "./styles/fav-page.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [activeStep, setActiveStep] = useState("Cos de cumparaturi");
  const [addressDetails, setAddressDetails] = useState({});
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const { currentUser, token } = useAuth();
  const [pharmacies, setPharmacies] = useState([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState("");
  const history = useHistory();
  useEffect(() => {
    const fetchCartData = async () => {
      if (currentUser) {
        try {
          // Fetch cart data from backend API
          const response = await fetch(
            `http://localhost:3000/home/cart/${currentUser}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch cart data");
          }
          const data = await response.json();
          setCartItems(data);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      }
    };

    fetchCartData();
  }, [currentUser]);

  useEffect(() => {
    console.log("ALAL", cartItems);
    const populateCartItems = async () => {
      const promises = cartItems.map(async (id) => {
        const { success, data } = await fetchCartItems(id.productId);
        if (success) {
          return { ...data, presId: id.prescriptionId };
        }
        return null;
      });

      const resolvedData = await Promise.all(promises);

      // Filter out null values and set the cart state
      const filteredData = resolvedData.filter((item) => item !== null);
      setCart(filteredData); // Update the cart state with enriched data
      console.log("Cart with presId", filteredData);
    };

    const fetchCartItems = async (productId) => {
      console.log("Product Id " + productId);
      try {
        const response = await fetch(
          `http://localhost:3000/home/product/${productId}`
        );

        if (!response.ok) {
          throw new Error("Failed to add product to cart");
        }

        const data = await response.json();
        return { success: true, data };
        // Handle successful response (e.g., display a success message)
      } catch (error) {
        console.error("Error adding product to cart:", error);
        // Handle error (e.g., display an error message)
      }
    };
    if (cartItems) {
      populateCartItems();
    }
  }, [cartItems]);

  useEffect(() => {
    let total = 0;

    cart.forEach((product) => {
      total += Number(product[0].price);
    });
    console.log(typeof total);
    setTotalPrice(Number(total));
  }, [cart]);

  const handleRemoveItem = async (e, productId) => {
    e.preventDefault();

    try {
      // Send request to remove item from cart
      // cand se da delete la un produs nu ai product id
      const response = await fetch(
        `http://localhost:3000/home/cart/${currentUser}/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      const updatedCart = cart.map((itemArray) =>
        itemArray.filter((product) => {
          if (product._id === productId) {
            // Save the price before filtering out the product
            setTotalPrice(
              (Number(totalPrice) - Number(product.price)).toFixed(20)
            );
            return false; // Don't include the product in the updated cart
          }
          return true; // Include other products in the updated cart
        })
      );
      setCartItems(cartItems.filter((item) => item !== productId));
      setCart(updatedCart);
      document.location.reload();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const updateTotalPrice = async (productId) => {
    let total = 0;
    cart.forEach((itemArray) => {
      itemArray.forEach((product) => {
        let product1 = product._id.replace(/[^a-zA-Z0-9]/g, "");
        let product2 = productId.replace(/[^a-zA-Z0-9]/g, "");
        if (product1 == product2) {
          total += product.price * quantity;
        }
      });
    });
    console.log("Totl: " + typeof total);
    total += Number(totalPrice);
    console.log("Lala" + total);

    setTotalPrice(total);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity > 0) {
      console.log(newQuantity);
      // Update quantity in local state
      setQuantity(newQuantity - 1);
      await updateTotalPrice(productId); // Recalculate total price after quantity change
    }
  };

  const canProceedToSummary = () => {
    return (
      addressDetails.firstName &&
      addressDetails.phone &&
      addressDetails.email &&
      addressDetails.address
    );
  };

  const setActiveStepState = (newStep) => {
    // Ensure that the summary can only be accessed if address details are complete
    if (newStep === "Sumar comanda" && !canProceedToSummary()) {
      alert(
        "Please complete all address details before proceeding to the summary."
      );
      return; // Prevent setting the active step to summary
    } else if (newStep === "Comanda plasata" && !isOrderSubmitted) {
      alert("Please submit the order before proceeding.");
      return;
    }

    // Otherwise, proceed normally
    setActiveStep(newStep);
  };

  const handleAddressSubmit = (details) => {
    console.log(details.firstName);
    if (
      !details.firstName ||
      !details.phone ||
      !details.email ||
      !details.address
    ) {
      alert("All fields are required to proceed.");
      return;
    }
    setAddressDetails(details);
    setActiveStep("Sumar comanda");
  };

  const handleOrderSubmission = (success) => {
    if (success) {
      setOrderSubmitted(true);
      // document.location.reload();
      setActiveStep("Comanda plasata"); // Move to the next step only if the order is successfully submitted
    }
  };

  const checkPharmacyStock = async () => {
    console.log("in far", cart);
    const productIds = cart.map((item) => ({
      productId: item[0]._id,
    }));

    try {
      console.log(productIds);
      const response = await fetch("http://localhost:3000/home/check-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds }),
      });

      const data = await response.json();
      console.log(data);
      setPharmacies(data);
    } catch (error) {
      console.error("Failed to fetch pharmacies", error);
    }
  };

  useEffect(() => {
    if (cart.length > 0) {
      checkPharmacyStock();
    }
  }, [cart]);

  const handleSelectPharmacy = (pharmacyId) => {
    setSelectedPharmacy(selectedPharmacy === pharmacyId ? null : pharmacyId);
    console.log(selectedPharmacy);
  };

  const handlePharmacy = () => {
    history.push("/home/medicamente-otc");
  };

  const renderContent = () => {
    switch (activeStep) {
      case "Cos de cumparaturi":
        return (
          <>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <Row className="product-row" key={index}>
                  <Col xs={3}>
                    <img
                      src={item[0]?.photo} // Access photo from nested "0"
                      alt={item[0]?.title} // Access title from nested "0"
                      className="cartImage"
                    />
                  </Col>
                  <Col xs={3} className="title">
                    {item[0]?.title}
                  </Col>
                  <Col xs={2}>
                    <FormControl
                      type="number"
                      defaultValue={1}
                      min={1}
                      onChange={(e) =>
                        handleQuantityChange(
                          item[0]?.id, // Use ID from nested "0"
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </Col>
                  <Col xs={2}>{item[0]?.price} Lei</Col>
                  <Col xs={2} className="delete-col">
                    <Button
                      variant="danger"
                      onClick={(e) => handleRemoveItem(e, item[0]?.id)}
                    >
                      X
                    </Button>
                  </Col>
                  {/* Show presId */}
                  <Col xs={12} className="prescription-id">
                    <div>
                      <strong>Prescripție ID:</strong> {item.presId}
                    </div>
                  </Col>
                </Row>
              ))
            ) : (
              <div className="empty-cart">
                <h2>Niciun produs in coș.</h2>
                <h3>Continuă cumpăraturile și adaugă produse în coș.</h3>
                <button className="go-to-button" onClick={handlePharmacy}>
                  Caută produse în farmacie.
                </button>
              </div>
            )}

            <div>
              {cart.length > 0 && (
                <div className="ppppp">
                  <h5>Total: {totalPrice} Lei</h5>
                  <h2>Selectează o farmacie:</h2>
                  <div className="pharmacy-list">
                    {pharmacies.length > 0 ? (
                      pharmacies.map((pharmacy) => (
                        <div
                          key={pharmacy._id}
                          className={`pharmacy-item ${
                            selectedPharmacy === pharmacy._id ? "selected" : ""
                          }`}
                          onClick={() => handleSelectPharmacy(pharmacy._id)}
                        >
                          <img
                            src={pharmacy.photo}
                            alt={pharmacy.name}
                            className="pharmacy-photo"
                          />
                          <div className="pharmacy-info">
                            <strong>{pharmacy.name}</strong>
                            <p>{pharmacy.location}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>Nicio farmacie disponibila.</p> // Message displayed when there are no pharmacies
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        );
      case "Adresa si contact":
        return <AddressPage onSubmit={handleAddressSubmit} />;
      case "Sumar comanda":
        return (
          <div>
            <Summary
              cartItems={cart}
              cartId={cartItems}
              addressDetails={addressDetails}
              totalPrice={totalPrice}
              onOrderSubmitted={handleOrderSubmission}
              pharmacy={selectedPharmacy}
            />
          </div>
        );

      case "Comanda plasata":
        return (
          <div>
            {/* Add your order submission content here */}
            <h5>Submit Your Order</h5>
            <p>Details about submitting the order...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Container>
        <Row className="mt-3">
          <Col className="button-center">
            <div className="button-wrapper">
              <Button
                className={`step-button ${
                  activeStep === "Cos de cumparaturi" ? "active" : ""
                }`}
                onClick={() => setActiveStep("Cos de cumparaturi")}
                style={{
                  backgroundColor: "#776e6e",
                  color: "white",
                  border: "none",
                }}
              >
                Cos de cumparaturi
              </Button>
              <Button
                className={`step-button ${
                  activeStep === "Adresa si contact" ? "active" : ""
                }`}
                onClick={() => setActiveStep("Adresa si contact")}
                style={{
                  backgroundColor: "#776e6e",
                  color: "white",
                  border: "none",
                }}
              >
                Adresa si contact
              </Button>
              <Button
                className={`step-button ${
                  activeStep === "Sumar comanda" ? "active" : ""
                }`}
                onClick={() => setActiveStepState("Sumar comanda")}
                disabled={!canProceedToSummary()}
                style={{
                  backgroundColor: "#776e6e",
                  color: "white",
                  border: "none",
                }}
              >
                Sumar comanda
              </Button>
              <Button
                className={`step-button custom-step-button ${
                  activeStep === "Comanda plasata" ? "active" : ""
                }`}
                onClick={() => setActiveStep("Comanda plasata")}
                disabled={!orderSubmitted}
                style={{
                  backgroundColor: "#776e6e",
                  color: "white",
                  border: "none",
                }}
              >
                Comanda plasata
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col>
            <div className="mb-3">{renderContent()}</div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage;
