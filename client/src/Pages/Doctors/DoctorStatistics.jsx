import React, { useState, useEffect } from "react";
import "./styles/doctor-statistics.css";
import { useAuth } from "../../Context/AuthContext";
import { useLocation, useHistory } from "react-router-dom";

const DoctorStatistics = () => {
  const [stats, setStats] = useState({
    prescriptionsLastThreeMonths: 0,
    avgPrescriptionsPerMonth: 0,
    totalPrescriptions: 0,
  });

  const { currentUser, name, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const history= useHistory();

  const handleNavigate = (path) => {
    history.push(path);
  }

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Fetch prescriptions
        const prescriptionsResponse = await fetch(
          `http://localhost:3000/home/all-prescriptions/${currentUser}`
        );
        const prescriptionsData = await prescriptionsResponse.json();

        // Calculate statistics
        const lastThreeMonths = new Date();
        lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);

        const prescriptionsLastThreeMonths = prescriptionsData.filter(
          (prescription) => new Date(prescription.date) >= lastThreeMonths
        );

        const avgPrescriptionsPerMonth =
          prescriptionsLastThreeMonths.length / 3;

        // Update state
        setStats({
          totalPrescriptions: prescriptionsData.length,
          prescriptionsLastThreeMonths: prescriptionsLastThreeMonths.length,
          avgPrescriptionsPerMonth,
        });
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      }
    };

    fetchPrescriptions();
    fetchNotifications();
  }, [currentUser]);

  const sortNotifications = (notificationsArray) => {
    return notificationsArray.sort((a, b) => {
      console.log(a)
      const dateA = new Date(a.orderDetails.date);
      const dateB = new Date(b.orderDetails.date);
      return dateB - dateA; // Newest first
    });
  };

  const normalizeNotification = (notification) => {
    if (notification.notification) {
      // From database
      return {
        ...notification.notification,
        id: notification.id || notification.notification.id, // Ensure ID is normalized
      };
    }
    // Direct from WebSocket
    return notification;
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/home/notifications/${currentUser}/${role}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const fetchedNotifications = await response.json();
      const normalized = fetchedNotifications.map(normalizeNotification);
      setNotifications(sortNotifications(normalized)); // Sort before setting state
      console.log(notifications)
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="doctor-statistics-container">
      {/* Welcome Message */}
      <div className="welcome-message">
        <h1>Bună ziua Dr. {name}!</h1>
        <p>
        Iată o privire rapidă asupra activității tale recente. Rămâi la curent cu pacienții și rețetele tale.
        </p>
      </div>

      {/* Quick Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>{stats.totalPrescriptions}</h2>
          <p>Total Rețete</p>
        </div>
        <div className="stat-card">
          <h2>{stats.prescriptionsLastThreeMonths}</h2>
          <p>Rețete (Ultimele 3 luni)</p>
        </div>
        <div className="stat-card">
          <h2>{stats.avgPrescriptionsPerMonth.toFixed(2)}</h2>
          <p>Medie Rețete pe lună</p>
        </div>
        <div className="stat-card">
          <h2>12</h2>
          <p>Pacienți cu rețete active</p>
        </div>
      </div>

      {/* Notifications & Quick Actions */}
      <div className="quick-actions-section">
        {/* Notifications Section */}
        <div className="notifications-card">
          <h3>Notificări recente</h3>
          <ul>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <li key={index}>
                  <strong>
                    {notification.orderDetails.firstName}{" "}
                    {notification.orderDetails.lastName}
                  </strong>{" "}
                  a achiziționat o prescripție în data de: {" "}
                  <span>
                    {new Date(notification.orderDetails.date).toLocaleDateString()}
                  </span>
                </li>
              ))
            ) : (
              <li>No notifications available</li>
            )}
          </ul>
        </div>

        <div className="actions-card">
          <h3>Acțiuni Rapide</h3>
          <button className="quick-action-btn" onClick={() => handleNavigate('/doctor/prescription')}>Vezi rețete</button>
          <button className="quick-action-btn"onClick={() => handleNavigate('/doctor/profile')}>Gestionați Pacienții</button>
          
          <button className="quick-action-btn"onClick={() => handleNavigate('/doctor/prescription/users')}>Adaugă Rețetă</button>
        </div>
      </div>
    </div>
  );
};

export default DoctorStatistics;

