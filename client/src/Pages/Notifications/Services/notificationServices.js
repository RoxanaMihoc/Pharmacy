const BASE_URL = "http://localhost:3000";

export const fetchNotifications = async (currentUser, role, token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/home/notifications/${currentUser}/${role}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }

    const data = await response.json();
    console.log(data);
    return {success: true, fetchedNotifications: data};
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
};

// notifServices.js

export const saveNotificationToDatabase = async (userId, role, notification,token) => {
  try {
    await fetch(`${BASE_URL}/home/add-notification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
