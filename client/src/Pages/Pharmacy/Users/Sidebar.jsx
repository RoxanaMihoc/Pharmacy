import React from 'react';
import "./styles/sidebar.css";
import { useAuth } from "../../../Context/AuthContext";
import Dashboard from '../Doctors/Dashboards/DashBoard';

const Sidebar = ({ onNavigate, setActiveTab }) => {
    const { logout } = useAuth();
    const handleNavigate = (path, tab) => {
        setActiveTab(tab);
        onNavigate(path);
    };
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                MyOrganizer
            </div>
            <ul>
            <li onClick={() => handleNavigate('/home/dashboard', 'dashboard')}>Dashboard</li>
            <li onClick={() => handleNavigate('/home/medicamente-otc','product')}>Pharmacy</li>
            <li onClick={() => handleNavigate('/home/profile', 'profile')}>My Profile</li>
            <li onClick={() => handleNavigate('/home/settings', 'settings')}>Settings</li>
            <li onClick={logout} >Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;