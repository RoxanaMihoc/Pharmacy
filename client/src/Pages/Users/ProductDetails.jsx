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
import { addToFavorites } from "../Services/favoritesServices";
import "./styles/product-details.css"; // Import your CSS file
import {
  fetchProductDetails,
  fetchProductsByBrand,
} from "../Services/productServices";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState([{}]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [brand, setBrand] = useState("");
  const { currentUser, token } = useAuth();
  const [activeTab, setActiveTab] = useState("description");
  const productsGridRef = useRef(null);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductDetails(productId,token);
        setProduct(data);
        setBrand(data.brand);
        console.log("gais", product);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchData();
  }, [productId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProductsByBrand(brand,token);
        setRelatedProducts(data);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };

    if (brand) fetchData();
  }, [brand]);

  // const handleAddToCart = async (productId) => {
  //   try {
  //     const result = await addToCart(currentUser, productId);
  //     console.log("Product added to cart:", result);
  //     if (result.success) {
  //       const result = addToCartF(productId);
  //       console.log(result);
  //     }
  //   } catch (error) {
  //     console.error("Failed to add product to cart:", error.message);
  //   }
  // };

  const scrollLeft = () => {
    productsGridRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    productsGridRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  const handleAddToFavorites = async (productId,) => {
    try {
      const result = await addToFavorites(
        currentUser,
        productId,
        category,
        subcategory,token
      );
      console.log("Product added to favorites:", result);
      // Handle success, update UI or show a message
    } catch (error) {
      console.error("Failed to add product to favorites:", error.message);
      // Handle error, show an error message to the user
    }
  };

  const toggleShowFullText = () => {
    setShowFullText((prev) => !prev);
  };

  return (
    <div>
      <SecondaryMenu />
      <div className="product-page1">
        <div className="product-page">
          <div className="product-container">
            <div className="product-image-container">
              <h1 className="product-title">{product.title}</h1>
              <img
                className="product-image-x"
                src={product.photo}
                alt={product.title}
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
                <strong>Disponibilitate:</strong> In stoc
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
              Prospect medical
            </button>
          </div>
          <div className="tab-content">
            {activeTab === "description" && (
              <div className="description">
                <h2>
                  <strong>Descriere</strong>
                </h2>

                {product.description &&
                  product.description
                    .split(
                      /(?<!www\.[\w\-]+\.[a-z]{2,})(?<!https?:\/\/[\w\-\.]+)(?<=\.)\s|(?<!www\.[\w\-]+\.[a-z]{2,})(?<!https?:\/\/[\w\-\.]+)(?<!\w)-\s/
                    )
                    .map((line, index) => {
                      // Înlocuim numerele din text cu tag-uri <strong>
                      const processedLine = line.replace(
                        /(\d+)/g,
                        "<strong>$1</strong>"
                      );

                      if (!showFullText && index > 2) return null; // Afișează doar primele 3 propoziții
                      return (
                        <p
                          key={index}
                          dangerouslySetInnerHTML={{
                            __html:
                              processedLine +
                              (index === 2 && !showFullText ? "..." : ""),
                          }}
                        ></p>
                      );
                    })}

                <button
                  className="show-more-button"
                  onClick={toggleShowFullText}
                >
                  {showFullText ? "Afișează mai puțin" : "Afișează mai mult"}
                </button>
              </div>
            )}
            {activeTab === "usefulInfo" && (
              <div className="useful-info">
                  <iframe
                    src={product.prospect}
                    title="Prospect PDF"
                    className="prospect-pdf"
                    width="100%"
                    height="600px"
                  ></iframe>
              </div>
            )}
          </div>
        </div>

        <div className="related-products">
          <h2>Alte produse ale producatorului {product.brand}</h2>
          <div className="products-navigation">
            <button className="card-nav-button" onClick={scrollLeft}>
              ⇦
            </button>
            <div className="products-grid" ref={productsGridRef}>
              {relatedProducts.length > 0 ? (
                relatedProducts.map((relatedProduct) => (
                  <div className="product-card" key={relatedProduct._id}>
                    <Link to={`/home/product-page/${relatedProduct._id}`}>
                      <img
                        src={relatedProduct.photo}
                        alt={relatedProduct.title}
                        className="product-card-image"
                      />
                      <p className="product-title">{relatedProduct.title}</p>
                    </Link>
                    <p className="product-brand">{relatedProduct.brand}</p>
                    <p className="product-price">{relatedProduct.price} RON</p>
                    <button className="card-add-to-cart">ADAUGĂ ÎN COȘ</button>
                  </div>
                ))
              ) : (
                <div> No product</div>
              )}
            </div>
            <button className="card-nav-button" onClick={scrollRight}>
              ⇨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
