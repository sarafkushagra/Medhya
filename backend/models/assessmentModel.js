import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["PHQ-9", "GAD-7"], 
    required: true 
  },
  score: { type: Number, required: true },
  responses: { type: [Number], required: true },
  date: { type: Date, default: Date.now }
});

// Schema for storing 5-day averages
const assessmentAverageSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["PHQ-9", "GAD-7", "GHQ-12"], 
    required: true 
  },
  fiveDayAverage: { type: Number, required: true },
  lastFiveScores: [{ type: Number, required: true }], // Array of last 5 scores
  lastUpdated: { type: Date, default: Date.now }
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
const AssessmentAverage = mongoose.model("AssessmentAverage", assessmentAverageSchema);

export { Assessment, AssessmentAverage };
