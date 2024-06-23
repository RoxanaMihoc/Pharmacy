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
            <li onClick={() => handleNavigate('/patients/profile', 'patients')}>Patients</li>
            <li onClick={() => handleNavigate('/patients/prescription', 'prescription')}>Prescriptions</li>
            <li onClick={() => handleNavigate('/patients/settings', 'settings')}>Settings</li>
            <li onClick={logout} >Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;
