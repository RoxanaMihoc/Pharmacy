import React from 'react';
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubesStacked,faArrowLeftLong , faStore, faCommentMedical } from '@fortawesome/free-solid-svg-icons';

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
            <li onClick={() => handleNavigate('/pharmacy', 'stoc')}><FontAwesomeIcon icon={faStore} /> Stoc</li>
            <li onClick={() => handleNavigate('/pharmacy/orders', 'comenzi')}><FontAwesomeIcon icon={faCubesStacked} /> Comenzi</li>
            <li onClick={logout} ><FontAwesomeIcon icon={faArrowLeftLong} /> Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;
