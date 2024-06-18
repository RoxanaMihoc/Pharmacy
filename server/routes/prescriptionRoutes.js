// routes/recommendationRoutes.js
const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

router.get('/all-prescriptions',prescriptionController.getAllPrescriptions);
module.exports = (io, userSockets) => {
    router.post('/add-prescription', (req, res) => prescriptionController.addPrescription(req, res, io, userSockets));
    return router;
  };



