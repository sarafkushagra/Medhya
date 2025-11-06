import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Counselor is a user with role 'counselor'
    required: true,
    index: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: "INR"
  },
  paymentMethod: {
    type: String,
    enum: ["online", "cash", "bank_transfer", "upi"],
    default: "online"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  sessionType: {
    type: String,
    enum: ["oncampus", "online"],
    required: true
  },
  sessionDuration: {
    type: Number, // in minutes
    default: 60
  },
  ratePerHour: {
    type: Number,
    required: true
  },
  commission: {
    type: Number, // Platform commission percentage
    default: 15
  },
  counselorEarnings: {
    type: Number, // Amount counselor actually receives
    required: true
  },
  platformFee: {
    type: Number, // Platform fee amount
    required: true
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  // For tracking payment processing
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User" // Admin who processed the payment
  }
}, { 
  timestamps: true 
});

// Indexes for efficient querying
paymentSchema.index({ paymentStatus: 1, paymentDate: -1 });
paymentSchema.index({ appointment: 1 }, { unique: true });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return `₹${this.amount.toFixed(2)}`;
});

// Virtual for formatted counselor earnings
paymentSchema.virtual('formattedEarnings').get(function() {
  return `₹${this.counselorEarnings.toFixed(2)}`;
});

// Ensure virtuals are included in JSON output
paymentSchema.set('toJSON', { virtuals: true });
paymentSchema.set('toObject', { virtuals: true });

export default mongoose.model("Payment", paymentSchema);
