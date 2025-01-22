import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PatientList from './PatientList';
import { useLocation, useHistory } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import PatientProfile from './PatientProfile';
import Recommend from "./Prescription/Recommend";
import NotificationBell from "./NotificationBell";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
// import Appointments from './Appointments';
// import Reports from './Reports';
// import Settings from './Settings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import "./styles/home.css";
import DoctorStatistics from "./DoctorStatistics";

const HomeDoctor = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const history= useHistory();
  const { currentUser, name } = useAuth();
  console.log(name);

  const getTabName = (activeTab) => {
    console.log(activeTab)
    const tabNames = {
      patients: "Pacienți",
      prescription: "Rețete",
      statistici:"Statistici",
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

              <div className="nav-icons-profile">
            <button className="icon-button">
                <FontAwesomeIcon icon={faUserCircle} />
                <strong> {name}</strong>{" "}
              </button>
              </div>
            </div>
          </div>
          <Switch>
          <Route path="/doctor/stats" component={DoctorStatistics} />
            <Route path="/doctor/profile/:patientId" component={PatientProfile} />
            <Route path="/doctor/profile" component={PatientList} />
            <Route path="/doctor/prescription" component={Recommend} />
            <Redirect from="/home" exact to="/doctor/stats" />
            <Route component={() => <div>Page not found</div>} />
          </Switch>
        </div>
      </div>
    </div>
  );
};

export default HomeDoctor;
