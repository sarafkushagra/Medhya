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

// Create basic counselor account
const createBasicCounselorAccount = async () => {
  try {
    console.log('🚀 Creating Basic Counselor Account: headphonehoon56@gmail.com\n');

    // Connect to database
    await connectDB();

    const email = 'headphonehoon56@gmail.com';
    const password = 'password123';

    // Clear existing data if any
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({ email });
    await Counselor.deleteMany({ email });
    console.log('✅ Existing data cleared');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Password hashed');

    // Create user account
    const user = await User.create({
      firstName: 'Your',
      lastName: 'Name',
      email: email,
      password: hashedPassword,
      role: 'counselor',
      phone: '+91 98765 43210',
      profileImage: 'https://i.pravatar.cc/150?u=headphonehoon',
      isEmailVerified: true,
      isVerified: true
    });
    console.log('✅ User account created');

    // Create counselor profile
    const counselor = await Counselor.create({
      name: 'Your Name',
      email: email,
      phone: '+91 98765 43210',
      specialization: ['Anxiety', 'Stress Management', 'Depression'],
      languages: ['English', 'Hindi'],
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
      rating: 4.5,
      totalRatings: 10,
      experience: 5,
      education: {
        degree: 'M.A. in Psychology',
        institution: 'Your University',
        year: 2020
      },
      license: {
        number: 'PSY-67890',
        issuingAuthority: 'Rehabilitation Council of India',
        expiryDate: new Date('2025-12-31')
      },
      bio: 'Experienced counselor dedicated to helping students with mental health challenges.',
      profileImage: 'https://i.pravatar.cc/150?u=headphonehoon',
      isActive: true,
      maxAppointmentsPerDay: 6,
      sessionDuration: 60,
      hourlyRate: 1200,
      emergencyAvailable: true,
      crisisIntervention: true,
      userAccount: user._id
    });
    console.log('✅ Counselor profile created');

    // Link profiles
    user.counselorProfile = counselor._id;
    await user.save();
    console.log('✅ Profiles linked');

    // Test the setup
    console.log('\n🧪 Testing Account Setup...');
    
    // Test password verification
    const testUser = await User.findOne({ email }).select('+password');
    const isPasswordValid = await bcrypt.compare(password, testUser.password);
    console.log(`🔐 Password verification: ${isPasswordValid ? '✅ PASS' : '❌ FAIL'}`);

    // Test profile linking
    const userWithCounselor = await User.findById(user._id).populate('counselorProfile');
    const counselorWithUser = await Counselor.findById(counselor._id).populate('userAccount');
    
    console.log(`🔗 User -> Counselor: ${userWithCounselor.counselorProfile ? '✅ LINKED' : '❌ NOT LINKED'}`);
    console.log(`🔗 Counselor -> User: ${counselorWithUser.userAccount ? '✅ LINKED' : '❌ NOT LINKED'}`);

    console.log('\n🎉 Your Counselor Account Created Successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Role: counselor');

    console.log('\n📊 Account Summary:');
    console.log(`- User ID: ${user._id}`);
    console.log(`- Counselor ID: ${counselor._id}`);
    console.log(`- Name: ${counselor.name}`);
    console.log(`- Specialization: ${counselor.specialization.join(', ')}`);
    console.log(`- Rating: ${counselor.rating}`);
    console.log(`- Experience: ${counselor.experience} years`);
    console.log(`- Is Active: ${counselor.isActive}`);

    console.log('\n🚀 Ready to test the counselor dashboard!');
    console.log('\n💡 Next Steps:');
    console.log('1. Try logging in with the credentials above');
    console.log('2. Check if the dashboard loads your profile data');
    console.log('3. Verify that the User-Counselor connection is working');

  } catch (error) {
    console.error('❌ Error creating counselor account:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createBasicCounselorAccount();
