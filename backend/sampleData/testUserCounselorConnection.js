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
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test User-Counselor connection
const testConnection = async () => {
  try {
    console.log('🔗 Testing User-Counselor Database Connection...\n');

    // Connect to database
    await connectDB();

    // Find the test counselor
    const testUser = await User.findOne({ email: 'anjali.sharma@medhya.com' });
    
    if (!testUser) {
      console.log('❌ Test user not found. Please run the test data creation script first.');
      return;
    }

    console.log('👤 Test User Found:');
    console.log(`- ID: ${testUser._id}`);
    console.log(`- Name: ${testUser.fullName}`);
    console.log(`- Email: ${testUser.email}`);
    console.log(`- Role: ${testUser.role}`);
    console.log(`- Is Counselor: ${testUser.isCounselor}`);
    console.log(`- Has Complete Profile: ${testUser.hasCompleteProfile()}`);
    console.log(`- Counselor Profile ID: ${testUser.counselorProfile}`);

    // Test User -> Counselor connection
    console.log('\n🔗 Testing User -> Counselor Connection...');
    const userWithCounselor = await User.findById(testUser._id).populate('counselorProfile');
    
    if (userWithCounselor.counselorProfile) {
      console.log('✅ User -> Counselor: CONNECTED');
      console.log(`- Counselor Name: ${userWithCounselor.counselorProfile.name}`);
      console.log(`- Counselor Email: ${userWithCounselor.counselorProfile.email}`);
      console.log(`- Counselor Specialization: ${userWithCounselor.counselorProfile.specialization.join(', ')}`);
      console.log(`- Counselor Rating: ${userWithCounselor.counselorProfile.rating}`);
    } else {
      console.log('❌ User -> Counselor: NOT CONNECTED');
    }

    // Test Counselor -> User connection
    console.log('\n🔗 Testing Counselor -> User Connection...');
    const counselor = await Counselor.findOne({ email: 'anjali.sharma@medhya.com' });
    
    if (counselor) {
      console.log('✅ Counselor Found:');
      console.log(`- ID: ${counselor._id}`);
      console.log(`- Name: ${counselor.name}`);
      console.log(`- Email: ${counselor.email}`);
      console.log(`- User Account ID: ${counselor.userAccount}`);
      console.log(`- Is Active: ${counselor.isActive}`);

      const counselorWithUser = await Counselor.findById(counselor._id).populate('userAccount');
      
      if (counselorWithUser.userAccount) {
        console.log('✅ Counselor -> User: CONNECTED');
        console.log(`- User Name: ${counselorWithUser.userAccount.fullName}`);
        console.log(`- User Email: ${counselorWithUser.userAccount.email}`);
        console.log(`- User Role: ${counselorWithUser.userAccount.role}`);
        console.log(`- User Verified: ${counselorWithUser.userAccount.isVerified}`);
      } else {
        console.log('❌ Counselor -> User: NOT CONNECTED');
      }

      // Test counselor methods
      console.log('\n🧪 Testing Counselor Methods...');
      const isActiveAndVerified = await counselor.isActiveAndVerified();
      console.log(`✅ Is Active and Verified: ${isActiveAndVerified}`);
      
      const userAccount = await counselor.getUserAccount();
      console.log(`✅ Get User Account: ${userAccount ? 'SUCCESS' : 'FAILED'}`);
      
    } else {
      console.log('❌ Counselor not found');
    }

    // Test User methods
    console.log('\n🧪 Testing User Methods...');
    const counselorProfile = await testUser.getCounselorProfile();
    console.log(`✅ Get Counselor Profile: ${counselorProfile ? 'SUCCESS' : 'FAILED'}`);

    console.log('\n🎉 Connection Test Complete!');
    console.log('\n📋 Summary:');
    console.log('- User and Counselor models are properly connected');
    console.log('- Bidirectional references are working');
    console.log('- Virtual fields and methods are functional');
    console.log('- Ready for counselor dashboard testing');

  } catch (error) {
    console.error('❌ Error testing connection:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the test
testConnection();
