import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  FormControl,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import SecondaryMenu from "../../Components/SecondMenu";
import { useAuth } from "../../Context/AuthContext";
import { addToFav, addToFavF } from "../../Components/FavButton";
import addToFavorites  from "../../Components/FavoritesButton";
import "./styles/product-details.css"; // Import your CSS file

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState([{}]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [brand, setBrand] = useState("");
  const { currentUser} = useAuth();
  const [activeTab, setActiveTab] = useState("description");
  const productsGridRef = useRef(null);
  console.log(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/home/product/details/${productId}`
        );
        const data = await response.json();
        console.log(data);
        setProduct(data[0]);
        setBrand(product.brand);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchProductsByBrand = async () => {
      console.log(brand);
      try {
        const response = await fetch(`http://localhost:3000/home/products?brand=${encodeURIComponent(product.brand)}`);
        const data = await response.json();
        console.log(data);
        setRelatedProducts(data);
        console.log("p" + relatedProducts);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      }
    };

    fetchProductsByBrand();
  }, [brand]);

  const handleAddToCart = async (productId) => {
    try {
        const result = await addToCart(currentUser, productId);
        console.log("Product added to cart:", result);
        if (result.success) {
          const result = addToCartF(productId);
          console.log(result);
        }

    } catch (error) {
      console.error("Failed to add product to cart:", error.message);
      // Handle error, show an error message to the user
    }
  };

  const scrollLeft = () => {
    productsGridRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    productsGridRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const handleAddToFavorites = async (productId) => {
    try {
      const result = await addToFavorites(currentUser, productId, category, subcategory);
      console.log('Product added to favorites:', result);
      // Handle success, update UI or show a message
    } catch (error) {
      console.error('Failed to add product to favorites:', error.message);
      // Handle error, show an error message to the user
    }
  };


  return (
    <div>
      <SecondaryMenu />
      <div className="product-page1">
        <div className="product-page">
          <div className="product-container">
            <div className="product-image-container">
              <h1>{product.title}</h1>
              <img
                src={product.photo}
                alt={product.title}
                className="product-image"
              />
            </div>
            <div className="product-details">
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Cod produs:</strong> {product._id}
              </p>
              <p>
                <strong>Disponibilitate:</strong> {product.availability}
              </p>
            </div>
            <div className="purchase-info">
              <div className="price-box">
                <div className="price">{product.price} LEI</div>
                <div className="quantity-controls">
                  <FormControl type="number" defaultValue={1} min={1} />
                </div>
                <Button
                  
                  className="add-to-cart"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Adaugă produs
                </Button>
                <Button
                  
                  className="add-to-favorites"
                  onClick={() => handleAddToFavorites(product._id)}
                >
                  Adaugă la favorite
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="product-description">
          <div className="tabs">
            <button
              className={activeTab === "description" ? "active" : ""}
              onClick={() => setActiveTab("description")}
            >
              Descriere
            </button>
            <button
              className={activeTab === "usefulInfo" ? "active" : ""}
              onClick={() => setActiveTab("usefulInfo")}
            >
              Informatii utile
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description">
                <h2>Descriere</h2>
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === "usefulInfo" && (
              <div className="useful-info">
                <h2>Informatii utile</h2>
                {/* Add any useful information content here */}
                <p>Informatii suplimentare despre produs.</p>
              </div>
            )}
          </div>
        </div>
        <div className="related-products">
          <h2>Alte produse ale producatorului {product.brand}</h2>
          <div className="products-navigation">
            <button className="card-nav-button" onClick={scrollLeft}>Prev</button>
            <div className="products-grid" ref={productsGridRef}>

              { relatedProducts.length > 0 ?(
              relatedProducts.map((relatedProduct) => (
                <div className="product-card" key={relatedProduct._id}>
                  <Link to={`/home/product/details/${relatedProduct._id}`}>
                  <img src={relatedProduct.photo} alt={relatedProduct.title} className="product-card-image" />
                  <p className="product-title">{relatedProduct.title}</p>
                  </Link>
                  <p className="product-brand">{relatedProduct.brand}</p>
                  <p className="product-price">{relatedProduct.price} LEI</p>
                  <button className="card-add-to-cart">ADAGĂ ÎN COȘ</button>
                </div>
              ))
            ) : 
            (<div> No product</div>)
          }
            </div>
            <button className="card-nav-button" onClick={scrollRight}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
