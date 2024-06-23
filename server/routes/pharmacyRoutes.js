// pharmacyRoutes.js
const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

router.put('/stoc/:id/:currentUser', pharmacyController.deleteProduct);
router.delete('/stoc/:id/:currentUser', pharmacyController.deleteProduct);
router.get('/stocks/:currentUser',pharmacyController.getStock);
router.post('/check-stock', pharmacyController.checkStock);
router.get('/pharmacists/:pharmacy', pharmacyController.getPharmatist);

module.exports = router;
