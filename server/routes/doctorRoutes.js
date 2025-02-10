const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { verifyToken } = require('../middleware/verifyToken');

router.get('/all-doctors', doctorController.getAllDoctors);
router.get('/patients-list', verifyToken, doctorController.getAllPatientsByDoctorId);
router.get('/patient/:patientId', verifyToken, doctorController.getPatientDetails);
router.get('/details-doc/:doctorId', verifyToken, doctorController.getDoctorName);

module.exports = router;