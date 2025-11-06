import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
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

// Create simple test data
const createSimpleTestData = async () => {
  try {
    console.log('🚀 Creating simple test data for counselor login...\n');

    // Connect to database
    await connectDB();

    // Clear existing test data first
    console.log('🧹 Clearing existing test data...');
    await User.deleteMany({ email: 'anjali.sharma@medhya.com' });
    await Counselor.deleteMany({ email: 'anjali.sharma@medhya.com' });
    console.log('✅ Existing test data cleared');

    // Hash password properly
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('🔐 Password hashed');

    // Create counselor user
    const counselorUser = await User.create({
      firstName: 'Dr. Anjali',
      lastName: 'Sharma',
      email: 'anjali.sharma@medhya.com',
      password: hashedPassword,
      role: 'counselor',
      phone: '+91 98765 43210',
      profileImage: 'https://i.pravatar.cc/150?u=anjali',
      isEmailVerified: true,
      isVerified: true
    });
    console.log('✅ Counselor user created');

    // Create counselor profile with user reference
    const counselor = await Counselor.create({
      name: 'Dr. Anjali Sharma',
      email: 'anjali.sharma@medhya.com',
      phone: '+91 98765 43210',
      specialization: ['Anxiety', 'Stress Management', 'Depression'],
      languages: ['English', 'Hindi', 'Marathi'],
      appointmentType: 'both',
      availability: {
        monday: { available: true, slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
        tuesday: { available: true, slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
        wednesday: { available: true, slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
        thursday: { available: true, slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
        friday: { available: true, slots: [{ startTime: '09:00', endTime: '17:00', isAvailable: true }] },
        saturday: { available: false, slots: [] },
        sunday: { available: false, slots: [] }
      },
      rating: 4.8,
      totalRatings: 25,
      experience: 12,
      education: {
        degree: 'Ph.D. in Clinical Psychology',
        institution: 'University of Delhi',
        year: 2012
      },
      license: {
        number: 'PSY-12345',
        issuingAuthority: 'Rehabilitation Council of India',
        expiryDate: new Date('2025-12-31')
      },
      bio: 'Experienced clinical psychologist dedicated to providing compassionate and effective therapy.',
      profileImage: 'https://i.pravatar.cc/150?u=anjali',
      isActive: true,
      maxAppointmentsPerDay: 8,
      sessionDuration: 60,
      hourlyRate: 1500,
      emergencyAvailable: true,
      crisisIntervention: true,
      userAccount: counselorUser._id  // Link to user account
    });
    console.log('✅ Counselor profile created with user reference');

    // Link counselor profile to user
    counselorUser.counselorProfile = counselor._id;
    await counselorUser.save();
    console.log('✅ Counselor profile linked to user');

    // Test password verification
    const testUser = await User.findOne({ email: 'anjali.sharma@medhya.com' }).select('+password');
    if (testUser && testUser.password) {
      const isPasswordValid = await bcrypt.compare('password123', testUser.password);
      console.log(`🔐 Password verification test: ${isPasswordValid ? '✅ PASS' : '❌ FAIL'}`);
    } else {
      console.log('❌ Password verification test: FAILED - No password found');
    }

    // Test bidirectional connection
    console.log('\n🔗 Testing User-Counselor connection...');
    
    // Test User -> Counselor connection
    const userWithCounselor = await User.findById(counselorUser._id).populate('counselorProfile');
    console.log(`✅ User -> Counselor: ${userWithCounselor.counselorProfile ? 'CONNECTED' : 'NOT CONNECTED'}`);
    
    // Test Counselor -> User connection
    const counselorWithUser = await Counselor.findById(counselor._id).populate('userAccount');
    console.log(`✅ Counselor -> User: ${counselorWithUser.userAccount ? 'CONNECTED' : 'NOT CONNECTED'}`);
    
    // Test virtual fields
    console.log(`✅ User fullName: ${userWithCounselor.fullName}`);
    console.log(`✅ User isCounselor: ${userWithCounselor.isCounselor}`);
    console.log(`✅ User hasCompleteProfile: ${userWithCounselor.hasCompleteProfile()}`);

    console.log('\n🎉 Simple test data created successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('Email: anjali.sharma@medhya.com');
    console.log('Password: password123');
    console.log('Role: counselor');

    console.log('\n📊 User Details:');
    console.log(`- ID: ${counselorUser._id}`);
    console.log(`- Name: ${counselorUser.firstName} ${counselorUser.lastName}`);
    console.log(`- Email: ${counselorUser.email}`);
    console.log(`- Role: ${counselorUser.role}`);
    console.log(`- Email Verified: ${counselorUser.isEmailVerified}`);
    console.log(`- Is Verified: ${counselorUser.isVerified}`);
    console.log(`- Counselor Profile ID: ${counselorUser.counselorProfile}`);

    console.log('\n📊 Counselor Details:');
    console.log(`- ID: ${counselor._id}`);
    console.log(`- Name: ${counselor.name}`);
    console.log(`- Email: ${counselor.email}`);
    console.log(`- User Account ID: ${counselor.userAccount}`);
    console.log(`- Is Active: ${counselor.isActive}`);

  } catch (error) {
    console.error('❌ Error creating simple test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createSimpleTestData();
