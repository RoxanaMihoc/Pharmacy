import React from 'react';
import { useAuth } from "../../Context/AuthContext";

const Sidebar = ({ onNavigate, setActiveTab }) => {
    const { logout } = useAuth();
    const handleNavigate = (path, tab) => {
        setActiveTab(tab);
        onNavigate(path);
    };
    return (
        <div className="sidebar">
            <div className="sidebar-header">
            MedMonitor
            </div>
            <ul>
            <li onClick={() => handleNavigate('/home/medicamente-otc','product')}>Pharmacy</li>
            <li onClick={() => handleNavigate('/home/profile/:currentUser', 'profile')}>My Profile</li>
            {/* <li onClick={() => handleNavigate('/home/orders', 'orders')}>Orders</li> */}
            <li onClick={() => handleNavigate('/home/prescriptions', 'prescriptions')}>Prescriptions</li>
            <li onClick={logout} >Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;