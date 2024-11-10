import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SecondaryMenu from "../../Components/SecondMenu";
import { useAuth } from '../../Context/AuthContext';
import {addToFav, addToFavF} from '../../Components/FavButton';
import addToFavorites from '../../Components/FavoritesButton';
import "./styles/product-page.css"; // Import your CSS file
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([10, 1000]);
  const [displayedPriceRange, setDisplayedPriceRange] = useState([10, 1000]);
  const { currentUser} = useAuth();
  const {category, subcategory} = useParams();
  const [products, setProducts] = useState([]);
  console.log(category + " " + subcategory);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('http://localhost:3000/home/brands');
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/home/product/${category}/${subcategory}`
        );
        const data = await response.json();
        console.log(data);
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
    fetchBrands();
  }, [category, subcategory]);

  const handleBrandChange = (brand) => {
    const updatedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((selectedBrand) => selectedBrand !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(updatedBrands);
  };

  const handleFilter = () => {
    // Implement filtering logic based on selected filters (brands and price range)
    // Update the filtered products state
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setDisplayedPriceRange(newRange);
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    const isCategorySelected =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const isPriceInRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return isCategorySelected && isPriceInRange;
  });

  const handleAddToFav = async (productId) => {
    try {
      const result = await addToFav(currentUser, productId, category, subcategory);
      console.log('Product added to cart:', result);
      if(result.success)
      {
        const result = addToFavF(productId);
        console.log(result);
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error.message);
      // Handle error, show an error message to the user
    }
  };

  const handleAddToFavorites = async (productId) => {
    try {
      const result = await addToFavorites(currentUser, productId, category, subcategory);
      console.log('Product added to cart:', result);
      if(result.success)
      {
        const result = addToFavF(productId);
        console.log(result);
      }
      // Handle success, update UI or show a message
    
    } catch (error) {
      console.error('Failed to add product to cart:', error.message);
      // Handle error, show an error message to the user
    }
  };
  const linkMap = {
    "medicamente-otc" : "Medicamente fara reteta" ,
    "afectiuni-ale-cavitatii-bucale":"Afectiuni ale cavitatii bucale",
    "antispastice-balonare-constipatie":"Antiacide, Antispastice, Balonare",
    "enzime-digestive": "Enzime Digestive",
      "greata-gastrita":"Gastrita si ulcer, Greata si varsaturi",
    // Add more mappings as needed
  };

  function getMappedText(subdirectory) {
    return linkMap[subdirectory] || subdirectory; // Default to subdirectory if no match is found
}

  return (
    <div>
      <SecondaryMenu />
      <Container className="container">
        <Row>
          <Col md={3} className="filter-container">
            <h1>{getMappedText(subcategory)}</h1>
            <h3 className="brands-filter">Branduri</h3>
            <div className="brands-scrollable"> {/* Scrollable container for brands */}
            <Form.Group>
              {brands.map((brand) => (
                <Form.Check
                  key={brand}
                  type="checkbox"
                  label={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                />
              ))}
            </Form.Group>
            </div>
            <h3 className="brands-filter-price">Preț</h3>
            <Form.Control
              type="range"
              min={10}
              max={1000}
              value={priceRange[1]}
              onChange={(e) =>
                handlePriceChange([priceRange[0], parseInt(e.target.value)])
              }
            />

            <p>
              Preț: ${displayedPriceRange[0]} - Lei
              {displayedPriceRange[1]}
            </p>
            {/* <Button  onClick={handleFilter}>
              Filter
            </Button> */}
          </Col>
          <Col md={9} className="product-list-container">
            {/* Display products based on selected filters */}
            <h1>Listă produse</h1>
            <Row>
              {filteredProducts.map((product) => (
                <Col key={product._id} md={4} className="mb-4">
                  <Card className="card-porduct-page">
                    <Card.Img className="card-img-1"
                      variant="top"
                      src={product.photo}
                    
                    />
                    <Card.Body>
                    <Link to={`/home/product-page/${product._id}`}>
                      <Card.Title className="card-title" style={{ textAlign: "center" }}>
                        {product.title}
                      </Card.Title>
                      </Link>
                      <Card.Subtitle className="mb-2 text-muted">
                        {product.brand}
                      </Card.Subtitle> 
                      <Card.Text>{`Preț: ${product.price} Lei`}</Card.Text>
                      <button className="add-fav-card"
                        
                        onClick={() => handleAddToFav(product._id)}>
                        Adaugă produs
                      </button>
                      <button  className="add-fav-card" onClick={() => handleAddToFavorites(product._id)}>Adaugă la favorite</button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductPage;
