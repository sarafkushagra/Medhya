import mongoose from "mongoose";

const crisisAlertSchema = new mongoose.Schema({
  alertId: { type: String, required: true, unique: true }, 
  severity: { type: String, enum: ["critical", "high", "medium" , "low"], required: true },
  type: { type: String, required: true }, 
  studentId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  source: { type: String, enum: ["ai_chat", "forum_post", "mood_tracker"], required: true },
  status: { type: String, enum: ["active", "in_progress", "resolved"], default: "active" },
  aiConfidence: { type: Number, min: 0, max: 100, required: true },
  keywordsTrigger: [{ type: String }],
  location: { type: String },
  previousAlerts: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("CrisisAlert", crisisAlertSchema);
