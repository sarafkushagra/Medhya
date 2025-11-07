import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  neurologistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  medication: { type: String, required: true },
  duration: { type: String, required: true },
  instructions: { type: String, default: '' },
  status: { type: String, default: 'active', enum: ['active', 'completed', 'cancelled'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prescription', prescriptionSchema);