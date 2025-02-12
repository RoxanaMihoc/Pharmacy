import React, { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubesStacked,
  faArrowLeftLong,
  faStore,
  faTablets,
  faCommentMedical,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({ onNavigate, setActiveTab, hideSidebarHandler }) => {
  const { logout } = useAuth();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Function to check if the screen is smaller
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth <= 768); // Adjust the breakpoint as needed
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize(); // Check screen size on component mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavigate = (path, tab) => {
    setActiveTab(tab);
    onNavigate(path);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <FontAwesomeIcon icon={faCommentMedical} /> MedMonitor
      </div>
      <ul>
        <li onClick={() => handleNavigate("/home/medicamente-otc", "product")}>
          <FontAwesomeIcon icon={faStore} /> Farmacie
        </li>
        <li onClick={() => handleNavigate("/home/orders", "orders")}>
          <FontAwesomeIcon icon={faCubesStacked} /> Comenzi
        </li>
        <li
          onClick={() => handleNavigate("/home/prescriptions", "prescriptions")}
        >
          <FontAwesomeIcon icon={faTablets} /> Rețete
        </li>
        <li
          onClick={() =>
            handleNavigate("/home/current-prescription", "current_prescription")
          }
        >
          <FontAwesomeIcon icon={faTablets} /> Rețeta Curentă
        </li>
        <li onClick={logout}>
          <FontAwesomeIcon icon={faArrowLeftLong} /> Deconectare
        </li>
        {isSmallScreen && (
          <li onClick={hideSidebarHandler}>
            <FontAwesomeIcon icon={faTimes} /> Ieși din meniu
          </li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
