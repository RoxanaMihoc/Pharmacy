import React from 'react';
import { useAuth } from "../../Context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubesStacked, faArrowLeftLong, faStore, faTablets, faCommentMedical } from '@fortawesome/free-solid-svg-icons';

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
            <li onClick={() => handleNavigate('/home/medicamente-otc','product')}><FontAwesomeIcon icon={faStore} />  Farmacie</li>
            <li onClick={() => handleNavigate('/home/orders', 'orders')}> <FontAwesomeIcon icon={faCubesStacked} /> Comenzi</li>
            <li onClick={() => handleNavigate('/home/prescriptions', 'prescriptions')}> <FontAwesomeIcon icon={faTablets} /> Rețete</li>
            <li onClick={logout} ><FontAwesomeIcon icon={faArrowLeftLong} />  Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;