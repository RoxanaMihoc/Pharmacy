// routes/recommendationRoutes.js
const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const { verifyToken } = require('../middleware/verifyToken');
const router = express.Router();

router.get('/all-prescriptions', verifyToken, prescriptionController.getAllPrescriptionsBasedOnRole);
  router.get('/prescription', verifyToken, prescriptionController.getPrescriptionsByPatientId);
  router.get('/current-prescription', verifyToken, prescriptionController.getCurentPrescription);
  router.patch('/prescription/:prescriptionId', verifyToken, prescriptionController.setPrescriptionsAsCurrent);
  router.patch('/prescription/remove-current/:prescriptionId', verifyToken, prescriptionController.setPrescriptionsAsNotCurrent);
  router.put("/delete-progress/:prescriptionId", verifyToken, prescriptionController.deleteLastProgress);
  module.exports = (io, userSockets) => {
  console.log("in rout",userSockets);
  router.post('/add-prescription', verifyToken, (req, res) => 
    prescriptionController.addPrescription(req, res, io, userSockets)
  );

  router.put('/update-progress/:prescriptionId/:medicationId', verifyToken, (req, res) => 
    prescriptionController.updateProgress(req, res, io, userSockets)
  );

  router.post('/progress-completed/:prescriptionId/:medicationId', verifyToken, (req, res) => 
    prescriptionController.progressCompleted(req, res, io, userSockets)
  );

    return router;
  };



