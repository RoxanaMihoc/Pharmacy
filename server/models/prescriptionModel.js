const mongoose = require('mongoose');
const { prescriptionDB } = require("../config/database");

const patientSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  address: { type: String, required: true },
  appointments: { type: Array, required: true },
  birth_date: { type: Date, required: true },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  city: { type: String, required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  email: { type: String, required: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  firstName: { type: String, required: true },
  gender: { type: String, required: true },
  lastName: { type: String, required: true },
  medical_history: { type: Array, required: true },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  password: { type: String, required: true },
  phone: { type: String, required: true },
  postal_code: { type: String, required: true },
  recomandations: { type: Array, required: true},
  role: { type: String, default: 'patient' }
});

const prescriptionSchema = new mongoose.Schema({
    prescriptionNumber: { type: String, required: true, unique: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: patientSchema,
    diagnosis: { type: String, required: true },
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
  