// routes/recommendationRoutes.js
const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

router.get('/all-prescriptions',prescriptionController.getAllPrescriptions);
router.get('/prescription/:patientId',prescriptionController.getPrescriptionsByPatientId);
module.exports = (io, userSockets) => {
  console.log("in rout",userSockets);
    router.post('/add-prescription', (req, res) => prescriptionController.addPrescription(req, res, io, userSockets));
    return router;
  };



