import React from 'react';
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTablets, faUsers, faArrowLeftLong, faCommentMedical, faDashboard } from '@fortawesome/free-solid-svg-icons';

const Sidebar = ({ onNavigate, setActiveTab }) => {
    const { logout } = useAuth();
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
            <li onClick={() => handleNavigate('/doctor/stats', 'statistici')}><FontAwesomeIcon icon={faDashboard} />  Statistici</li>
            <li onClick={() => handleNavigate('/doctor/profile', 'patients')}><FontAwesomeIcon icon={faUsers} />  Pacienți</li>
            <li onClick={() => handleNavigate('/doctor/prescription', 'prescription')}><FontAwesomeIcon icon={faTablets} />  Rețete</li>
            <li onClick={logout} ><FontAwesomeIcon icon={faArrowLeftLong} /> Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;
