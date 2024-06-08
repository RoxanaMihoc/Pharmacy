import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboards/DashBoard";
import PatientList from './Dashboards/PatientList';
import PatientProfile from './Dashboards/PatientProfile';
// import Appointments from './Appointments';
// import Reports from './Reports';
// import Settings from './Settings';
import Footer from "../../../Components/Footer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import "./styles/home.css";

const HomeDoctor = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const getTabName = (activeTab) => {
    const tabNames = {
      dashboard: "Dashboard",
      appointments: "Appointments",
      patients: "Patients",
      reports: "Reports",
      settings: "Settings",
    };
    return tabNames[activeTab] || "Page Not Found";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      // case 'appointments':
      //     return <Appointments />;
      case 'patients':
        return (
          selectedPatientId 
            ? <PatientProfile patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />
            : <PatientList onPatientSelect={setSelectedPatientId} />
        );
      // case 'reports':
      //     return <Reports />;
      // case 'settings':
      //     return <Settings />;
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
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default HomeDoctor;
