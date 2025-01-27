import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import CartPreview from "../../Components/CartPreview";
import CartPage from "./CartPage";
import FavoritesPage from "./FavoritesPage";
import ProductPage from "./ProductPage";
import ProductDetails from "./ProductDetails";
import NotificationBell from "./NotificationBell";
import PrescriptionDetails from "./PrescriptionDetails";
import Prescriptions from "./Prescriptions";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../Context/AuthContext";
import OrderPage from "./OrdersPage";
import CurrentPrescription from "./CurrentPrescription";
import {
  faBell,
  faHeart,
  faBagShopping,
  faUserCircle,
  faBars,
  faTimes, // New icon for closing
} from "@fortawesome/free-solid-svg-icons";
import "./styles/home.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

const HomeUser = () => {
  const [activeTab, setActiveTab] = useState("product");
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 768);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const location = useLocation();
  const history = useHistory();
  const { currentUser, name } = useAuth();

  const handleShowCartPreview = async () => {
    if (location.pathname !== "/home/cart") {
      setShowCartPreview(true);
    }
  };

  const handleCloseCartPreview = () => setShowCartPreview(false);

  const switchToCartPage = () => {
    handleNavigate("/home/cart");
    setActiveTab("cart");
    setShowCartPreview(false); // Close the preview modal when moving to the cart page
  };

  const handleFavoritesButton = () => {
    handleNavigate("/home/favorites");
    setActiveTab("favorites");
  };

  const handleUserButton = () => {
    handleNavigate("/home/profile");
    setActiveTab("profile");
  };

  const getTabName = (activeTab) => {
    const tabNames = {
      product: "Farmacie",
      favorites: "Favorite",
      prescriptions: "Rețete",
      orders: "Comenzi",
      cart: "Coș",
      profile: "Profile",
      current_prescription: "Rețetă curentă",
    };
    return tabNames[activeTab] || "Page Not Found";
  };

  const handleNavigate = (path) => {
    console.log("Path", path);
    history.push(path);
  };

  const handleResize = () => {
    setShowSidebar(window.innerWidth > 768); // Automatically hide sidebar on smaller screens
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showSidebarHandler = () => {
    setShowSidebar(true);
  };

  const hideSidebarHandler = () => {
    setShowSidebar(false);
  };

  return (
    <div>
      <div className="home-doctor">
      {!showSidebar && ( // Show the "menu open" button only when the sidebar is hidden
              <button className="menu-open-button" onClick={showSidebarHandler}>
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
        {showSidebar && (
          <>
            <Sidebar
              onNavigate={handleNavigate}
              setActiveTab={setActiveTab}
              hideSidebarHandler={hideSidebarHandler}
              className="sidebar active"
            />
          </>
        )} 
        <div className={`page-content ${showSidebar ? "with-sidebar" : ""}`}>
          <div className="top-nav">
            {getTabName(activeTab)}
            <div className="nav-icons">
              <NotificationBell />
              <button className="icon-button" onClick={handleFavoritesButton}>
                <FontAwesomeIcon icon={faHeart} />
              </button>
              <button
                className="icon-button"
                onClick={handleShowCartPreview}
                disabled={location.pathname === "/user/cart-page"}
              >
                <FontAwesomeIcon icon={faBagShopping} />
              </button>
              <button className="icon-button" onClick={handleUserButton}>
                <FontAwesomeIcon
                  icon={faUserCircle}
                  style={{ marginRight: "8px" }}
                />
                <strong> {name}</strong>
              </button>
            </div>
            <CartPreview
              show={showCartPreview}
              handleClose={handleCloseCartPreview}
              switchToCartPage={switchToCartPage}
            />
          </div>
          <Switch className="page">
            <Route path="/home/prescriptions" component={Prescriptions} />
            <Route path="/home/cart" component={CartPage} />
            <Route path="/home/favorites" component={FavoritesPage} />
            <Route path="/home/orders" component={OrderPage} />
            <Route
              path="/home/current-prescription"
              component={CurrentPrescription}
            />
            <Route
              path="/home/prescription/:patientId"
              component={PrescriptionDetails}
            />
            <Route
              path="/home/product-page/:productId"
              component={ProductDetails}
            />
            <Route
              path="/home/:category/:subcategory?"
              component={ProductPage}
            />
            <Redirect from="/home" exact to="/home/medicamente-otc" />
            <Route component={() => <div>Page not found</div>} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
