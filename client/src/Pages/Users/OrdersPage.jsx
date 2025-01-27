// components/AdminOrders.js

import { useAuth } from "../../Context/AuthContext";
import React, { useState, useEffect } from "react";
import "./styles/orders.css"; // Ensure to create this CSS file
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faArrowLeftLong,
  faSearch,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { fetchOrders } from "../Services/orderServices";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleOrderId, setVisibleOrderId] = useState(null);
  const [sortOption, setSortOption] = useState(null); // Tracks current sort option

  const sortOrders = (option) => {
    const sortedOrders = [...orders]; // Create a copy to avoid mutating the state directly

    if (option === "date-newest") {
      sortedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === "date-oldest") {
      sortedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (option === "price-ascending") {
      sortedOrders.sort((a, b) => a.totalPrice - b.totalPrice);
    } else if (option === "price-descending") {
      sortedOrders.sort((a, b) => b.totalPrice - a.totalPrice);
    }

    setOrders(sortedOrders);
    setSortOption(option); // Update the state with the selected option
  };

  const itemsPerPage = 8;

  useEffect(() => {
    fetchOrdersData(); // Call the async function
  }, [currentUser]);

  const fetchOrdersData = async () => {
    try {
      const data = await fetchOrders(currentUser); // Use the service function
      setOrders(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
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
        <div className="search-add-bar">
          <div className="search-input-wrapper">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Caută comanda"
              className="search-bar"
            />
          </div>
          <div className="action-buttons">
            <div className="dropdown">
              <button className="sort-button">
                <span>
                  <FontAwesomeIcon icon={faSort} className="search-icon" />
                  Sort
                </span>
              </button>
              <div className="dropdown-menu">
                <span onClick={() => sortOrders("date-newest")}>
                  Data (Cea mai recenta)
                </span>
                <span onClick={() => sortOrders("date-oldest")}>
                  Data (Cea mai veche)
                </span>
                <span onClick={() => sortOrders("price-ascending")}>
                  Pret (Crescator)
                </span>
                <span onClick={() => sortOrders("price-descending")}>
                  Pret (Descrescator)
                </span>
              </div>
            </div>
            <button
              className="refresh-button"
              onClick={() => fetchOrdersData()}
            >
              <span>↻</span>
            </button>
          </div>
        </div>

        {/* Prescriptions Table */}
        <table className="table-orders">
          <thead>
            <tr>
              <th>Numărul comenzii</th>
              <th>Status</th>
              <th>Data</th>
              <th>Pret Total</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <React.Fragment key={order._id}>
                <tr>
                  <td>#{order.orderNumber}</td>
                  <td>{order.status}</td>
                  <td>{formatDate(order.date)}</td>
                  <td>{order.totalPrice} Lei</td>
                  <td>
                    <button
                      variant="primary" // Use the "primary" variant to make it look like a proper button
                      onClick={() => toggleDetails(order._id)}
                      className="toggle-details-button" // Add a class for further custom styling
                    >
                      {visibleOrderId === order._id
                        ? "Ascunde"
                        : "Vezi"}
                    </button>
                  </td>
                </tr>
                {visibleOrderId === order._id && (
                  <tr>
                    <td colSpan="5">
                      <div className="order-details-container">
                        {/* Patient Details */}
                        <div className="details-section">
                          <h4>Detalii client</h4>
                          <div className="details-content">
                            <p>
                              <b>Nume:</b> {order.firstName} {order.lastName}
                            </p>
                            <p>
                              <b>Email:</b> {order.email}
                            </p>
                            <p>
                              <b>Telefon:</b> {order.phone}
                            </p>
                            <p>
                              <b>Adresă:</b>{" "}
                              {`${order.address}, ${order.city}, ${order.county}`}
                            </p>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="details-section">
                          <h4>Produse</h4>
                          {order.cart &&
                            Array.isArray(order.cart) &&
                            order.cart.flat().map((item, idx) => (
                              <div key={idx} className="product-item">
                                <img
                                  src={item[0].photo}
                                  alt={item[0].title}
                                  className="product-image-order"
                                />
                                <div className="product-info">
                                  <p>
                                    <b>Produs:</b> {item[0].title || "No title"}
                                  </p>
                                  <p>
                                    <b>Cantitate:</b> {item[0].quantity || 1}
                                  </p>
                                  <p>
                                    <b>Preț:</b>{" "}
                                    {item[0].price
                                      ? item[0].price.toFixed(2)
                                      : "0.00"}{" "}
                                    Lei
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
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
