import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';

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

// Test User-Counselor connection
const testConnection = async () => {
  try {

    // Connect to database
    await connectDB();

    // Find the test counselor
    const testUser = await User.findOne({ email: 'anjali.sharma@medhya.com' });
    
    if (!testUser) {
      return;
    }

    // Test User -> Counselor connection
    const userWithCounselor = await User.findById(testUser._id).populate('counselorProfile');
    
    if (userWithCounselor.counselorProfile) {
    } else {
    }

    // Test Counselor -> User connection
    const counselor = await Counselor.findOne({ email: 'anjali.sharma@medhya.com' });
    
    if (counselor) {
      const counselorWithUser = await Counselor.findById(counselor._id).populate('userAccount');
      
      if (counselorWithUser.userAccount) {
      } else {
      }

      // Test counselor methods
      const isActiveAndVerified = await counselor.isActiveAndVerified();
      
      const userAccount = await counselor.getUserAccount();
      
    } else {
    }

    // Test User methods
    const counselorProfile = await testUser.getCounselorProfile();

  } catch (error) {
    console.error('❌ Error testing connection:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the test
testConnection();
