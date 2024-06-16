// routes/recommendationRoutes.js
const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

module.exports = (io, userSockets) => {
    router.post('/add-prescription', (req, res) => prescriptionController.addPrescription(req, res, io, userSockets));
    return router;
  };
//router.get('/all-prescriptions', getAllPrescriptions);



