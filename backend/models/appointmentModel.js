import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true, 
    index: true 
  },
  counselor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Counselor", 
    required: true
  },
  institutionId: { 
    type: String, 
    required: true 
  },

  appointmentType: { 
    type: String, 
    enum: ["oncampus", "online"], 
    default: "oncampus" 
  },
  date: { type: Date, required: true }, 
  timeSlot: { type: String, required: true }, 

  urgencyLevel: { 
    type: String, 
    enum: ["routine", "urgent", "crisis"], 
    default: "routine" 
  },
  reason: { type: String, maxlength: 500 },
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled", "completed"], 
    default: "pending" 
  },
  roomId: { 
    type: String, 
    default: null 
  },
  confirmationEmailSent: { type: Boolean, default: false },
  bookedAt: { type: Date, default: Date.now }
}, { timestamps: true });

appointmentSchema.index({ counselor: 1, date: 1, timeSlot: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);
