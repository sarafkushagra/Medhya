import mongoose from 'mongoose';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://ksaraf0004_db_user:Ajasz20j3uSFOeRC@cluster0.nr7dg5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function createDemoUsers() {
  try {
    await mongoose.connect(MONGO_URI);

    // Demo users data with different roles for full portal access
    const demoUsers = [
      {
        // Admin User - Full access to all admin features
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mindcare.com',
        password: 'Admin@123',
        passwordConfirm: 'Admin@123',
        phone: '1234567890',
        institutionId: 'ADMIN001',
        studentId: 'ADMIN001',
        course: 'Administration',
        year: '1',
        department: 'IT',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Blue',
        privacyConsent: true,
        dataProcessingConsent: true,
        emergencyContact: 'Emergency Contact',
        emergencyPhone: '1234567890',
        mentalHealthConsent: true,
        communicationConsent: true,
        role: 'admin',
        isVerified: true,
        isProfileComplete: true
      },
      {
        // Counselor User - Access to counselor dashboard and features
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'counselor@mindcare.com',
        password: 'Counselor@123',
        passwordConfirm: 'Counselor@123',
        phone: '2345678901',
        institutionId: 'COUNSELOR001',
        studentId: 'COUNSELOR001',
        course: 'Psychology',
        year: 'PhD',
        department: 'Counseling',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Green',
        privacyConsent: true,
        dataProcessingConsent: true,
        emergencyContact: 'Emergency Services',
        emergencyPhone: '2345678901',
        mentalHealthConsent: true,
        communicationConsent: true,
        role: 'counselor',
        isVerified: true,
        isProfileComplete: true
      },
      {
        // Student User - Access to student features
        firstName: 'Alex',
        lastName: 'Thompson',
        email: 'student@mindcare.com',
        password: 'Student@123',
        passwordConfirm: 'Student@123',
        phone: '3456789012',
        institutionId: 'iit-delhi',
        studentId: 'CS2024001',
        course: 'B.Tech - Computer Science',
        year: '3',
        department: 'Computer Science',
        securityQuestion: 'What is your favorite color?',
        securityAnswer: 'Blue',
        privacyConsent: true,
        dataProcessingConsent: true,
        emergencyContact: 'Parent Name',
        emergencyPhone: '3456789012',
        mentalHealthConsent: true,
        communicationConsent: true,
        role: 'student',
        isVerified: true,
        isProfileComplete: true
      }
    ];

    for (const userData of demoUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        continue;
      }

      // Create user
      const user = new User(userData);
      await user.save();

      // If counselor, create counselor profile
      if (userData.role === 'counselor') {
        const counselorProfile = new Counselor({
          name: userData.firstName + ' ' + userData.lastName,
          email: userData.email,
          phone: userData.phone,
          specialization: ['Anxiety', 'Depression', 'Stress Management', 'Academic Stress'],
          languages: ['English', 'Hindi'],
          appointmentType: 'both',
          experience: 8,
          education: {
            degree: 'PhD in Clinical Psychology',
            institution: 'IIT Delhi',
            year: 2015
          },
          license: {
            number: 'PSY001234',
            issuingAuthority: 'Delhi Medical Council',
            expiryDate: new Date('2025-12-31')
          },
          bio: 'Experienced clinical psychologist specializing in mental health support for students. I help students navigate academic stress, anxiety, depression, and personal challenges.',
          rating: 4.8,
          totalSessions: 150,
          isActive: true,
          userAccount: user._id
        });
        await counselorProfile.save();

        // Update user with counselor profile reference
        user.counselorProfile = counselorProfile._id;
        await user.save();
      }

    }

    

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating demo users:", err);
    process.exit(1);
  }
}

createDemoUsers();
