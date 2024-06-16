import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import "./styles/notification.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { currentUser } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const history = useHistory();

//   const fetchNotifications = async () => {
//     try {
//         const response = await fetch(`http://localhost:3000/home/notification/${currentUser}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (!response.ok) {
//             throw new Error("Failed to fetch notifications");
//         }

//         const notifications = await response.json();
//         console.log(notifications);
//     } catch (error) {
//         console.error("Error fetching notifications:", error);
//         alert("Failed to fetch notifications");
//     }
// };

// useEffect(() => {
//     fetchNotifications();
// }, []); 


  // // Example of fetching notifications (Replace with WebSocket or other methods)
  const fetchNotification = async (notification) => {
    console.log("in fetch");
    try {
      const prescriptionData = {
        userId: notification.prescriptionDetails.patientId,
        prescriptionId: notification.id,
        details: notification.prescriptionDetails,
      };
      const response = await fetch(
        "http://localhost:3000/home/add-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(prescriptionData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }
      const result = await response.json();

      console.log(result);
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Failed to send prescription");
    }
  };

  useEffect(() => {
    console.log("Setting up socket listeners");
    socket.emit("register", currentUser);

    const handleNewNotification = (notification) => {
      console.log("Notification received:", notification);
      // Check if notification already exists to prevent duplicates
      if (!notifications.some(notif => notif.id === notification.id)) {
        fetchNotification(notification);
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      } else {
        console.log("Duplicate notification received, ignoring:", notification.id);
      }
    };

    socket.on("new-prescription", handleNewNotification);

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("new-prescription", handleNewNotification);
    };
  }, [notifications, currentUser]); // Adding notifications as a dependency may cause unnecessary re-renders, be cautious.


  const handleNotificationClick = (notification) => {
    // Push to the route where you want to show the notification details
    // Assuming you have a route like '/prescription/:id' and each notification
    // includes a 'prescriptionId' you can navigate to:
    console.log("lala", notifications);
    history.push({
      pathname: `/home/prescription/${notification.id}`,
      state: { notification }, // Pass the entire notification object via route state
    });
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      setUnreadCount(0); // Reset unread count when closing the notification panel
    }
  };

  return (
    <div>
      <button className="icon-button" onClick={toggleNotifications}>
        <FontAwesomeIcon icon={faBell} />
        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length}</span>
        )}
      </button>
      {showNotifications && (
        <div className="notification-panel">
          <h4>Notifications</h4>
          <ul>
            {notifications.map((notification, index) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
