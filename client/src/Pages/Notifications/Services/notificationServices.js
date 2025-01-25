const BASE_URL = "http://localhost:3000";

export const fetchNotifications = async (currentUser, role) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/notifications/${currentUser}/${role}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

// notifServices.js

export const saveNotificationToDatabase = async (userId, role, notification) => {
  try {
    await fetch(`${BASE_URL}/home/add-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        role,
        notification,
      }),
    });
  } catch (error) {
    console.error("Error saving notification to the database:", error);
    throw error; // Rethrow the error for the caller to handle
  }
};
