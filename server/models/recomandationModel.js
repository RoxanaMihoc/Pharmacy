const recommendationSchema = new mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoosean.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{
      medicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true },
      dosage: String,
      duration: String,
      reason: String,
      sideEffects: String
    }],
    notes: String,
    date: { type: Date, default: Date.now },
    status: { type: String, default: 'Pending' },
    urgencyLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    followUpPlan: String,
    attachments: [String],
    patientFeedback: { type: String, default: '' }
  });
  