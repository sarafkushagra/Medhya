import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "ai"],
    required: true
  },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["normal", "emergency", "suggestion"], 
    default: "normal" 
  },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  sessionId: { 
    type: String, 
    required: true 
  }, 
  messages: [messageSchema],
  isActive: { type: Boolean, default: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model("Chat", chatSchema);
