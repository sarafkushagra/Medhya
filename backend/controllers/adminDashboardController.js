

import User from '../models/usermodel.js';
import Appointment from '../models/appointmentModel.js';
import Chat from '../models/aichatModel.js';
import CommunityPost from '../models/communityModel.js';
import CrisisAlert from '../models/crisisAlertModel.js';
import UserDetails from '../models/userDetailsModel.js';
import Counselor from '../models/counselorModel.js';
import bcrypt from 'bcryptjs';

// GET /api/admin/dashboard-stats
export const getAdminDashboardStats = async (req, res) => {
  try {
    const [totalUsers, chatSessions, appointments, forumPosts, criticalAlerts] = await Promise.all([
      User.countDocuments(),
      Chat.countDocuments(),
      Appointment.countDocuments(),
      CommunityPost.countDocuments(),
      CrisisAlert.countDocuments({ status: 'critical' })
    ]);
    console.log('[ADMIN DASHBOARD STATS]', {
      totalUsers,
      chatSessions,
      appointments,
      forumPosts,
      criticalAlerts
    });
    res.json({
      totalUsers,
      chatSessions,
      appointments,
      forumPosts,
      criticalAlerts
    });
  } catch (error) {
    console.error('[ADMIN DASHBOARD ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select('firstName lastName email role isProfileComplete createdAt phone dateOfBirth gender address city state country')
      .sort({ createdAt: -1 });

    // Fetch user details separately and merge with users
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const userDetails = await UserDetails.findOne({ user: user._id })
          .select('username institutionId studentId course year department interests preferredContactMethod timezone language profileCompletedAt securityQuestion emergencyContact emergencyPhone academicYear major university graduationYear gpa mentalHealthHistory currentMedications allergies supportNeeded');

        return {
          ...user.toObject(),
          userDetails: userDetails || null
        };
      })
    );

    console.log('[ADMIN GET USERS]', `Found ${usersWithDetails.length} users`);
    res.json(usersWithDetails);
  } catch (error) {
    console.error('[ADMIN GET USERS ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// GET /api/admin/counselors
export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await User.find({ role: 'counselor' })
      .select('firstName lastName email role isProfileComplete createdAt phone dateOfBirth gender specialization experience qualifications licenseNumber')
      .populate('counselorProfile', 'bio specializations experienceYears education certifications languages availability')
      .sort({ createdAt: -1 });

    console.log('[ADMIN GET COUNSELORS]', `Found ${counselors.length} counselors`);
    res.json(counselors);
  } catch (error) {
    console.error('[ADMIN GET COUNSELORS ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/admin/verify-password
export const verifyAdminPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Get the current admin user from the request (set by auth middleware)
    const adminUser = await User.findById(req.user._id).select('+password');

    if (!adminUser) {
      return res.status(404).json({ error: 'Admin user not found' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    console.log('[ADMIN PASSWORD VERIFICATION]', `Admin ${adminUser.email} verified successfully`);
    res.json({ success: true, message: 'Password verified successfully' });

  } catch (error) {
    console.error('[ADMIN PASSWORD VERIFICATION ERROR]', error);
    res.status(500).json({ error: 'Failed to verify password' });
  }
};

// POST /api/admin/create-counselor
export const createCounselor = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, specialization, experience, qualifications, licenseNumber, bio } = req.body;

    // Check if counselor already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    // Generate a dummy password
    const dummyPassword = 'TempPass123!';
    const hashedPassword = await bcrypt.hash(dummyPassword, 12);

    // Create counselor user
    const counselorUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: 'counselor',
      phone,
      isEmailVerified: false,
      isVerified: true,
      isProfileComplete: true,
      requiresPasswordChange: true
    });

    // Create counselor profile with proper schema fields
    const counselorProfile = await Counselor.create({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      specialization: specialization ? [specialization] : ['General'],
      languages: ['English'],
      appointmentType: 'both',
      experience: experience ? parseInt(experience) : 1,
      education: {
        degree: qualifications || 'Counseling Degree',
        institution: 'University',
        year: new Date().getFullYear()
      },
      license: {
        number: licenseNumber || 'TEMP-' + Date.now(),
        issuingAuthority: 'State Counseling Board',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      },
      bio: bio || 'Professional counselor dedicated to student mental health and wellness.',
      isActive: true,
      userAccount: counselorUser._id
    });

    // Update user's counselorProfile reference
    counselorUser.counselorProfile = counselorProfile._id;
    await counselorUser.save();

    console.log('[ADMIN CREATE COUNSELOR]', `Created counselor: ${email} with ID: ${counselorUser._id}`);

    res.json({
      success: true,
      message: 'Counselor created successfully',
      counselor: {
        id: counselorUser._id,
        firstName,
        lastName,
        email,
        role: 'counselor',
        phone,
        specialization,
        experience,
        qualifications,
        licenseNumber,
        bio
      }
    });

  } catch (error) {
    console.error('[ADMIN CREATE COUNSELOR ERROR]', error);
    res.status(500).json({ error: error.message });
  }
};