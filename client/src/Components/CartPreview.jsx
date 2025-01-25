import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { useHistory } from "react-router-dom";
import { fetchCart, fetchCartItems, removeItemFromCart } from '../Pages/Services/cartServices'
import "./cart-preview.css";

const CartPreview = ({ show, handleClose, switchToCartPage }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const { currentUser } = useAuth();
  console.log(currentUser);
  const history = useHistory();
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await fetchCart(currentUser); // Use the service function
        setCartItems(data); // Set the fetched cart data in state
      } catch (error) {
        console.error("Error fetching cart data:", error.message);
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
        console.log(resolvedData);
  
        // Filter out null values and set the cart state
        const filteredData = resolvedData.filter((item) => item !== null);
        setCart(filteredData); // Update the cart state with enriched data
        console.log("Cart lala", filteredData);
      };
  
      if (cartItems) {
        populateCartItems();
      }
    }, [cartItems]);

  const handleRemoveItem = async (e, productId) => {
      e.preventDefault();
    
      const { success } = await removeItemFromCart(currentUser, productId); // Use the service function
    
      if (success) {
        // Filter the cart directly
        const updatedCart = cart.filter((product) => {
          if (product._id === productId) {
            // Save the price before filtering out the product
            setTotalPrice(
              (Number(totalPrice) - Number(product.price)).toFixed(20)
            );
            return false; // Don't include the product in the updated cart
          }
          return true; // Include other products in the updated cart
        });
    
        setCart(updatedCart); // Update the cart state
        setCartItems(cartItems.filter((item) => item !== productId)); // Update cart items
      } else {
        console.error("Failed to remove item from cart");
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

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title>Sumar Coș</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length > 0 ? (
          cart.map((product, index) => (
            <Row className="product-row" key={index}>
                <React.Fragment key={index}>
                  <Col xs={3}>
                    <img
                      src={product[0].photo}
                      alt={product[0].title}
                      className="cart-item-image"
                    />
                  </Col>
                  <Col xs={3} className="cart-item-price">
                    {product[0].title}
                  </Col>
                  <Col xs={2}>
                    {/* <FormControl
                          type="number"
                          defaultValue={1}
                          onChange={(e) =>
                            handleQuantityChange(
                              product._id,
                              parseInt(e.target.value)
                            )
                          }
                        /> */}
                    1x
                  </Col>
                  <Col xs={2}>{product[0].price}Lei</Col>
                  <Col xs={2} className="delete-col">
                    <Button
                      variant="danger"
                      onClick={(e) => handleRemoveItem(e, product[0]._id)}
                    >
                      X
                    </Button>
                  </Col>
                </React.Fragment>
            </Row>
          ))
        ) : (
          <div className="cart-message">Niciun produs in cos.</div>
        )}
        <div className="cart-summary">
          <p>Total {cart.length} produse:</p>
          <p>{totalPrice} Lei</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="button-fav-preview"
          style={{ backgroundColor: "#776e6e", color: "white", border: "none" }}
          onClick={switchToCartPage}
        >
          Vezi detalii comandă
        </Button>
        <Button
          className="button-fav-preview"
          style={{ backgroundColor: "#776e6e", color: "white", border: "none" }}
          onClick={handleClose}
        >
          Închide
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartPreview;
