import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';
import Appointment from '../models/appointmentModel.js';
import Message from '../models/messageModel.js';
import Payment from '../models/paymentModel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mindcare');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check counselor account
const checkCounselorAccount = async () => {
  try {
    

    // Connect to database
    await connectDB();

    const email = 'headphonehoon56@gmail.com';

    // Check if user exists
    
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      
      
      return;
    }

    
    
    

    // Check counselor profile
    
    
    let counselor = null;
    
    if (user.counselorProfile) {
      counselor = await Counselor.findById(user.counselorProfile);
    } else {
      // Try to find by email
      counselor = await Counselor.findOne({ email });
    }

    if (!counselor) {
      
      
    } else {
      
      
      
      
      
      
      
      
      

      // Check if profiles are properly linked
      if (user.counselorProfile && counselor.userAccount) {
        
        
      } else {
        
        
        
      }
    }

    // Check related data
    
    
    // Check appointments
    const appointments = await Appointment.find({ 
      counselor: counselor?._id || user._id 
    }).countDocuments();
    

    // Check messages
    const messages = await Message.find({ 
      counselor: counselor?._id || user._id 
    }).countDocuments();
    

    // Check payments
    const payments = await Payment.find({ 
      counselor: counselor?._id || user._id 
    }).countDocuments();
    

    // Test dashboard data fetching
    
    
    if (counselor) {
      // Test getting appointments
      const upcomingAppointments = await Appointment.find({
        counselor: counselor._id,
        status: { $in: ['confirmed', 'pending'] },
        date: { $gte: new Date() }
      }).populate('student', 'firstName lastName email').limit(5);
      
      
      // Test getting messages
      const recentMessages = await Message.find({
        counselor: counselor._id
      }).populate('student', 'firstName lastName email').sort({ createdAt: -1 }).limit(5);
      
      
      // Test getting payments
      const recentPayments = await Payment.find({
        counselor: counselor._id
      }).sort({ createdAt: -1 }).limit(5);
      
      
    }

    // Summary
    
    
    if (user && counselor && user.counselorProfile && counselor.userAccount) {
      
      
      
    } else {
      
      if (!user) 
      if (!counselor) 
      if (!user.counselorProfile) 
      if (!counselor?.userAccount) 
    }

  } catch (error) {
    console.error('❌ Error checking counselor account:', error);
  } finally {
    await mongoose.connection.close();
    
    process.exit(0);
  }
};

// Run the check
checkCounselorAccount();
