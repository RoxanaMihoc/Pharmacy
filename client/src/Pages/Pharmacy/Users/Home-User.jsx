import React, { useState } from "react";
import Sidebar from "./Sidebar";
import CartPreview from "../../../Components/CartPreview";
import CartPage from "./CartPage";
import ProductPage from "./ProductPage";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "./styles/home.css";

const HomeUser = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');

  const location = useLocation();

  const handleShowCartPreview = async () => {
    if (location.pathname !== "/home/cart-page") {
      setShowCartPreview(true);
    }
  };

  const handleCloseCartPreview = () => setShowCartPreview(false);

  const switchToCartPage = () => {
    setActiveTab("cart");
    setShowCartPreview(false); // Close the preview modal when moving to the cart page
  };

  const getTabName = (activeTab) => {
    const tabNames = {
      dashboard: "Dashboard",
      appointments: "Appointments",
      patients: "Patients",
      reports: "Reports",
      settings: "Settings",
      cart: "Cart",
    };
    return tabNames[activeTab] || "Page Not Found";
  };

  const renderContent = () => {
    switch (activeTab) {
      // case 'Profile':
      //   return (
      //     selectedPatientId
      //       ? <PatientProfile patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />
      //       : <PatientList onPatientSelect={setSelectedPatientId} />
      //   );
      case "pharmacy":
        return <ProductPage/>;
      // case 'settings':
      //     return <Settings />;
      // case 'appointments':
      //     return <Appointments />;
      // case 'appointments':
      //     return <Appointments />;
      case "cart":
        return <CartPage />;

      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div>
      <div className="home-doctor">
        <Sidebar setActiveTab={setActiveTab} />
        <div className="page-content">
          <div className="top-nav">
            {getTabName(activeTab)}
            <div className="nav-icons">
              <button className="icon-button">
                <FontAwesomeIcon icon={faBell} />
              </button>
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
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HomeUser;
