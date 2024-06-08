import React from 'react';
import "./styles/sidebar.css";
import { useAuth } from "../../../Context/AuthContext";

const Sidebar = ({ setActiveTab }) => {
    const { logout } = useAuth();
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                MyOrganizer
            </div>
            <ul>
                <li onClick={() => setActiveTab('dashboard')}>Dashboard</li>
                <li onClick={() => setActiveTab('appointments')}>Appointments</li>
                <li onClick={() => setActiveTab('patients')}>Patients</li>
                <li onClick={() => setActiveTab('reports')}>Reports</li>
                <li onClick={() => setActiveTab('settings')}>Settings</li>
                <li onClick={logout} >Logout</li>
            </ul>
        </div>
    );
};

export default Sidebar;
