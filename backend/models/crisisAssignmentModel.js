import mongoose from "mongoose";

const crisisAssignmentSchema = new mongoose.Schema({
  alert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CrisisAlert",
    required: true,
    index: true,
  },
  counselor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Counselor",
    required: true,
    index: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // admin assigning
    required: true,
  },
  priority: {
    type: String,
    enum: ["critical", "high", "medium"],
    default: "high",
  },
  status: {
    type: String,
    enum: ["assigned", "acknowledged", "in_progress", "resolved", "escalated"],
    default: "assigned",
    index: true,
  },
  notes: { type: String, maxlength: 1000 },
  acknowledgedAt: { type: Date },
  resolvedAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("CrisisAssignment", crisisAssignmentSchema);


