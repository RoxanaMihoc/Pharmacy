// components/AdminOrders.js
import React, { useEffect, useState } from 'react';
import { useAuth } from "../../Context/AuthContext";
import { Container, Table, Button, Accordion, Card } from 'react-bootstrap';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const { currentUser} = useAuth();
    const [visibleOrderId, setVisibleOrderId] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:3000/home/orders/${currentUser}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await response.json();
            console.log(data);
            setOrders(data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    // const updateOrderStatus = async (id, status) => {
    //     await axios.patch(`/api/orders/${id}`, { status });
    //     fetchOrders();
    // };

    // const cancelOrder = async (id) => {
    //     await axios.delete(`/api/orders/${id}`);
    //     fetchOrders();
    // };

    const toggleDetails = (orderId) => {
        setVisibleOrderId(visibleOrderId === orderId ? null : orderId);
      };

    return (
        <Container className="mt-3">
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <React.Fragment key={order._id}>
              <tr>
                <td>{order._id}</td>
                <td>
                  {order.firstName} {order.lastName}
                </td>
                <td>{order.email}</td>
                <td>{order.phone}</td>
                <td>{`${order.address}, ${order.city}, ${order.county}`}</td>
                <td>{order.status}</td>
                <td>
                  <Button
                    variant="link"
                    onClick={() => toggleDetails(order._id)}
                  >
                    {visibleOrderId === order._id
                      ? "Hide Products"
                      : "View Products"}
                  </Button>
                </td>
              </tr>
              {visibleOrderId === order._id && (
                <tr>
                  <td colSpan="7">
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.cart &&
                          Array.isArray(order.cart) &&
                          order.cart.flat().map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.title || "No title"}</td>
                              <td>{item.quantity || 1}</td>
                              <td>
                                ${item.price ? item.price.toFixed(2) : "0.00"}
                              </td>
                            </tr>
                          ))}
                        <tr className="total-price">
                        <th>Total Price</th>
                        <th></th>
                        <th>{order.totalPrice}</th>
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
  );
};

export default OrderPage;