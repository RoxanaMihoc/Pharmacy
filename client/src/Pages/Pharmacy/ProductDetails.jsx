import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  FormControl,
} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import Menu from "../../Components/Menu";
import Footer from "../../Components/Footer";
import SecondaryMenu from "../../Components/SecondMenu";
import { useAuth } from "../../Context/AuthContext";
import { addToCart, addToCartF } from "../../Components/CartButton";
import "./styles/product-details.css"; // Import your CSS file

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState([{}]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [brand, setBrand] = useState("");
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("description");

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

  // useEffect(() => {
  //   const fetchProductsByBrand = async () => {
  //     console.log(brand);
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/home/product/brand/${brand}`
  //       );
  //       const data = await response.json();
  //       console.log(data);
  //       setRelatedProducts(data);
  //       console.log("p" + relatedProducts);
  //     } catch (error) {
  //       console.error("Failed to fetch product details:", error);
  //     }
  //   };

  //   fetchProductsByBrand();
  // }, [brand]);

  const handleAddToCart = async (productId) => {
    try {
      const [header, payload, signature] = token.split(".");
      const decodedPayload = JSON.parse(atob(payload));

      if (decodedPayload && decodedPayload.userId) {
        const currentUser = decodedPayload.userId;

        const result = await addToCart(currentUser, productId);
        console.log("Product added to cart:", result);
        if (result.success) {
          const result = addToCartF(productId);
          console.log(result);
        }
        // Handle success, update UI or show a message
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error.message);
      // Handle error, show an error message to the user
    }
  };

  return (
    <div>
      <Menu />
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
                  variant="primary"
                  className="add-to-cart"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to cart
                </Button>
                <button className="add-to-favorites">ADAGĂ LA FAVORITE</button>
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
          <div className="products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div className="product-card" key={relatedProduct._id}>
                <img src={relatedProduct.photo} alt={relatedProduct.title} />
                <p className="product-title">{relatedProduct.title}</p>
                <p className="product-brand">{relatedProduct.brand}</p>
                <p className="product-price">{relatedProduct.price} LEI</p>
                <button className="add-to-cart">ADAGĂ ÎN COȘ</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
