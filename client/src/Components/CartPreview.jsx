import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { useHistory } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { fetchCart, fetchCartItems, removeItemFromCart } from '../Pages/Services/cartServices'
import "./styles/cart-preview.css";

const CartPreview = ({ show, handleClose, switchToCartPage }) => {
  const { cartItems, setCartItems, totalPrice, setTotalPrice } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const { currentUser, token } = useAuth();
  console.log(currentUser);
  const history = useHistory();
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const data = await fetchCart(currentUser, token); // Use the service function
        console.log("feth",data);
        setCartItems(data); // Set the fetched cart data in state
      } catch (error) {
        console.error("Error fetching cart data:", error.message);
      }
    };

    fetchCartData();
  }, [currentUser]);

  useEffect(() => {
    const populateCartItems = async () => {
      const promises = cartItems.map(async (item) => {
        const { success, data } = await fetchCartItems(item.productId, token);
        if (success) {
          return { ...data, presId: item.prescriptionId };
        }
        return null;
      });

      const resolvedData = await Promise.all(promises);

      // Filter out null values and update the cart state
      const filteredData = resolvedData.filter((item) => item !== null);
      setCart(filteredData);
      console.log(cart);

      // Calculate the total price
      const total = filteredData.reduce((sum, item) => sum + item[0].price, 0);
      setTotalPrice(total);
    };

    if (cartItems.length > 0) {
      populateCartItems();
    } else {
      setCart([]); // Clear the cart when cartItems is empty
      setTotalPrice(0);
    }
  }, [cartItems, setCart, setTotalPrice]);

  const handleRemoveItem = async (e, productId) => {
    e.preventDefault();

    const { success } = await removeItemFromCart(currentUser, productId, token);
    if (success) {
      const updatedCart = cart.filter((product) => product[0]._id !== productId);
      setCart(updatedCart);

      const updatedCartItems = cartItems.filter(
        (item) => item.productId !== productId
      );
      setCartItems(updatedCartItems);

      const total = updatedCart.reduce((sum, product) => sum + product[0].price, 0);
      setTotalPrice(total);
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

  const setTotal = async (productPrice) => {

    let totalPrice2 = totalPrice +  productPrice;

    setTotalPrice(totalPrice2);
  }


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
          <p>{totalPrice.toFixed(2)} Lei</p>
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
