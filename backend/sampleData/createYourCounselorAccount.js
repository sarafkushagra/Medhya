import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';
import Appointment from '../models/appointmentModel.js';
import Message from '../models/messageModel.js';
import Payment from '../models/paymentModel.js';
import SessionNote from '../models/sessionNoteModel.js';

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

// Create your counselor account with test data
const createYourCounselorAccount = async () => {
  try {
    console.log('🚀 Creating Your Counselor Account: headphonehoon56@gmail.com\n');

    // Connect to database
    await connectDB();

    const email = 'headphonehoon56@gmail.com';
    const password = 'password123'; // You can change this

    // Clear existing data if any
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({ email });
    await Counselor.deleteMany({ email });
    // Also clear test students
    await User.deleteMany({ email: { $in: ['rahul.student@example.com', 'priya.student@example.com'] } });
    console.log('✅ Existing data cleared');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('🔐 Password hashed');

    // Create user account
    const user = await User.create({
      firstName: 'Your',
      lastName: 'Name', // You can change this
      email: email,
      password: hashedPassword,
      role: 'counselor',
      phone: '+91 98765 43210', // You can change this
      profileImage: 'https://i.pravatar.cc/150?u=headphonehoon',
      isEmailVerified: true,
      isVerified: true
    });
    console.log('✅ User account created');

    // Create counselor profile
    const counselor = await Counselor.create({
      name: 'Your Name', // You can change this
      email: email,
      phone: '+91 98765 43210', // You can change this
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

    // Create some test students
    const students = await User.create([
      {
        firstName: 'Rahul',
        lastName: 'Sharma',
        email: 'rahul.student@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student',
        phone: '+91 98765 43211',
        isEmailVerified: true,
        isVerified: true
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.student@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'student',
        phone: '+91 98765 43212',
        isEmailVerified: true,
        isVerified: true
      }
    ]);
    console.log('✅ Test students created');

    // Create test appointments
    const appointments = await Appointment.create([
      {
        student: students[0]._id,
        counselor: counselor._id,
        institutionId: 'INST001',
        appointmentType: 'online',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        timeSlot: '10:00-11:00',
        urgencyLevel: 'routine',
        status: 'confirmed',
        reason: 'Anxiety management session'
      },
      {
        student: students[1]._id,
        counselor: counselor._id,
        institutionId: 'INST001',
        appointmentType: 'oncampus',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        timeSlot: '14:00-15:00',
        urgencyLevel: 'routine',
        status: 'pending',
        reason: 'Stress management consultation'
      }
    ]);
    console.log('✅ Test appointments created');

    // Create test messages
    const messages = await Message.create([
      {
        student: students[0]._id,
        counselor: counselor._id,
        message: 'Hello, I have some questions about my upcoming session.',
        sender: 'student',
        isRead: false
      },
      {
        student: students[1]._id,
        counselor: counselor._id,
        message: 'Thank you for the helpful session yesterday.',
        sender: 'student',
        isRead: true
      }
    ]);
    console.log('✅ Test messages created');

    // Create test payments
    const payments = await Payment.create([
      {
        student: students[0]._id,
        counselor: counselor._id,
        amount: 1200,
        status: 'completed',
        paymentMethod: 'online',
        description: 'Session fee for anxiety management',
        transactionId: 'TXN123456789'
      },
      {
        student: students[1]._id,
        counselor: counselor._id,
        amount: 1200,
        status: 'pending',
        paymentMethod: 'online',
        description: 'Session fee for stress management',
        transactionId: 'TXN123456790'
      }
    ]);
    console.log('✅ Test payments created');

    // Create test session notes
    const sessionNotes = await SessionNote.create([
      {
        student: students[0]._id,
        counselor: counselor._id,
        appointment: appointments[0]._id,
        notes: 'Student showed improvement in anxiety management techniques.',
        mood: 'positive',
        goals: 'Continue practicing breathing exercises',
        nextSteps: 'Schedule follow-up in 2 weeks'
      }
    ]);
    console.log('✅ Test session notes created');

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

    // Test dashboard data
    const upcomingAppointments = await Appointment.find({
      counselor: counselor._id,
      status: { $in: ['confirmed', 'pending'] }
    }).countDocuments();
    
    const unreadMessages = await Message.find({
      counselor: counselor._id,
      isRead: false
    }).countDocuments();
    
    const totalPayments = await Payment.find({
      counselor: counselor._id
    }).countDocuments();

    console.log(`📊 Dashboard Data: ${upcomingAppointments} appointments, ${unreadMessages} unread messages, ${totalPayments} payments`);

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
    console.log(`- Test Students: ${students.length}`);
    console.log(`- Test Appointments: ${appointments.length}`);
    console.log(`- Test Messages: ${messages.length}`);
    console.log(`- Test Payments: ${payments.length}`);

    console.log('\n🚀 Ready to test the counselor dashboard!');

  } catch (error) {
    console.error('❌ Error creating counselor account:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createYourCounselorAccount();
