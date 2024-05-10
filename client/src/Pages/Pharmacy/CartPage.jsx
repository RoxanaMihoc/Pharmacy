import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, FormControl } from "react-bootstrap";
import Menu from "../../Components/Menu";
import Footer from "../../Components/Footer";
import AddressPage from "../../Components/AddressPage";
import Summary from "../../Components/Summary";
import { useAuth } from "../../Context/AuthContext";
import SecondaryMenu from "../../Components/SecondMenu";
import "./styles/cart-page.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [activeStep, setActiveStep] = useState('Cos de cumparaturi');
  const { token } = useAuth();
  const [header, payload, signature] = token.split(".");
  const decodedPayload = JSON.parse(atob(payload));
  const currentUser = decodedPayload.userId;
  useEffect(() => {
    const fetchCartData = async () => {
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
            setTotalPrice((Number(totalPrice) - Number(product.price)).toFixed(20));
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
      setQuantity(newQuantity-1);
      await updateTotalPrice(productId); // Recalculate total price after quantity change
    }
  };  
  const renderContent = () => {
    switch (activeStep) {
      case 'Cos de cumparaturi':
        return (
          <>
            {cart.length > 0 ? (
              cart.map((itemArray, index) => (
                <Row className="product-row" key={index}>
                  {itemArray.map((product, productIndex) => (
                    <React.Fragment key={productIndex}>
                      <Col xs={3}>
                        <img src={product.photo} alt={product.title} className="cartImage" />
                      </Col>
                      <Col xs={3}>{product.title}</Col>
                      <Col xs={2}>
                        <FormControl
                          type="number"
                          defaultValue={1}
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
              <div>Loading...</div>
            )}
            <h5>Total Price: ${totalPrice}</h5>
          </> 
        );
      case 'Contact si adresa':
        return (
          <div>
            <AddressPage/>
          </div>
        );
      case 'Sumar comanda':
        return (
          <div>
            <Summary/>
          </div>
        );

        case 'Comanda plasata': 
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
      <Menu />
      <SecondaryMenu/>
      <Container>
        <Row className="mt-3 justify-content-center">
          <Col className="button-center">
            <div className="button-wrapper">
              <Button
                variant="primary"
                className={`step-button ${activeStep === 'Cos de cumparaturi' ? 'active' : ''}`}
                onClick={() => setActiveStep('Cos de cumparaturi')}
              >
                Cos de cumparaturi
              </Button>
              <Button
                variant="primary"
                className={`step-button ${activeStep === 'Contact si adresa' ? 'active' : ''}`}
                onClick={() => setActiveStep('Contact si adresa')}
              >
                Contact si adresa
              </Button>
              <Button
                variant="primary"
                className={`step-button ${activeStep === 'Sumar comanda' ? 'active' : ''}`}
                onClick={() => setActiveStep('Sumar comanda')}
              >
                Sumar comanda
              </Button>
              <Button
                variant="primary"
                className={`step-button ${activeStep === 'Comanda plasata' ? 'active' : ''}`}
                onClick={() => setActiveStep('Comanda plasata')}
              >
                Comanda plasata
              </Button>
            </div>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col>
            <div className="mb-3">
              {renderContent()}
            </div>
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
};

export default CartPage;


