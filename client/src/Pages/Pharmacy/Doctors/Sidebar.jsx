import React from 'react';
import "./styles/sidebar.css";
import { useAuth } from "../../../Context/AuthContext";

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
            <li onClick={() => handleNavigate('/patients/dashboard', 'dashboard')}>Dashboard</li>
            <li onClick={() => handleNavigate('/patients/appointments','appointments')}>Appointments</li>
            <li onClick={() => handleNavigate('/patients/profile', 'patients')}>Patients</li>
            <li onClick={() => handleNavigate('/patients/prescription', 'prescription')}>Prescriptions</li>
            <li onClick={() => handleNavigate('/patients/settings', 'settings')}>Settings</li>
            <li onClick={logout} >Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;
