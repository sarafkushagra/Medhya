import Message from "../models/messageModel.js";
import mongoose from "mongoose";

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const messageData = { ...req.body };
    
    // Validate required fields
    if (!messageData.sender || !messageData.recipient || !messageData.content) {
      return res.status(400).json({ 
        error: 'Missing required fields: sender, recipient, content' 
      });
    }
    
    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(messageData.sender) || 
        !mongoose.Types.ObjectId.isValid(messageData.recipient)) {
      return res.status(400).json({ 
        error: 'Invalid sender or recipient ID' 
      });
    }
    
    const message = new Message(messageData);
    await message.save();
    
 
    // Populate sender and recipient details
    await message.populate([
      { path: 'sender', select: 'firstName lastName email' },
      { path: 'recipient', select: 'firstName lastName email' }
    ]);
    
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(senderId) || 
        !mongoose.Types.ObjectId.isValid(recipientId)) {
      return res.status(400).json({ error: 'Invalid user IDs' });
    }
    
    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId }
      ]
    })
    .populate('sender', 'firstName lastName email')
    .populate('recipient', 'firstName lastName email')
    .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get messages for a specific appointment
export const getAppointmentMessages = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
      return res.status(400).json({ error: 'Invalid appointment ID' });
    }
    
    const messages = await Message.find({ appointmentId })
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }
    
    const message = await Message.findByIdAndUpdate(
      messageId,
      { 
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    ).populate('sender', 'firstName lastName email')
     .populate('recipient', 'firstName lastName email');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
