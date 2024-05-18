import React, { useState, useEffect } from "react";
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Menu from "../../Components/Menu";
import Footer from "../../Components/Footer";
import SecondaryMenu from "../../Components/SecondMenu";
import FavoritesPage from "./FavoritesPage";
import "./styles/user-page.css";

const UserPage = () => {
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('favorites');


  // const fetchOrders = async () => {
  //   // Fetch orders from the backend
  //   const response = await fetch("/api/user/orders");
  //   const data = await response.json();
  //   setOrders(data);
  // };

  // const fetchFavorites = async () => {
  //   // Fetch favorites from the backend
  //   const response = await fetch("/api/user/favorites");
  //   const data = await response.json();
  //   setFavorites(data);
  // };

  return (
    <div>
      <Menu />
      <SecondaryMenu />
      <Container fluid>
        <Row>
          <Col md={3} className="user-sidebar">
            <ListGroup>
              <ListGroup.Item action onClick={() => setActiveTab('favorites')}>
                Favorite
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setActiveTab('orders')}>
                Comenzile Mele
              </ListGroup.Item>
              <ListGroup.Item action onClick={() => setActiveTab('settings')}>
                Setari Cont
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={9}>
            {activeTab === 'favorites' && <FavoritesPage />}
            {/* {activeTab === 'orders' && <OrdersPage />}
            {activeTab === 'settings' && <SettingsPage />} */}
          </Col>
        </Row>
      </Container>
      <Footer/>
    </div>
  );
};

export default UserPage;
