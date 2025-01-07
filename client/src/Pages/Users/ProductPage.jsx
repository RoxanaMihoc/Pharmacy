import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import SecondaryMenu from "../../Components/SecondMenu";
import { useAuth } from '../../Context/AuthContext';
import { addToFav, addToFavF } from '../../Components/FavButton';
import addToFavorites from '../../Components/FavoritesButton';
import "./styles/product-page.css"; // Import your CSS file
import { Container, Row, Col, Form, Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleRight, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const ProductPage = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([10, 150]);
  const [displayedPriceRange, setDisplayedPriceRange] = useState([10, 150]);
  const { currentUser } = useAuth();
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const prescriptionId = null;

  // PAGINATION - START
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9); // Sau 12, după preferință
  // PAGINATION - END

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
    // Implementați filtrarea după brand și preț (dacă doriți un buton dedicat)
    // Deocamdată, folosim direct filteredProducts mai jos
  };

  const handlePriceChange = (newRange) => {
    setPriceRange(newRange);
    setDisplayedPriceRange(newRange);
  };

  // Filtrăm produsele pe baza brand-urilor și a intervalului de preț
  const filteredProducts = products.filter((product) => {
    const isCategorySelected =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const isPriceInRange =
      product.price >= priceRange[0] && product.price <= priceRange[1];

    return isCategorySelected && isPriceInRange;
  });

  // PAGINATION - START
  // Calculăm index-urile necesare
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Produsele care vor fi afișate pe pagina curentă
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Numărul total de pagini
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handlers pentru paginare
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
    }
  };
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to the top
  };
  // PAGINATION - END

  const handleAddToFav = async (productId) => {
    try {
      const result = await addToFav(currentUser, productId, prescriptionId);
      console.log('Product added to cart:', result);
      if (result.success) {
        const result2 = addToFavF(productId);
        console.log(result2);
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
      if (result.success) {
        const result2 = addToFavF(productId);
        console.log(result2);
      }
      // Handle success, update UI or show a message
    } catch (error) {
      console.error('Failed to add product to cart:', error.message);
      // Handle error, show an error message to the user
    }
  };

  // Simplu map pentru a afișa subcategoriile cu denumiri mai citite
  const linkMap = {
    "medicamente-otc": "Medicamente fara reteta",
    "afectiuni-ale-cavitatii-bucale": "Afectiuni ale cavitatii bucale",
    "antispastice-balonare-constipatie": "Antiacide, Antispastice, Balonare",
    "enzime-digestive": "Enzime Digestive",
    "greata-gastrita": "Gastrita si ulcer, Greata si varsaturi",
  };

  function getMappedText(subdirectory) {
    return linkMap[subdirectory] || subdirectory; // Fall-back dacă nu există
  }

  return (
    <div>
      <SecondaryMenu />
      <Container className="container">
        <Row>
          {/* Coloana de filtre */}
          <Col md={3} className="filter-container">
            <h1>{getMappedText(subcategory)}</h1>
            <h3 className="brands-filter">Branduri</h3>
            <div className="brands-scrollable">
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
              max={150}
              value={priceRange[1]}
              className="range-slider"
              style={{
                '--min': priceRange[0],
                '--max': priceRange[1],
                '--min-limit': 10,
                '--max-limit': 150,
              }}
              onChange={(e) =>
                handlePriceChange([priceRange[0], parseInt(e.target.value)])
              }
            />

            <p>
              Preț: {displayedPriceRange[0]} - {displayedPriceRange[1]} Lei
            </p>
          </Col>

          {/* Coloana cu lista de produse */}
          <Col md={9} className="product-list-container">
            <h1>Listă produse</h1>
            <Row>
              {/** Afișăm DOAR produsele din pagina curentă */}
              {currentProducts.map((product) => (
                <Col key={product._id} md={4} className="mb-4">
                  <Card className="card-porduct-page">
                    <Card.Img
                      className="card-img-1"
                      variant="top"
                      src={product.photo}
                    />
                    <Card.Body>
                      <Link to={`/home/product-page/${product._id}`}>
                        <Card.Title
                          className="card-title"
                          style={{ textAlign: "center" }}
                        >
                          {product.title}
                        </Card.Title>
                      </Link>
                      <Card.Subtitle className="mb-2 text-muted">
                        {product.brand}
                      </Card.Subtitle>
                      <Card.Text>{`Preț: ${product.price} Lei`}</Card.Text>

                      <button
                        className="add-fav-card"
                        onClick={() => handleAddToFav(product._id)}
                      >
                        Adaugă produs
                      </button>

                      <button
                        className="add-fav-card"
                        onClick={() => handleAddToFavorites(product._id)}
                      >
                        Adaugă la favorite
                      </button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* PAGINATION - START */}
            {totalPages > 1 && (
              <div className="pagination">
                {currentPage > 1 && (
                  <button 
                  // className="add-fav-card"
                  onClick={handlePrevPage}><FontAwesomeIcon icon={faArrowAltCircleLeft} /></button>
                )}

                {Array.from({ length: totalPages }, (_, i) => (
                  <span
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={currentPage === i + 1 ? "active-page" : ""}
                  >
                    {i + 1}
                  </span>
                ))}

                {currentPage < totalPages && (
                  <button 
                  // className="add-fav-card"
                  onClick={handleNextPage}><FontAwesomeIcon icon={faArrowAltCircleRight} /></button>
                )}
              </div>
            )}
            {/* PAGINATION - END */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductPage;