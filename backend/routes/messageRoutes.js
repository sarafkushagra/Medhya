import express from "express";
import { 
  sendMessage, 
  getMessages, 
  getAppointmentMessages,
  markMessageAsRead 
} from "../controllers/messageController.js";

const router = express.Router();

// Send a new message
router.post("/", sendMessage);

// Get messages between two users
router.get("/:senderId/:recipientId", getMessages);

// Get messages for a specific appointment
router.get("/appointment/:appointmentId", getAppointmentMessages);

// Mark message as read
router.put("/:messageId/read", markMessageAsRead);

export default router;
