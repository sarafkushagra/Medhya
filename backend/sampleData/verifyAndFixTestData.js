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

// Verify and fix test data
const verifyAndFixTestData = async () => {
  try {
    console.log('🔍 Checking test data...\n');

    // Check if counselor user exists
    const counselorUser = await User.findOne({ email: 'anjali.sharma@medhya.com' });
    
    if (!counselorUser) {
      console.log('❌ Test counselor user not found. Creating...');
      
      // Hash the password properly
      const hashedPassword = await bcrypt.hash('password123', 12);
      
      // Create the user
      const newUser = await User.create({
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
      
      console.log('✅ Test counselor user created');
    } else {
      console.log('✅ Test counselor user found');
      
      // Check if password is properly hashed
      if (counselorUser.password === 'password123') {
        console.log('⚠️  Password not hashed. Fixing...');
        const hashedPassword = await bcrypt.hash('password123', 12);
        counselorUser.password = hashedPassword;
        await counselorUser.save();
        console.log('✅ Password hashed and updated');
      } else {
        console.log('✅ Password is properly hashed');
      }
      
      // Check if user is verified
      if (!counselorUser.isVerified) {
        console.log('⚠️  User not verified. Fixing...');
        counselorUser.isVerified = true;
        await counselorUser.save();
        console.log('✅ User verification status updated');
      } else {
        console.log('✅ User is verified');
      }
    }

    // Check if counselor profile exists
    const counselorProfile = await Counselor.findOne({ email: 'anjali.sharma@medhya.com' });
    
    if (!counselorProfile) {
      console.log('❌ Test counselor profile not found. Creating...');
      
      const counselor = await Counselor.create({
        name: 'Dr. Anjali Sharma',
        email: 'anjali.sharma@medhya.com',
        phone: '+91 98765 43210',
        specialization: ['Cognitive Behavioral Therapy (CBT)', 'Stress Management', 'Anxiety Disorders'],
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
        bio: 'Experienced clinical psychologist dedicated to providing compassionate and effective therapy. Specializing in CBT and mindfulness-based approaches to help individuals navigate life\'s challenges.',
        profileImage: 'https://i.pravatar.cc/150?u=anjali',
        isActive: true,
        maxAppointmentsPerDay: 8,
        sessionDuration: 60,
        hourlyRate: 1500,
        emergencyAvailable: true,
        crisisIntervention: true
      });
      
      // Link counselor profile to user
      const user = await User.findOne({ email: 'anjali.sharma@medhya.com' });
      if (user) {
        user.counselorProfile = counselor._id;
        await user.save();
        console.log('✅ Counselor profile linked to user');
      }
      
      console.log('✅ Test counselor profile created');
    } else {
      console.log('✅ Test counselor profile found');
    }

    // Test password verification
    const testUser = await User.findOne({ email: 'anjali.sharma@medhya.com' });
    if (testUser) {
      const isPasswordValid = await bcrypt.compare('password123', testUser.password);
      console.log(`🔐 Password verification test: ${isPasswordValid ? '✅ PASS' : '❌ FAIL'}`);
      
      if (!isPasswordValid) {
        console.log('⚠️  Fixing password...');
        const hashedPassword = await bcrypt.hash('password123', 12);
        testUser.password = hashedPassword;
        await testUser.save();
        console.log('✅ Password fixed');
      }
    }

    console.log('\n🎉 Test data verification complete!');
    console.log('\n🔑 Login Credentials:');
    console.log('Email: anjali.sharma@medhya.com');
    console.log('Password: password123');
    console.log('Role: counselor');

  } catch (error) {
    console.error('❌ Error verifying test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the verification
verifyAndFixTestData();
