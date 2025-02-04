import React, { useState, useEffect } from "react";
import "./styles/doctor-statistics.css";
import { useAuth } from "../../Context/AuthContext";
import { useLocation, useHistory } from "react-router-dom";
import { fetchAllPrescriptions } from "../Services/prescriptionServices";
import { fetchNotifications } from "../Notifications/Services/notificationServices";

const DoctorStatistics = () => {
  const [stats, setStats] = useState({
    prescriptionsLastThreeMonths: 0,
    avgPrescriptionsPerMonth: 0,
    totalPrescriptions: 0,
  });

  const { currentUser, name, role, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const history = useHistory();

  const handleNavigate = (path) => {
    history.push(path);
  };

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { success, data, error } = await fetchAllPrescriptions(
          currentUser,token
        );

        if (success) {
          // Calculate statistics
          const lastThreeMonths = new Date();
          lastThreeMonths.setMonth(lastThreeMonths.getMonth() - 3);

          const prescriptionsLastThreeMonths = data.filter(
            (prescription) => new Date(prescription.date) >= lastThreeMonths
          );

          const avgPrescriptionsPerMonth =
            prescriptionsLastThreeMonths.length / 3;

          // Update state
          setStats({
            totalPrescriptions: data.length,
            prescriptionsLastThreeMonths: prescriptionsLastThreeMonths.length,
            avgPrescriptionsPerMonth,
          });
        } else {
          console.error("Error fetching prescriptions:", error);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchPrescriptions();
    fetchNotificationsData(); // Keep this call as is, assuming it's already refactored
  }, [currentUser]);

  const sortNotifications = (notificationsArray) => {
    return notificationsArray.sort((a, b) => {
      console.log(a);
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
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

  const fetchNotificationsData = async () => {
    try {
      const { success, fetchedNotifications } = await fetchNotifications(
        currentUser,
        role,token
      );

      if (success) {
        const normalized = fetchedNotifications.map(normalizeNotification);
        setNotifications(sortNotifications(normalized)); // Sort before setting state
        console.log(normalized);
      } else {
        console.error("Error fetching notifications");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  return (
    <div className="doctor-statistics-container">
      {/* Welcome Message */}
      <div className="welcome-message">
        <h1>Bună ziua Dr. {name}!</h1>
        <p>
          Iată o privire rapidă asupra activității tale recente. Rămâi la curent
          cu pacienții și rețetele tale.
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
              notifications.slice(0, 3).map(
                (
                  notification,
                  index // Only take the first 3 notifications
                ) => (
                  <li key={index}>
                    <div className="notification-message">
                    • {notification.message}
                    </div>
                  </li>
                )
              )
            ) : (
              <li>Nicio notificare disponibila.</li>
            )}
          </ul>
        </div>

        <div className="actions-card">
          <h3>Acțiuni Rapide</h3>
          <button
            className="quick-action-btn"
            onClick={() => handleNavigate("/doctor/prescription")}
          >
            Vezi rețete
          </button>
          <button
            className="quick-action-btn"
            onClick={() => handleNavigate("/doctor/profile")}
          >
            Gestionați Pacienții
          </button>

          <button
            className="quick-action-btn"
            onClick={() => handleNavigate("/doctor/prescription/users")}
          >
            Adaugă Rețetă
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorStatistics;
