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
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create simple test data
const createSimpleTestData = async () => {
  try {

    // Connect to database
    await connectDB();

    // Clear existing test data first
    await User.deleteMany({ email: 'anjali.sharma@medhya.com' });
    await Counselor.deleteMany({ email: 'anjali.sharma@medhya.com' });

    // Hash password properly
    const hashedPassword = await bcrypt.hash('password123', 12);

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

    // Link counselor profile to user
    counselorUser.counselorProfile = counselor._id;
    await counselorUser.save();

    // Test password verification
    const testUser = await User.findOne({ email: 'anjali.sharma@medhya.com' }).select('+password');
    if (testUser && testUser.password) {
      const isPasswordValid = await bcrypt.compare('password123', testUser.password);
    } else {
    }

    // Test bidirectional connection
    
    // Test User -> Counselor connection
    const userWithCounselor = await User.findById(counselorUser._id).populate('counselorProfile');
    
    // Test Counselor -> User connection
    const counselorWithUser = await Counselor.findById(counselor._id).populate('userAccount');
    
    // Test virtual fields

  } catch (error) {
    console.error('❌ Error creating simple test data:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
createSimpleTestData();
