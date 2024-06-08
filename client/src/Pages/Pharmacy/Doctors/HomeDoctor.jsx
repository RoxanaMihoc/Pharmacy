import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboards/DashBoard";
import PatientList from './Dashboards/PatientList';
import { useLocation, useHistory } from "react-router-dom";
import PatientProfile from './Dashboards/PatientProfile';
import Recommend from "./Dashboards/Prescription/Recommend";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
// import Appointments from './Appointments';
// import Reports from './Reports';
// import Settings from './Settings';
import Footer from "../../../Components/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import "./styles/home.css";

const HomeDoctor = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const history= useHistory();

  const getTabName = (activeTab) => {
    const tabNames = {
      dashboard: "Dashboard",
      appointments: "Appointments",
      patients: "Patients",
      reports: "Reports",
      settings: "Settings",
      prescription: "Prescription",
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
              <button className="icon-button">
                <FontAwesomeIcon icon={faBell} />
              </button>
              <button className="icon-button">
                <FontAwesomeIcon icon={faUserCircle} />
              </button>
            </div>
          </div>
          <Switch>
            {/* <Route path="/patients/dashboard" component={CartPage} /> */}
            <Route path="/patients/profile/:patientId" component={PatientProfile} />
            <Route path="/patients/profile" component={PatientList} />
            <Route path="/patients/prescription" component={Recommend} />
            <Redirect from="/home" exact to="/patients/dashboard" />
            <Route component={() => <div>Page not found</div>} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default HomeDoctor;
