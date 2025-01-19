// routes/recommendationRoutes.js
const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

router.get('/all-prescriptions/:currentUser',prescriptionController.getAllPrescriptionsBasedOnRole);
router.get('/prescription/:user',prescriptionController.getPrescriptionsByPatientId);
router.get('/current-prescription/:currentUser',prescriptionController.getCurentPrescription);
router.patch('/prescription/:prescriptionId',prescriptionController.setPrescriptionsAsCurrent);
router.patch('/prescription/remove-current/:prescriptionId',prescriptionController.setPrescriptionsAsNotCurrent);
router.put('/update-progress/:prescriptionId',prescriptionController.updateProgress);
router.put("/delete-progress/:prescriptionId", prescriptionController.deleteLastProgress);
module.exports = (io, userSockets) => {
  console.log("in rout",userSockets);
    router.post('/add-prescription', (req, res) => prescriptionController.addPrescription(req, res, io, userSockets));
    return router;
  };



