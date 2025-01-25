import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import {fetchFavorites, populateFavoriteItems, removeFavoriteItem} from '../Services/favoritesServices';
import { addToCart } from '../Services/cartServices';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./styles/favorites-page.css";

const FavoritesPage = () => {
  const [favoritesItems, setFavoritesItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { currentUser} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFavorites(currentUser); // Fetch favorites data
        setFavoritesItems(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (currentUser) {
      fetchData(); // Fetch data only if currentUser exists
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedFavorites = await populateFavoriteItems(favoritesItems); // Fetch favorite item details
        setFavorites(resolvedFavorites); // Update state with resolved data
        console.log("Fetched Favorites:", resolvedFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    if (favoritesItems.length > 0) {
      fetchData(); // Fetch data only if there are favorite items
    }
  }, [favoritesItems]);

  const handleRemoveItem = async (e, productId) => {
    e.preventDefault();
    try {
      const { success } = await removeFavoriteItem(currentUser, productId);
      if (success) {
        // Update favorites and favoritesItems state
        const updatedfavorites = favorites.map((itemArray) =>
          itemArray.filter((product) => product._id !== productId)
        );
        setFavoritesItems(favoritesItems.filter((item) => item !== productId));
        setFavorites(updatedfavorites);
      }
    } catch (error) {
      console.error("Error removing item from favorites:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
        const result = await addToCart(currentUser, productId);
        console.log("Product added to favorites:", result);
        if (result.success) {
          console.log(result);
        }
        // Handle success, update UI or show a message
      
    } catch (error) {
      console.error("Failed to add product to favorites:", error.message);
      // Handle error, show an error message to the user
    }
  };

  return (
    <div>
      <Container>
        <Row>
          <Col md={9} className="product-list-favorites-container">
          <h2>Listă de favorite</h2>
            <Row>
              {favorites.map((subArray, subArrayIndex) =>
                subArray.map((product, index) => (
                  <Col
                    key={`${
                      product._id || `product-${subArrayIndex}-${index}`
                    }`}
                    md={4}
                    className="mb-4"
                  >
                    <Card className="favorites-card">
                      <Card.Img
                        className="favorite-photo"
                        variant="top"
                        src={product.photo}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <Card.Body className="favorite-body">
                        <Link to={`/home/product/details/${product._id}`}>
                          <Card.Title style={{ textAlign: "center" }}>
                            {product.title}
                          </Card.Title>
                        </Link>
                        <Card.Subtitle className="mb-2 text-muted">
                          {product.brand}
                        </Card.Subtitle>
                        <Card.Text>{`Pret: ${product.price} Lei`}</Card.Text>
                        <Button
                          
                          className="add-fav-card"
                          onClick={() => handleAddToCart(product._id)}
                        >
                          Adauga Produs
                        </Button>
                        <Button
                          
                          className="add-fav-card"
                          onClick={(e) => handleRemoveItem(e, product._id)}
                        >
                          Șterge de la favorite
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FavoritesPage;
