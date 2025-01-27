import React, { useEffect, useState } from 'react';
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTablets, faUsers, faArrowLeftLong, faCommentMedical, faDashboard, faTimes } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onNavigate, setActiveTab, hideSidebarHandler }) => {
    const { logout } = useAuth();
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    // Function to check if the screen is smaller
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); // Check screen size on component mount

        return () => {
            window.removeEventListener('resize', handleResize);
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
                <li onClick={() => handleNavigate('/doctor/stats', 'statistici')}>
                    <FontAwesomeIcon icon={faDashboard} /> Statistici
                </li>
                <li onClick={() => handleNavigate('/doctor/profile', 'patients')}>
                    <FontAwesomeIcon icon={faUsers} /> Pacienți
                </li>
                <li onClick={() => handleNavigate('/doctor/prescription', 'prescription')}>
                    <FontAwesomeIcon icon={faTablets} /> Rețete
                </li>
                <li onClick={logout}>
                    <FontAwesomeIcon icon={faArrowLeftLong} /> Logout
                </li>
                {/* Show hideSidebarHandler only on smaller screens */}
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

