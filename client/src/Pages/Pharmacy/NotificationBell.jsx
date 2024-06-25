import React, { useState, useEffect , useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import "./styles/notification.css";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const { currentUser, role } = useAuth();
  console.log(role);
  const [unreadCount, setUnreadCount] = useState(0);
  const history = useHistory();
  const notificationRef = useRef(null);

  function formatHour(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return hours + ' ' + ampm;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef]);

//   const fetchNotification = async (notification) => {
//     console.log("in fetch");
//     try {
//       const prescriptionData = {
//         userId: notification.prescriptionDetails.patientId,
//         prescriptionId: notification.id,
//         details: notification.prescriptionDetails,
//       };
//       const response = await fetch(
//         "http://localhost:3000/home/add-notification",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(prescriptionData),
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to send notification");
//       }
//       const result = await response.json();

//       console.log(result);
//     } catch (error) {
//       console.error("Error sending notification:", error);
//       alert("Failed to send prescription");
//     }
//   };
useEffect(() => {
  console.log("Setting up socket listeners", currentUser, role);
  socket.emit("register", currentUser, role);

  const handleNewNotification = (notification) => {
    console.log("Notification received:", notification);
    // Check if notification already exists to prevent duplicates
    setNotifications(prev => {
      const isExisting = prev.some(notif => notif.id === notification.id);
      if (!isExisting) {
        setUnreadCount(prevCount => prevCount + 1);
        return [notification, ...prev];
      } else {
        console.log("Duplicate notification received, ignoring:", notification.id);
        return prev; // Return the previous state if it's a duplicate
      }
    });
  };

  socket.on("new-order", handleNewNotification);

  return () => {
    console.log("Cleaning up socket listeners");
    socket.off("new-order", handleNewNotification);
  };
}, [currentUser, role]); // Only re-run the effect if `currentUser` or `role` changes
 // Adding notifications as a dependency may cause unnecessary re-renders, be cautious.


  const handleNotificationClick = (notification) => {
    console.log("in handle");
    history.push({
      pathname: `/pharmacy/orders/${notification.id}`,
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
        <div className="notification-panel" ref={notificationRef}>
          <h4>Notifications</h4>
          <ul>
            {notifications.map((notification, index) => (
              <li
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
              >
                {notification.message}
                <span className="notification-date">
                  {formatHour(notification.orderDetails.date)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
