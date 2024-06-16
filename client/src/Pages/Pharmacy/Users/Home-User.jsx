import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CartPreview from "../../../Components/CartPreview";
import CartPage from "./CartPage";
import ProductPage from "./ProductPage";
import ProductDetails from "./ProductDetails";
import NotificationBell from "./NotificationBell";
import PrescriptionDetails from "./PrescriptionDetails";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/home.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

const HomeUser = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
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

  const getTabName = (activeTab) => {
    const tabNames = {
      dashboard: "Dashboard",
      appointments: "Appointments",
      profile: "My Profile",
      reports: "Reports",
      settings: "Settings",
      product: "Product List"
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
              <NotificationBell/>
              <button className="icon-button">
                <FontAwesomeIcon icon={faUserCircle} />
              </button>
              <button
                onClick={handleShowCartPreview}
                disabled={location.pathname === "/user/cart-page"}
              >
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  style={{ marginRight: "5px", fontSize: "30px" }}
                />
              </button>
            </div>
            <CartPreview
              show={showCartPreview}
              handleClose={handleCloseCartPreview}
              switchToCartPage={switchToCartPage}
            />
          </div>
          <Switch>
            <Route path="/home/dashboard" component={CartPage} />
            <Route path="/home/cart" component={CartPage} />
            <Route path="/home/prescription/:patientId" component={PrescriptionDetails} />
            <Route path="/home/product-page/:productId" component={ProductDetails} />
            <Route path="/home/:category/:subcategory?" component={ProductPage} />
            <Redirect from="/home" exact to="/home/dashboard" />
            <Route component={() => <div>Page not found</div>} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
