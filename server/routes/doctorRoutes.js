const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

router.get('/all-doctors', doctorController.getAllDoctors);
router.get('/patients-list/:currentUser', doctorController.getAllPatientsByDoctorId);
router.get('/patient/:patientId', doctorController.getPatientDetails);

module.exports = router;