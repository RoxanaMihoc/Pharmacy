import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import AddressPage from "../../../Components/AddressPage";
import Summary from "../../../Components/Summary";
import { useAuth } from "../../../Context/AuthContext";
import "./styles/cart-page.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartItems, setIsCartItems] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [activeStep, setActiveStep] = useState("Cos de cumparaturi");
  const [addressDetails, setAddressDetails] = useState({});
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const { currentUser, token} = useAuth();
  console.log(token, currentUser);
  useEffect(() => {
    const fetchCartData = async () => {
      console.log("cart page", currentUser);
      try {
        // Fetch cart data from backend API
        const response = await fetch(
          `http://localhost:3000/home/cart/${currentUser}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        console.log("data " + data.id);
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, [currentUser]);

  useEffect(() => {
    const populateCartItems = async () => {
      const promises = cartItems.map(async (id) => {
        const { success, data } = await fetchCartItems(id);
        if (success) {
          return data;
        }
        return null;
      });

      const resolvedData = await Promise.all(promises);
      setCart(resolvedData.filter((item) => item !== null));
      console.log(cart);

      let total = 0;

      // Iterate over each array of items in the cart
      for (let i = 0; i < cart.length; i++) {
        const itemArray = cart[i];

        // Iterate over each item in the array
        for (let j = 0; j < itemArray.length; j++) {
          const product = itemArray[j];
          console.log("lala" + product.price);
          total += Number(product.price);
        }
      }
      setTotalPrice(Number(total.toFixed(2)));
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

    populateCartItems();
  }, [cartItems]);

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
      setCartItems(cartItems.filter((item) => item.id !== productId));
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
      setActiveStep('Comanda plasata'); // Move to the next step only if the order is successfully submitted
    }
  };

  const renderContent = () => {
    switch (activeStep) {
      case "Cos de cumparaturi":
        return (
          <>
            {cart.length > 0 ? (
              cart.map((itemArray, index) => (
                <Row className="product-row" key={index}>
                  {itemArray.map((product, productIndex) => (
                    <React.Fragment key={productIndex}>
                      <Col xs={3}>
                        <img
                          src={product.photo}
                          alt={product.title}
                          className="cartImage"
                        />
                      </Col>
                      <Col xs={3} className="title">
                        {product.title}
                      </Col>
                      <Col xs={2}>
                        <FormControl
                          type="number"
                          defaultValue={1}
                          min={1}
                          onChange={(e) =>
                            handleQuantityChange(
                              product._id,
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </Col>
                      <Col xs={2}>${product.price}</Col>
                      <Col xs={2} className="delete-col">
                        <Button
                          variant="danger"
                          onClick={(e) => handleRemoveItem(e, product._id)}
                        >
                          X
                        </Button>
                      </Col>
                    </React.Fragment>
                  ))}
                </Row>
              ))
            ) : (
              <div>No products in the cart.</div>
            )}
            <h5>Total Price: ${totalPrice}</h5>
          </>
        );
      case "Contact si adresa":
        return <AddressPage onSubmit={handleAddressSubmit} />;
      case "Sumar comanda":
        return (
          <div>
            <Summary 
              cartItems={cart}
              cartId={cartItems}
              addressDetails={addressDetails}
              totalPrice = {totalPrice}
              onOrderSubmitted={handleOrderSubmission}
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
                variant="primary"
                className={`step-button ${
                  activeStep === "Cos de cumparaturi" ? "active" : ""
                }`}
                onClick={() => setActiveStep("Cos de cumparaturi")}
              >
                Cos de cumparaturi
              </Button>
              <Button
                variant="primary"
                className={`step-button ${
                  activeStep === "Contact si adresa" ? "active" : ""
                }`}
                onClick={() => setActiveStep("Contact si adresa")}
              >
                Contact si adresa
              </Button>
              <Button
                variant="primary"
                className={`step-button ${
                  activeStep === "Sumar comanda" ? "active" : ""
                }`}
                onClick={() => setActiveStepState("Sumar comanda")}
                disabled={!canProceedToSummary()}
              >
                Sumar comanda
              </Button>
              <Button
                variant="primary"
                className={`step-button ${
                  activeStep === "Comanda plasata" ? "active" : ""
                }`}
                onClick={() => setActiveStep("Comanda plasata")}
                disabled={!orderSubmitted}
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
