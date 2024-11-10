import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import {addToFav} from '../../Components/FavButton';
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import "./styles/favorites-page.css";

const FavoritesPage = () => {
  const [favoritesItems, setFavoritesItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { currentUser} = useAuth();
  useEffect(() => {
    const fetchFavoritesData = async () => {
      try {
        // Fetch favorites data from backend API
        const response = await fetch(
          `http://localhost:3000/home/favorites/${currentUser}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch favorites data");
        }
        const data = await response.json();
        console.log(data);
        setFavoritesItems(data);
      } catch (error) {
        console.error("Error fetching favorites data:", error);
      }
    };

    fetchFavoritesData();
  }, [currentUser]);

  useEffect(() => {
    const populateFavoritesItems = async () => {
      const promises = favoritesItems.map(async (id) => {
        const { success, data } = await fetchFavoritesItems(id);
        if (success) {
          return data;
        }
        return null;
      });

      const resolvedData = await Promise.all(promises);
      console.log(resolvedData);
      setFavorites(resolvedData);
      console.log("favorites" + favorites);
    };

    const fetchFavoritesItems = async (productId) => {
      console.log("Product Id " + productId);
      try {
        const response = await fetch(
          `http://localhost:3000/home/product/${productId}`
        );

        if (!response.ok) {
          throw new Error("Failed to add product to favorites");
        }

        const data = await response.json();
        return { success: true, data };
        // Handle successful response (e.g., display a success message)
      } catch (error) {
        console.error("Error adding product to favorites:", error);
        // Handle error (e.g., display an error message)
      }
    };

    populateFavoritesItems();
  }, [favoritesItems]);

  const handleRemoveItem = async (e, productId) => {
    e.preventDefault();
    try {
      // Send request to remove item from favorites
      const response = await fetch(
        `http://localhost:3000/home/favorites/${currentUser}/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to remove item from favorites");
      }

      const updatedfavorites = favorites.map((itemArray) =>
        itemArray.filter((product) => {
          if (product._id === productId) {
            return false; // Don't include the product in the updated favorites
          }
          return true; // Include other products in the updated favorites
        })
      );
      setFavoritesItems(favoritesItems.filter((item) => item !== productId));
      setFavorites(updatedfavorites);
      document.location.reload();
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
          <Col md={9} className="product-list-container">
          <h1>Listă de favorite</h1>
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
