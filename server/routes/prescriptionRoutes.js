// routes/recommendationRoutes.js
const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

router.get('/all-prescriptions/:currentUser',prescriptionController.getAllPrescriptionsBasedOnRole);
router.get('/prescription/:user',prescriptionController.getPrescriptionsByPatientId);
module.exports = (io, userSockets) => {
  console.log("in rout",userSockets);
    router.post('/add-prescription', (req, res) => prescriptionController.addPrescription(req, res, io, userSockets));
    return router;
  };



