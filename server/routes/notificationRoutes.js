
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/verifyToken');

console.log("in notif route");

router.post('/add-notification', verifyToken, notificationController.addNotification);
router.get('/notifications', verifyToken, notificationController.getNotificationsByRole);

module.exports = router;
