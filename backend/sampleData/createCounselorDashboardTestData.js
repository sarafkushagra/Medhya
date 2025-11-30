import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';
import Appointment from '../models/appointmentModel.js';
import Message from '../models/messageModel.js';
import Payment from '../models/paymentModel.js';
import SessionNote from '../models/sessionNoteModel.js';
import CounselorStats from '../models/counselorStatsModel.js';

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

// Create test counselor
const createTestCounselor = async () => {
  try {
    // First create a User account for the counselor
    const counselorUser = await User.create({
      firstName: 'Dr. Anjali',
      lastName: 'Sharma',
      email: 'anjali.sharma@medhya.com',
      password: 'password123',
      role: 'counselor',
      phone: '+91 98765 43210',
      profileImage: 'https://i.pravatar.cc/150?u=anjali',
      isEmailVerified: true
    });

    // Create counselor profile
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

    // Link the counselor profile to the user
    counselorUser.counselorProfile = counselor._id;
    await counselorUser.save();

    return { counselor, counselorUser };
  } catch (error) {
    console.error('❌ Error creating test counselor:', error);
    throw error;
  }
};

// Create test students
const createTestStudents = async () => {
  try {
    const students = [];
    const studentData = [
      {
        firstName: 'Rohan',
        lastName: 'Verma',
        email: 'rohan.verma@student.com',
        phone: '+91 98765 12345',
        profileImage: 'https://i.pravatar.cc/150?u=rohan'
      },
      {
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@student.com',
        phone: '+91 98765 23456',
        profileImage: 'https://i.pravatar.cc/150?u=priya'
      },
      {
        firstName: 'Amit',
        lastName: 'Singh',
        email: 'amit.singh@student.com',
        phone: '+91 98765 34567',
        profileImage: 'https://i.pravatar.cc/150?u=amit'
      },
      {
        firstName: 'Sneha',
        lastName: 'Gupta',
        email: 'sneha.gupta@student.com',
        phone: '+91 98765 45678',
        profileImage: 'https://i.pravatar.cc/150?u=sneha'
      },
      {
        firstName: 'Kavya',
        lastName: 'Reddy',
        email: 'kavya.reddy@student.com',
        phone: '+91 98765 56789',
        profileImage: 'https://i.pravatar.cc/150?u=kavya'
      }
    ];

    for (const studentInfo of studentData) {
      const student = await User.create({
        ...studentInfo,
        password: 'password123',
        role: 'student',
        isEmailVerified: true
      });
      students.push(student);
    }

    return students;
  } catch (error) {
    console.error('❌ Error creating test students:', error);
    throw error;
  }
};

// Create test appointments
const createTestAppointments = async (counselor, students) => {
  try {
    const appointments = [];
    const today = new Date();
    
    const appointmentData = [
      {
        student: students[0]._id,
        date: new Date(today.getTime() + 2 * 60 * 60 * 1000), // Today + 2 hours
        timeSlot: '11:00 AM',
        status: 'confirmed',
        sessionDuration: 60,
        sessionType: 'follow-up',
        notes: 'Regular follow-up session'
      },
      {
        student: students[1]._id,
        date: new Date(today.getTime() + 4 * 60 * 60 * 1000), // Today + 4 hours
        timeSlot: '02:00 PM',
        status: 'pending',
        sessionDuration: 60,
        sessionType: 'initial',
        notes: 'First session with new student'
      },
      {
        student: students[2]._id,
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
        timeSlot: '10:00 AM',
        status: 'confirmed',
        sessionDuration: 60,
        sessionType: 'follow-up',
        notes: 'Weekly check-in'
      },
      {
        student: students[3]._id,
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // Tomorrow + 2 hours
        timeSlot: '12:00 PM',
        status: 'confirmed',
        sessionDuration: 60,
        sessionType: 'follow-up',
        notes: 'Progress review session'
      },
      {
        student: students[0]._id,
        date: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        timeSlot: '03:00 PM',
        status: 'pending',
        sessionDuration: 60,
        sessionType: 'follow-up',
        notes: 'Scheduled follow-up'
      },
      {
        student: students[4]._id,
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000), // Yesterday (completed)
        timeSlot: '02:00 PM',
        status: 'completed',
        sessionDuration: 60,
        sessionType: 'follow-up',
        notes: 'Completed session'
      }
    ];

    for (const appointmentInfo of appointmentData) {
      const appointment = await Appointment.create({
        ...appointmentInfo,
        counselor: counselor._id
      });
      appointments.push(appointment);
    }

    return appointments;
  } catch (error) {
    console.error('❌ Error creating test appointments:', error);
    throw error;
  }
};

// Create test messages
const createTestMessages = async (counselor, students) => {
  try {
    const messages = [];
    
    const messageData = [
      {
        sender: students[1]._id,
        senderModel: 'User',
        recipient: counselor._id,
        recipientModel: 'Counselor',
        content: 'Hi Dr. Anjali, just wanted to confirm our session for today at 2 PM. Looking forward to it!',
        messageType: 'text',
        priority: 'normal',
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      },
      {
        sender: students[0]._id,
        senderModel: 'User',
        recipient: counselor._id,
        recipientModel: 'Counselor',
        content: 'Thank you for the resources you shared in our last session. They have been very helpful.',
        messageType: 'text',
        priority: 'normal',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        sender: students[3]._id,
        senderModel: 'User',
        recipient: counselor._id,
        recipientModel: 'Counselor',
        content: 'I have a quick question about our last discussion. Can we talk about it in our next session?',
        messageType: 'text',
        priority: 'normal',
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        sender: counselor._id,
        senderModel: 'Counselor',
        recipient: students[2]._id,
        recipientModel: 'User',
        content: 'Hi Amit, I wanted to check in on how you\'re doing with the exercises we discussed. Please let me know if you need any clarification.',
        messageType: 'text',
        priority: 'normal',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
      },
      {
        sender: students[4]._id,
        senderModel: 'User',
        recipient: counselor._id,
        recipientModel: 'Counselor',
        content: 'Dr. Sharma, I wanted to thank you for yesterday\'s session. I feel much better and more confident.',
        messageType: 'text',
        priority: 'normal',
        isRead: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      }
    ];

    for (const messageInfo of messageData) {
      const message = await Message.create(messageInfo);
      messages.push(message);
    }

    return messages;
  } catch (error) {
    console.error('❌ Error creating test messages:', error);
    throw error;
  }
};

// Create test payments
const createTestPayments = async (counselor, students) => {
  try {
    const payments = [];
    
    const paymentData = [
      {
        student: students[0]._id,
        amount: 1500,
        paymentStatus: 'completed',
        description: 'Session Payment - Follow-up',
        paymentMethod: 'online',
        transactionId: 'TXN001',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        student: students[2]._id,
        amount: 1500,
        paymentStatus: 'completed',
        description: 'Session Payment - Initial',
        paymentMethod: 'online',
        transactionId: 'TXN002',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        student: students[1]._id,
        amount: 1500,
        paymentStatus: 'pending',
        description: 'Session Payment - Follow-up',
        paymentMethod: 'online',
        transactionId: 'TXN003',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        student: students[3]._id,
        amount: 1500,
        paymentStatus: 'completed',
        description: 'Session Payment - Follow-up',
        paymentMethod: 'online',
        transactionId: 'TXN004',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        student: students[4]._id,
        amount: 1500,
        paymentStatus: 'completed',
        description: 'Session Payment - Follow-up',
        paymentMethod: 'online',
        transactionId: 'TXN005',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    ];

    for (const paymentInfo of paymentData) {
      const payment = await Payment.create({
        ...paymentInfo,
        counselor: counselor._id
      });
      payments.push(payment);
    }

    return payments;
  } catch (error) {
    console.error('❌ Error creating test payments:', error);
    throw error;
  }
};

// Create test session notes
const createTestSessionNotes = async (counselor, students, appointments) => {
  try {
    const sessionNotes = [];
    
    const sessionNoteData = [
      {
        student: students[0]._id,
        sessionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        sessionDuration: 60,
        sessionType: 'follow-up',
        presentingIssues: ['Anxiety', 'Academic stress'],
        sessionSummary: 'Student discussed recent academic pressures and anxiety symptoms. Implemented breathing exercises and cognitive restructuring techniques.',
        interventions: ['Deep breathing exercises', 'Cognitive restructuring', 'Progressive muscle relaxation'],
        homework: 'Practice breathing exercises daily for 10 minutes',
        progressNotes: 'Student shows good understanding of techniques and is motivated to practice.',
        riskAssessment: {
          suicidalIdeation: false,
          selfHarm: false,
          harmToOthers: false,
          riskLevel: 'low',
          notes: 'No immediate risk factors identified'
        },
        moodRating: {
          before: 4,
          after: 7
        },
        nextSessionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        recommendations: ['Continue current treatment plan', 'Monitor anxiety levels', 'Practice relaxation techniques'],
        tags: ['anxiety', 'academic-stress', 'progress']
      },
      {
        student: students[2]._id,
        sessionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        sessionDuration: 60,
        sessionType: 'initial',
        presentingIssues: ['Depression', 'Social isolation'],
        sessionSummary: 'Initial assessment completed. Student reports feeling isolated and experiencing low mood for the past month.',
        interventions: ['Active listening', 'Assessment of symptoms', 'Goal setting'],
        homework: 'Keep a mood diary for the next week',
        progressNotes: 'Student is open to treatment and shows good insight into their condition.',
        riskAssessment: {
          suicidalIdeation: false,
          selfHarm: false,
          harmToOthers: false,
          riskLevel: 'low',
          notes: 'No immediate risk, but monitoring recommended'
        },
        moodRating: {
          before: 3,
          after: 5
        },
        nextSessionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        recommendations: ['Begin CBT techniques', 'Social skills training', 'Regular monitoring'],
        tags: ['depression', 'initial-assessment', 'social-isolation']
      }
    ];

    for (const noteInfo of sessionNoteData) {
      const sessionNote = await SessionNote.create({
        ...noteInfo,
        counselor: counselor._id,
        appointment: appointments.find(apt => apt.student.toString() === noteInfo.student.toString())?._id
      });
      sessionNotes.push(sessionNote);
    }

    return sessionNotes;
  } catch (error) {
    console.error('❌ Error creating test session notes:', error);
    throw error;
  }
};

// Create counselor stats
const createCounselorStats = async (counselor) => {
  try {
    const stats = await CounselorStats.create({
      counselor: counselor._id,
      totalSessions: 45,
      completedSessions: 42,
      cancelledSessions: 3,
      totalHours: 42,
      averageSessionDuration: 60,
      totalStudents: 15,
      activeStudents: 8,
      averageRating: 4.8,
      totalRatings: 25,
      responseTime: {
        average: 15,
        total: 120
      },
      crisisInterventions: 2,
      emergencySessions: 1,
      monthlyStats: [
        {
          month: 'November',
          year: 2024,
          sessions: 18,
          hours: 18,
          newStudents: 3,
          averageRating: 4.7
        },
        {
          month: 'December',
          year: 2024,
          sessions: 22,
          hours: 22,
          newStudents: 2,
          averageRating: 4.9
        }
      ],
      weeklyStats: [
        {
          week: 'Week 1',
          year: 2024,
          sessions: 5,
          hours: 5,
          newStudents: 1
        },
        {
          week: 'Week 2',
          year: 2024,
          sessions: 6,
          hours: 6,
          newStudents: 0
        }
      ],
      specializations: [
        {
          name: 'Anxiety',
          sessions: 20,
          successRate: 85
        },
        {
          name: 'Depression',
          sessions: 15,
          successRate: 80
        },
        {
          name: 'Stress Management',
          sessions: 10,
          successRate: 90
        }
      ],
      availability: {
        totalSlots: 40,
        bookedSlots: 32,
        utilizationRate: 80
      }
    });

    return stats;
  } catch (error) {
    console.error('❌ Error creating counselor stats:', error);
    throw error;
  }
};

// Main function to create all test data
const createTestData = async () => {
  try {

    // Connect to database
    await connectDB();

    // Create test counselor
    const { counselor, counselorUser } = await createTestCounselor();

    // Create test students
    const students = await createTestStudents();

    // Create test appointments
    const appointments = await createTestAppointments(counselor, students);

    // Create test messages
    const messages = await createTestMessages(counselor, students);

    // Create test payments
    const payments = await createTestPayments(counselor, students);

    // Create test session notes
    const sessionNotes = await createTestSessionNotes(counselor, students, appointments);

    // Create counselor stats
    const stats = await createCounselorStats(counselor);

  } catch (error) {
    console.error('❌ Error creating test data:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the script
createTestData();
