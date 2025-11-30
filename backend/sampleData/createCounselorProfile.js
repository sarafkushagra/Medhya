import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/usermodel.js';
import Counselor from './models/counselorModel.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const createCounselorProfile = async () => {
  try {
    // Find the OAuth counselor user
    const oauthCounselor = await User.findOne({ 
      email: 'ksrajasthan24@gmail.com',
      role: 'counselor'
    });

    if (!oauthCounselor) {
      
      return;
    }

    

    // Check if counselor profile already exists
    const existingCounselor = await Counselor.findOne({ email: oauthCounselor.email });
    
    if (existingCounselor) {
      
      return;
    }

    // Create counselor profile
    const counselor = await Counselor.create({
      name: oauthCounselor.firstName + ' ' + oauthCounselor.lastName,
      email: oauthCounselor.email,
      phone: oauthCounselor.phone || '+91-9876543210',
      specialization: ["Anxiety", "Depression", "Stress Management", "Academic Stress"],
      languages: ["English", "Hindi"],
      appointmentType: "both",
      availability: {
        monday: {
          available: true,
          slots: [
            { startTime: "09:00", endTime: "10:00", isAvailable: true },
            { startTime: "10:00", endTime: "11:00", isAvailable: true },
            { startTime: "14:00", endTime: "15:00", isAvailable: true },
            { startTime: "15:00", endTime: "16:00", isAvailable: true }
          ]
        },
        tuesday: {
          available: true,
          slots: [
            { startTime: "09:00", endTime: "10:00", isAvailable: true },
            { startTime: "10:00", endTime: "11:00", isAvailable: true },
            { startTime: "14:00", endTime: "15:00", isAvailable: true },
            { startTime: "15:00", endTime: "16:00", isAvailable: true }
          ]
        },
        wednesday: {
          available: true,
          slots: [
            { startTime: "09:00", endTime: "10:00", isAvailable: true },
            { startTime: "10:00", endTime: "11:00", isAvailable: true },
            { startTime: "14:00", endTime: "15:00", isAvailable: true },
            { startTime: "15:00", endTime: "16:00", isAvailable: true }
          ]
        },
        thursday: {
          available: true,
          slots: [
            { startTime: "09:00", endTime: "10:00", isAvailable: true },
            { startTime: "10:00", endTime: "11:00", isAvailable: true },
            { startTime: "14:00", endTime: "15:00", isAvailable: true },
            { startTime: "15:00", endTime: "16:00", isAvailable: true }
          ]
        },
        friday: {
          available: true,
          slots: [
            { startTime: "09:00", endTime: "10:00", isAvailable: true },
            { startTime: "10:00", endTime: "11:00", isAvailable: true },
            { startTime: "14:00", endTime: "15:00", isAvailable: true },
            { startTime: "15:00", endTime: "16:00", isAvailable: true }
          ]
        },
        saturday: {
          available: false,
          slots: []
        },
        sunday: {
          available: false,
          slots: []
        }
      },
      rating: 4.8,
      totalRatings: 45,
      experience: 8,
      education: {
        degree: "Ph.D. in Clinical Psychology",
        institution: "Delhi University",
        year: 2015
      },
      license: {
        number: "PSY123456",
        issuingAuthority: "Rehabilitation Council of India",
        expiryDate: new Date("2025-12-31")
      },
      bio: "Dr. " + oauthCounselor.firstName + " " + oauthCounselor.lastName + " is a licensed clinical psychologist with over 8 years of experience in helping students manage anxiety, depression, and academic stress. She specializes in cognitive-behavioral therapy and mindfulness-based interventions.",
      profileImage: oauthCounselor.profileImage || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
      isActive: true,
      maxAppointmentsPerDay: 8,
      sessionDuration: 60,
      hourlyRate: 0,
      emergencyAvailable: true,
      crisisIntervention: true
    });

    

    // Update the OAuth user to link to the counselor profile
    await User.findByIdAndUpdate(oauthCounselor._id, {
      counselorProfile: counselor._id
    });

    

  } catch (error) {
    console.error('❌ Error creating counselor profile:', error);
  } finally {
    await mongoose.disconnect();
    
  }
};

// Run the script
connectDB().then(() => {
  createCounselorProfile();
});
