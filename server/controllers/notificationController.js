const Notification = require("../models/notificationModel");

const addNotification = async (req, res) => {
  console.log("in notif");
  const { prescriptionId, details } = req.body;
  const patientId = details.patient._id;
  console.log(patientId, details);

  try {
    const newNotification = new Notification({
      prescriptionId,
      patientId,
      details,
      data
    });

    await newNotification.save();

    res
      .status(201)
      .json({
        message: "Notification created successfully",
        data: newNotification,
      });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal server was errored" });
  }
};

const getNotificationbyPatientId = async (req, res) => {
  try {
    console.log("in get notif");
    const { currentUser } = req.params;
    query = { patientId: currentUser };
    const notification = await Notification.find(
      query,
      "details dateReceived"
    );
    console.log(notification);
    res.json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addNotification, getNotificationbyPatientId };
