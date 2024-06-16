const mongoose = require('mongoose');
const { notifDB } = require("../config/database");

const notificationSchema = new mongoose.Schema({
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: [{
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
          medication: {
              availability: String,
              brand: String,
              category: String,
              description: String,
              photo: String,
              price: Number,
              subcategory1: String,
              subcategory2: String,
              title: String,
          },
          dosage: String,
          duration: String,
          reason: String,
          sideEffects: String
      }
    ]
  }],
  dateReceived: { type: Date, default: Date.now },
});

module.exports = notifDB.model('Notifications', notificationSchema, 'notifications');
