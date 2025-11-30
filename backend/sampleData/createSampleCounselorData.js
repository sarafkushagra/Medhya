import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Counselor from './models/counselorModel.js';
import User from './models/usermodel.js';
import Appointment from './models/appointmentModel.js';
import Message from './models/messageModel.js';
import Payment from './models/paymentModel.js';
import SessionNote from './models/sessionNoteModel.js';
import CounselorStats from './models/counselorStatsModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createSampleCounselorData = async () => {
  try {
    // Find the OAuth counselor user
    const oauthCounselor = await User.findOne({ 
      email: 'ksrajasthan24@gmail.com',
      role: 'counselor'
    });

    if (!oauthCounselor) {
      return;
    }

    // Get the counselor profile
    const counselor = await Counselor.findOne({ email: oauthCounselor.email });
    
    if (!counselor) {
      return;
    }

    // Clear existing data for this counselor
    await Appointment.deleteMany({ counselor: counselor._id });
    await Message.deleteMany({ 
      $or: [
        { sender: counselor._id, senderModel: 'Counselor' },
        { recipient: counselor._id, recipientModel: 'Counselor' }
      ]
    });
    await Payment.deleteMany({ counselor: counselor._id });
    await SessionNote.deleteMany({ counselor: counselor._id });
    await CounselorStats.deleteMany({ counselor: counselor._id });

    // Get some existing students
    const students = await User.find({ role: 'student' }).limit(5);

    if (students.length === 0) {
      return;
    }

    // Create sample appointments
    const appointments = [];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const appointmentDate = new Date(today);
      appointmentDate.setDate(today.getDate() + i);

      const student = students[i % students.length];
      const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
      const status = statuses[i % statuses.length];

      const appointment = await Appointment.create({
        student: student._id,
        counselor: counselor._id,
        institutionId: "INST001",
        appointmentType: i % 2 === 0 ? "oncampus" : "online",
        date: appointmentDate,
        timeSlot: `${9 + (i % 8)}:00`,
        urgencyLevel: i % 3 === 0 ? "routine" : i % 3 === 1 ? "urgent" : "crisis",
        reason: `Session for ${student.firstName} - ${i % 2 === 0 ? 'Anxiety management' : 'Academic stress'}`,
        status: status,
        confirmationEmailSent: status === 'confirmed',
        bookedAt: new Date()
      });

      appointments.push(appointment);
    }

    // Create sample messages
    const messages = [];
    for (let i = 0; i < 15; i++) {
      const student = students[i % students.length];
      const isFromStudent = i % 2 === 0;

      const message = await Message.create({
        sender: isFromStudent ? student._id : counselor._id,
        senderModel: isFromStudent ? 'User' : 'Counselor',
        recipient: isFromStudent ? counselor._id : student._id,
        recipientModel: isFromStudent ? 'Counselor' : 'User',
        content: isFromStudent
          ? `Hi Dr. ${counselor.name.split(' ')[1]}, I have a question about our session. Can we discuss ${i % 2 === 0 ? 'the homework you assigned' : 'my progress so far'}?`
          : `Hello ${student.firstName}, I hope you're doing well. Here's a reminder about our upcoming session and some resources that might help.`,
        messageType: 'text',
        isRead: i % 3 === 0,
        appointmentId: appointments[i % appointments.length]._id,
        priority: i % 4 === 0 ? 'high' : 'normal'
      });

      messages.push(message);
    }

    // Create sample payments
    const payments = [];
    for (let i = 0; i < 8; i++) {
      const student = students[i % students.length];
      const appointment = appointments[i % appointments.length];
      const statuses = ['completed', 'pending', 'failed'];
      const status = statuses[i % statuses.length];
      const amount = 500 + (i * 100);
      const ratePerHour = 1000;
      const commission = 15;
      const platformFee = (amount * commission) / 100;
      const counselorEarnings = amount - platformFee;

      const payment = await Payment.create({
        appointment: appointment._id,
        student: student._id,
        counselor: counselor._id,
        amount: amount,
        currency: 'INR',
        paymentMethod: 'online',
        paymentStatus: status,
        sessionType: appointment.appointmentType,
        sessionDuration: 60,
        ratePerHour: ratePerHour,
        commission: commission,
        counselorEarnings: counselorEarnings,
        platformFee: platformFee,
        paymentDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        transactionId: `TXN${Date.now()}${i}`,
        notes: `Session payment for ${student.firstName}`
      });

      payments.push(payment);
    }

    // Create sample session notes
    const sessionNotes = [];
    for (let i = 0; i < 5; i++) {
      const student = students[i % students.length];
      const appointment = appointments[i];

      const sessionNote = await SessionNote.create({
        appointment: appointment._id,
        counselor: counselor._id,
        student: student._id,
        sessionDate: appointment.date,
        sessionDuration: 60,
        sessionType: i % 2 === 0 ? 'initial' : 'follow-up',
        presentingIssues: ['Anxiety', 'Academic stress'],
        sessionSummary: `Had a productive session with ${student.firstName}. Discussed their anxiety triggers and developed coping strategies. Student showed good engagement and willingness to work on their issues.`,
        interventions: ['Cognitive Behavioral Therapy', 'Mindfulness exercises'],
        homework: 'Practice deep breathing exercises daily for 10 minutes',
        progressNotes: 'Student is making good progress. Anxiety levels have decreased from 8/10 to 6/10.',
        riskAssessment: {
          suicidalIdeation: false,
          selfHarm: false,
          harmToOthers: false,
          riskLevel: 'low',
          notes: 'No immediate risk concerns'
        },
        moodRating: {
          before: 4,
          after: 6
        },
        nextSessionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        recommendations: ['Continue with CBT exercises', 'Practice mindfulness daily'],
        tags: ['anxiety', 'academic-stress', 'progress']
      });

      sessionNotes.push(sessionNote);
    }

    // Create counselor stats
    const counselorStats = await CounselorStats.create({
      counselor: counselor._id,
      totalSessions: 45,
      completedSessions: 42,
      cancelledSessions: 3,
      totalHours: 42,
      averageSessionDuration: 60,
      totalStudents: students.length,
      activeStudents: students.length,
      averageRating: 4.8,
      totalRatings: 45,
      responseTime: {
        average: 15,
        total: 45
      },
      crisisInterventions: 2,
      emergencySessions: 1,
      monthlyStats: [
        {
          month: 'January',
          year: 2024,
          sessions: 12,
          hours: 12,
          newStudents: 3,
          averageRating: 4.7
        },
        {
          month: 'February',
          year: 2024,
          sessions: 15,
          hours: 15,
          newStudents: 2,
          averageRating: 4.8
        }
      ],
      weeklyStats: [
        {
          week: 'Week 1',
          year: 2024,
          sessions: 3,
          hours: 3,
          newStudents: 1
        },
        {
          week: 'Week 2',
          year: 2024,
          sessions: 4,
          hours: 4,
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
          name: 'Academic Stress',
          sessions: 10,
          successRate: 90
        }
      ],
      availability: {
        totalSlots: 40,
        bookedSlots: 32,
        utilizationRate: 80
      },
      lastUpdated: new Date()
    });

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run the script
connectDB().then(() => {
  createSampleCounselorData();
});
