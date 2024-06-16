const mongoose = require('mongoose');
const { prescriptionDB } = require("../config/database");

const prescriptionSchema = new mongoose.Schema({
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
  ],
    notes: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' },
  });

  module.exports = prescriptionDB.model('Prescriptions', prescriptionSchema, 'prescriptions');
  