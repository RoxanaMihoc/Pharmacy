import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/AuthContext";
import { useHistory } from "react-router-dom";
import "./styles/notification.css";
import io from "socket.io-client";
import {
  fetchNotifications,
  saveNotificationToDatabase,
} from "../Notifications/Services/notificationServices";

const socket = io("http://localhost:3000");

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visibleNotifications, setVisibleNotifications] = useState(4); // Track visible notifications
  const { currentUser, role } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const history = useHistory();
  const notificationRef = useRef(null);

  useEffect(() => {
    console.log("Setting up socket listeners", currentUser, role);
    socket.emit("register", currentUser, role);

    const handleNewNotification = async (notification) => {
      console.log("Notification received:", notification);
      const normalizedNotification = normalizeNotification(notification);

      if (
        !notifications.some((notif) => notif.id === normalizedNotification.id)
      ) {
        const updatedNotifications = sortNotifications([
          normalizedNotification,
          ...notifications,
        ]);
        setNotifications(updatedNotifications);
        setUnreadCount((prev) => prev + 1);

        // Save notification to the database using the service
        try {
          await saveNotificationToDatabase(
            currentUser,
            role,
            normalizedNotification,token
          );
        } catch (error) {
          console.error("Error saving notification to the database:", error);
        }
      } else {
        console.log(
          "Duplicate notification received, ignoring:",
          normalizedNotification.id
        );
      }
    };

    socket.on("new-prescription", handleNewNotification);

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("new-prescription", handleNewNotification);
    };
  }, [notifications, currentUser, role]);

  // Normalize notification structure
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

  // Sort notifications by date
  const sortNotifications = (notificationsArray) => {
    return notificationsArray.sort((a, b) => {
      const dateA = new Date(a.prescriptionDetails.date);
      const dateB = new Date(b.prescriptionDetails.date);
      return dateB - dateA; // Newest first
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleNotifications = async () => {
    if (!showNotifications) {
      try {
        const { success, fetchedNotifications } = await fetchNotifications(
          currentUser,
          role,token
        );
        if (success) {
          console.log(fetchedNotifications)
          const normalized = fetchedNotifications.map(normalizeNotification);
          setNotifications(sortNotifications(normalized));
        }
      } catch (error) {
        console.error("Error while fetching notifications:", error);
      }
    }
    setShowNotifications(!showNotifications);
    if (showNotifications) {
      setUnreadCount(0); // Reset unread count
    }
  };

  const handleNotificationClick = (notification) => {
    // Subtract from unread count only if greater than 0
    setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

    history.push({
      pathname: `/home/prescription/${notification.id}`,
      state: { notification },
    });
  };

  const loadMoreNotifications = () => {
    setVisibleNotifications((prev) => prev + 6); // Increase visible notifications by 6
  };

  function formatHour(dateString) {
    const date = new Date(dateString);

    const localHours = date.getHours();
    const localMinutes = date.getMinutes();

    const ampm = localHours >= 12 ? "PM" : "AM";

    const formattedHours = localHours % 12 || 12;

    const formattedMinutes =
      localMinutes < 10 ? "0" + localMinutes : localMinutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
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
            {notifications
              .slice(0, visibleNotifications)
              .map((notification, index) => (
                <li
                  key={index}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-container">
                    <span className="notification-message">
                      {notification.message}
                    </span>
                    <span className="notification-date">
                      {formatHour(notification.prescriptionDetails.date)}
                    </span>
                  </div>
                </li>
              ))}
          </ul>
          {notifications.length > visibleNotifications && (
            <div className="load-more-container">
              <button
                className="load-more-button"
                onClick={loadMoreNotifications}
              >
                Vezi mai mult
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
