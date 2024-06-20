import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CartPreview from "../../../Components/CartPreview";
import CartPage from "./CartPage";
import FavoritesPage from "./FavoritesPage";
import ProductPage from "./ProductPage";
import ProductDetails from "./ProductDetails";
import UserProfile from "./UserProfile";
import NotificationBell from "./NotificationBell";
import PrescriptionDetails from "./PrescriptionDetails";
import PaymentForm from "../../../Components/PaymentForm";
import Prescriptions from "./Prescriptions";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faHeart,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/home.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

// const stripePromise = loadStripe("your_public_key_here");

const HomeUser = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const location = useLocation();
  const history = useHistory();

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

  const getTabName = (activeTab) => {
    const tabNames = {
      dashboard: "Dashboard",
      appointments: "Appointments",
      profile: "My Profile",
      reports: "Reports",
      settings: "Settings",
      product: "Product List",
      favorites:"Favorites",
      prescriptions:"Prescriptions",
      orders:"Orders",
    };
    return tabNames[activeTab] || "Page Not Found";
  };

  const handleNavigate = (path) => {
    history.push(path);
  };

  return (
    <div>
      <div className="home-doctor">
        <Sidebar onNavigate={handleNavigate} setActiveTab={setActiveTab} />
        <div className="page-content">
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
                <FontAwesomeIcon icon={faShoppingCart} />
              </button>
            </div>
            <CartPreview
              show={showCartPreview}
              handleClose={handleCloseCartPreview}
              switchToCartPage={switchToCartPage}
            />
          </div>
          <Switch className="page">
          {/* <Elements stripe={stripePromise}>
              <Route path="/home/payment" component={PaymentForm} />
            </Elements> */}
            <Route path="/home/prescriptions" component={Prescriptions} />
            <Route path="/home/dashboard" component={CartPage} />
            <Route path="/home/cart" component={CartPage} />
            <Route path="/home/favorites" component={FavoritesPage} />
            <Route path="/home/profile/:currentUser" component={UserProfile} />
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
            <Redirect from="/home" exact to="/home/dashboard" />
            <Route component={() => <div>Page not found</div>} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
