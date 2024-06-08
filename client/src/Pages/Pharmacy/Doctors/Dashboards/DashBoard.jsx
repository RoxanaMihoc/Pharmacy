import React from "react";
import { useAuth } from "../../../../Context/AuthContext";
// import SummaryCard from './SummaryCard';
// import AppointmentsCalendar from './AppointmentsCalendar';
// import UpcomingAppointments from './UpcomingAppointments';
// import PatientStatistics from './PatientStatistics';
import './styles/dashboard.css';

const Dashboard = () => {
  const { currentUser} = useAuth();
  return (
    <div className="dashboard">
      <div className="welcome-banner">
        <div className="welcome-text">
          <h2>Welcome back,</h2>
          {/* <h1>{currentUser.firstName}</h1> */}
          <p>You have total {12} appointments today!</p>
        </div>
      </div>
      <div className="summary-cards">
        {/* <SummaryCard title="Total Patients" number="473" />
                <SummaryCard title="Consultations" number="236" />
                <SummaryCard title="Injections" number="105" />
                <SummaryCard title="Surgeries" number="132" /> */}
      </div>
      <div className="dashboard-content">
        {/* <PatientStatistics />
                <div className="appointments-section">
                    <AppointmentsCalendar />
                    <UpcomingAppointments />
                </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
