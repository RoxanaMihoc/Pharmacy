
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

console.log("in notif route");

router.post('/add-notification', notificationController.addNotification);
router.get('/notification/:currentUser', notificationController.getNotificationbyPatientId);

module.exports = router;
