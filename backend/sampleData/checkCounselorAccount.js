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
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check counselor account
const checkCounselorAccount = async () => {
  try {
    console.log('🔍 Checking Counselor Account: headphonehoon56@gmail.com\n');

    // Connect to database
    await connectDB();

    const email = 'headphonehoon56@gmail.com';

    // Check if user exists
    console.log('👤 Checking User Account...');
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User account not found');
      console.log('💡 You may need to create the account first or check the email address');
      return;
    }

    console.log('✅ User account found:');
    console.log(`- ID: ${user._id}`);
    console.log(`- Name: ${user.fullName || 'Not set'}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);
    console.log(`- Email Verified: ${user.isEmailVerified}`);
    console.log(`- Is Verified: ${user.isVerified}`);
    console.log(`- Profile Complete: ${user.isProfileComplete}`);
    console.log(`- Counselor Profile ID: ${user.counselorProfile || 'Not linked'}`);

    // Check counselor profile
    console.log('\n👨‍⚕️ Checking Counselor Profile...');
    let counselor = null;
    
    if (user.counselorProfile) {
      counselor = await Counselor.findById(user.counselorProfile);
    } else {
      // Try to find by email
      counselor = await Counselor.findOne({ email });
    }

    if (!counselor) {
      console.log('❌ Counselor profile not found');
      console.log('💡 You may need to complete your counselor profile setup');
    } else {
      console.log('✅ Counselor profile found:');
      console.log(`- ID: ${counselor._id}`);
      console.log(`- Name: ${counselor.name}`);
      console.log(`- Email: ${counselor.email}`);
      console.log(`- Specialization: ${counselor.specialization?.join(', ') || 'Not set'}`);
      console.log(`- Languages: ${counselor.languages?.join(', ') || 'Not set'}`);
      console.log(`- Rating: ${counselor.rating || 0}`);
      console.log(`- Experience: ${counselor.experience || 0} years`);
      console.log(`- Is Active: ${counselor.isActive}`);
      console.log(`- User Account ID: ${counselor.userAccount || 'Not linked'}`);

      // Check if profiles are properly linked
      if (user.counselorProfile && counselor.userAccount) {
        console.log('\n🔗 Profile Linking Status:');
        console.log(`✅ User -> Counselor: ${user.counselorProfile.toString() === counselor._id.toString() ? 'LINKED' : 'MISMATCH'}`);
        console.log(`✅ Counselor -> User: ${counselor.userAccount.toString() === user._id.toString() ? 'LINKED' : 'MISMATCH'}`);
      } else {
        console.log('\n⚠️ Profile Linking Issues:');
        console.log(`- User has counselorProfile: ${!!user.counselorProfile}`);
        console.log(`- Counselor has userAccount: ${!!counselor.userAccount}`);
      }
    }

    // Check related data
    console.log('\n📊 Checking Related Data...');
    
    // Check appointments
    const appointments = await Appointment.find({ 
      counselor: counselor?._id || user._id 
    }).countDocuments();
    console.log(`- Appointments: ${appointments} found`);

    // Check messages
    const messages = await Message.find({ 
      counselor: counselor?._id || user._id 
    }).countDocuments();
    console.log(`- Messages: ${messages} found`);

    // Check payments
    const payments = await Payment.find({ 
      counselor: counselor?._id || user._id 
    }).countDocuments();
    console.log(`- Payments: ${payments} found`);

    // Test dashboard data fetching
    console.log('\n🧪 Testing Dashboard Data Fetching...');
    
    if (counselor) {
      // Test getting appointments
      const upcomingAppointments = await Appointment.find({
        counselor: counselor._id,
        status: { $in: ['confirmed', 'pending'] },
        date: { $gte: new Date() }
      }).populate('student', 'firstName lastName email').limit(5);
      
      console.log(`✅ Upcoming Appointments: ${upcomingAppointments.length} found`);
      
      // Test getting messages
      const recentMessages = await Message.find({
        counselor: counselor._id
      }).populate('student', 'firstName lastName email').sort({ createdAt: -1 }).limit(5);
      
      console.log(`✅ Recent Messages: ${recentMessages.length} found`);
      
      // Test getting payments
      const recentPayments = await Payment.find({
        counselor: counselor._id
      }).sort({ createdAt: -1 }).limit(5);
      
      console.log(`✅ Recent Payments: ${recentPayments.length} found`);
    }

    // Summary
    console.log('\n📋 Summary:');
    if (user && counselor && user.counselorProfile && counselor.userAccount) {
      console.log('✅ Account is properly set up and ready for dashboard');
      console.log('✅ User and Counselor profiles are linked');
      console.log('✅ Dashboard should be able to fetch data');
    } else {
      console.log('⚠️ Account setup incomplete:');
      if (!user) console.log('- User account missing');
      if (!counselor) console.log('- Counselor profile missing');
      if (!user.counselorProfile) console.log('- User not linked to counselor profile');
      if (!counselor?.userAccount) console.log('- Counselor not linked to user account');
    }

  } catch (error) {
    console.error('❌ Error checking counselor account:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the check
checkCounselorAccount();
