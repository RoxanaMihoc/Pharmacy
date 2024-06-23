const mongoose = require('mongoose');
const { notifDB } = require("../config/database");

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

const notificationSchema = new mongoose.Schema({
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: [{
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    diagnosis: { type: String, required: true },
    patient: patientSchema,
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
              productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },

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
