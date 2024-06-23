import React, { useState } from "react";
import Sidebar from "./Sidebar";
import StockList from "./StockList"
import OrderOverview from "./OrderOverview";
import { useLocation, useHistory } from "react-router-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import NotificationBell from "./NotificationBell";

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState("stoc");
  const history= useHistory();

  const getTabName = (activeTab) => {
    const tabNames = {
      stoc: "Stoc",
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
              <button className="icon-button">
                <FontAwesomeIcon icon={faUserCircle} />
              </button>
            </div>
          </div>
          <Switch>
          <Route
              path="/pharmacy/orders/:notificationId"
              component={OrderOverview}
              />
            <Route path="/pharmacy" component={StockList} />
            <Route component={() => <div>Page not found</div>} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
