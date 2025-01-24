// components/AdminOrders.js

import { useAuth } from "../../Context/AuthContext";
import React, { useState, useEffect } from "react";
import "./styles/orders.css"; // Ensure to create this CSS file
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleOrderId, setVisibleOrderId] = useState(null);
  const itemsPerPage = 5;

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Pagination calculations
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  return (
    <div className="orders-page-container">
      {" "}
      <h2>Comenzi</h2>
      <div className="orders-container-user">
        {/* Search Bar */}
        <div className="search-add-bar">
          <input type="text" placeholder="Caută comandă..." />
        </div>

        {/* Prescriptions Table */}
        <table className="table-orders">
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
        </table>

        {/* Pagination */}
        <div className="pagination">
          <span
          className="transparent-button"
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <FontAwesomeIcon icon={faArrowLeftLong} />
          </span>
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index + 1}
              disabled={currentPage === index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? "active-page" : ""}
            >
              {index + 1}
            </span>
          ))}
          <span
          className="transparent-button"
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <FontAwesomeIcon icon={faArrowRightLong} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
