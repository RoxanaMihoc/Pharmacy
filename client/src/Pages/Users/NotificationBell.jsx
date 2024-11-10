import React, { useState, useEffect, useRef } from "react";
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
  const { currentUser, role } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const history = useHistory();
  const notificationRef = useRef(null);

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
  //         setAllNotifications(notifications);
  //     } catch (error) {
  //         console.error("Error fetching notifications:", error);
  //         alert("Failed to fetch notifications");
  //     }
  // };

  // useEffect(() => {
  //     fetchNotifications();
  // }, []);

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
  }, []);

  useEffect(() => {
    socket.on("order-update", (message) => {
      // Assuming the message contains the notification message and additional details
      console.log("Order update received:", message);
      const newNotification = {
        id: message.orderId, // Assuming each message contains a unique order ID
        message: message.message,
        date: new Date().toISOString(), // Capture the date when the message is received
      };

      // Update notifications to include the new pharmacy notification
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      socket.off("order-update");
    };
  }, []);

  useEffect(() => {
    console.log("Setting up socket listeners", currentUser, role);
    socket.emit("register", currentUser, role);

    const handleNewNotification = (notification) => {
      console.log("Notification received:", notification);
      if (!notifications.some(notif => notif.id === notification.id)) {
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
  }, [notifications, currentUser]);

  const handleNotificationClick = (notification) => {
    history.push({
      pathname: `/home/prescription/${notification.id}`,
      state: { notification },
    });
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      setUnreadCount(0);
    }
  };

  function formatHour(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }

  return (
    <div>
      <button className="icon-button" onClick={toggleNotifications}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      {showNotifications && (
        <div className="notification-panel" ref={notificationRef}>
          <h4>Notificări</h4>
          <ul>
            {notifications.map((notification, index) => (
              <li key={index} onClick={() => handleNotificationClick(notification)}>
                {notification.message}
                <span className="notification-date">{formatHour(notification.date)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
