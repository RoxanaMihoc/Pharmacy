import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Menu from "../Components/Menu";
import "./styles/product-page.css"; // Import your CSS file
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const ProductPage = () => {
  const [categories, setCategories] = useState([
    "Electronics",
    "Clothing",
    "Home & Kitchen",
  ]);
  const [brands, setBrands] = useState(["BIOFARM", "Brand2", "Brand3"]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([10, 1000]);
  const [displayedPriceRange, setDisplayedPriceRange] = useState([10, 1000]);

  const { category} = useParams();
  const [products, setProducts] = useState([]);
  console.log(category);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/home/${category}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, [category]);

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

  return (
    <div>
      <Menu />
      <Container>
        <Row>
          <Col md={3} className="filter-container">
            <h3>Categories</h3>
            <Form.Group>
              {categories.map((category) => (
                <Form.Check
                  key={category}
                  type="checkbox"
                  label={category}
                  onChange={() => {} /* Handle category change */}
                />
              ))}
            </Form.Group>
            <h3>Brands</h3>
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
            <h3>Price Range</h3>
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
              Displayed Price Range: ${displayedPriceRange[0]} - $
              {displayedPriceRange[1]}
            </p>
            <Button variant="primary" onClick={handleFilter}>
              Filter
            </Button>
          </Col>
          <Col md={9} className="product-list-container">
            {/* Display products based on selected filters */}
            <h1>Product List</h1>
            <Row>
              {filteredProducts.map((product) => (
                <Col key={product._id} md={4} className="mb-4">
                  <Card>
                    <Card.Img variant="top" src={product.photo} style={{ height: '200px', objectFit: 'cover' }}/>
                    <Card.Body>
                      <Card.Title style={{textAlign: "center" }} >
                        {product.title}
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {product.brand}
                      </Card.Subtitle>
                      <Card.Text>{`Price: $${product.price}`}</Card.Text>
                      <Button variant="primary" className="mr-2">
                        Add to Cart
                      </Button>
                      <Button variant="secondary">Add to Wishlist</Button>
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
