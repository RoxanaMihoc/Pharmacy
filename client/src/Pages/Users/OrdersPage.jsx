// components/AdminOrders.js

import { useAuth } from "../../Context/AuthContext";
import React, { useState, useEffect } from "react";
import "./styles/orders.css"; // Ensure to create this CSS file
import { useLocation } from "react-router-dom";
import { Container, Table, Button, Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();
  const [visibleOrderId, setVisibleOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/home/orders/${currentUser}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      console.log(data[0].cart);
      setOrders(data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const toggleDetails = (orderId) => {
    setVisibleOrderId(visibleOrderId === orderId ? null : orderId);
  };

  return (
    <div className="orders-page-container">
      {" "}
      <h2>Comenzi</h2>
      <Container className="orders-container-user">
        <Table striped bordered hover responsive className="table-orders">
          <thead>
            <tr>
              <th>Numărul comenzii</th>
              <th>Nume Pacient</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Adresă</th>
              <th>Status</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td>#{order.orderNumber}</td>
                  <td>
                    {order.firstName} {order.lastName}
                  </td>
                  <td>{order.email}</td>
                  <td>{order.phone}</td>
                  <td>{`${order.address}, ${order.city}, ${order.county}`}</td>
                  <td>{order.status}</td>
                  <td>
                    <button
                      variant="primary" // Use the "primary" variant to make it look like a proper button
                      onClick={() => toggleDetails(order._id)}
                      className="toggle-details-button" // Add a class for further custom styling
                    >
                      {visibleOrderId === order._id
                        ? "Ascunde produse"
                        : "Vezi produse"}
                    </button>
                  </td>
                </tr>
                {visibleOrderId === order._id && (
                  <tr>
                    <td colSpan="7">
                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>Produs</th>
                            <th>Cantitate</th>
                            <th>Preț</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.cart &&
                            Array.isArray(order.cart) &&
                            order.cart.flat().map((item, idx) => (
                              <tr key={idx}>
                                <td>
                                  <img
                                    src={item[0].photo}
                                    alt={item.title}
                                    className="product-image"
                                  />
                                  {item[0].title || "No title"}
                                </td>
                                <td>{item[0].quantity || 1}</td>
                                <td>
                                  {item[0].price
                                    ? item[0].price.toFixed(2)
                                    : "0.00"}{" "}
                                  Lei
                                </td>
                              </tr>
                            ))}
                          <tr className="total-price">
                            <th>Pret Total</th>
                            <th></th>
                            <th>{order.totalPrice} Lei</th>
                          </tr>
                        </tbody>
                      </Table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default OrdersPage;
