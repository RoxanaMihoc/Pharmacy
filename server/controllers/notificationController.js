const Notification = require("../models/notificationModel");
const { notifDB } = require("../config/database");
const SECRET_KEY = process.env.JWT_SECRET;

const addNotification = async (req, res) => {
  try {
    const { userId, role, notification } = req.body;
    console.log("in notig", userId, role,  notification);
    

    // Determine the collection name dynamically based on the role
    const collectionName =
      role === "Patient" ? `patient_${userId}` : `doctor_${userId}`;

    const patientCollection = notifDB.collection(collectionName);

    // Save the notification to the collection
    await patientCollection.insertOne({
      userId,
      role,
      notification,
    });

    res.status(201).json({ message: "Notification saved successfully" });
  } catch (error) {
    console.error("Error saving notification:", error);
    res.status(500).json({ error: "Failed to save notification" });
  }
};

const getNotificationsByRole = async (req, res) => {
  try {
    console.log(" in get notif: Fetching notifications by role...");
    const { currentUser, role } = req.params; 

    // Determine the collection dynamically based on the role
    const collectionName =
      role === "Patient" ? `patient_${currentUser}` : `doctor_${currentUser}`;
    const collection = notifDB.collection(collectionName);

    // Query the notifications
    const notifications = await collection
    .find({}) // No projection, retrieves all fields
    .sort({ dateReceived: -1 }) // Sort notifications by date (newest first)
    .toArray();


    console.log(notifications);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { addNotification, getNotificationsByRole };
