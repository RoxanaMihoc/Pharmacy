// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to create a payment intent
router.post('/create-payment-intent', paymentController.createPaymentIntent);

module.exports = router;
