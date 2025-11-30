// src/App.jsx
import React, { useState, createContext, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';

// Import Intro Screen
// import IntroScreen from './Components/IntroScreen.jsx';

// Import Layouts & Pages
import LandingPage from './Components/LandingPage.jsx';
import Login from './Components/Login.jsx';
import UserFinalData from './Components/UserFinalDetails.jsx';
import UserInitialData from './Components/UserInitialDetails.jsx';
import AppLayout from './Components/AppLayout.jsx';
import StudentDashboard from './Components/StudentDashboard.jsx';
import NeuroDashboard from './Components/NeuroDashboard.jsx';
import AdminDashboard from './Components/AdminDashboard.jsx';
import AIChat from './Components/AIChat.jsx';
import Voice from './Components/Voice.jsx';
import AppointmentBooking from './Components/AppointmentBooking.jsx';
// import ResourceHub from './Components/ResourceHub.jsx';
import PeerSupport from './Components/PeerSupport.jsx';
import CrisisManagement from './Components/CrisisManagement.jsx';
import InnovationShowcase from './Components/InnovationShowcase.jsx';
import ErrorBoundary from './Components/ErrorBoundary.jsx';
import UserProfile from './Components/UserProfile.jsx';

import CounselorDashboard from './Components/CounselorDashboard.jsx';
import Games from './Components/Games.jsx';
import Report from './Components/Report.jsx';
import { SupplierLoginPage } from './Components/SupplierLoginPage.jsx';
import { SupplierDashboard } from './Components/SupplierDashboard.jsx';

//

import { MedicalReports } from './Components/MedicalReports.jsx';
import { MedicineDelivery } from './Components/MedicineDelivery.jsx';

import RoomPage from './Components/RoomPage.jsx';
import UserCounselorChat from './Components/UserCounselorChat.jsx';
import { useSocket } from './context/SocketProvider.jsx';
import { ProfileGeneral } from './Components/ProfilePage.jsx';
import { Box } from './Components/CheckPoint.jsx';
import Doctors from './Components/Doctors.jsx';

// Dummy Institutions component for routing
const Institutions = () => <div className="p-6 bg-white rounded-lg shadow">Institutions Management Content</div>;

// Protected Route Component
const ProtectedRoute = ({ children, userRole, requiredRole = null, isLoading = false }) => {
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (userRole === 'guest') {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />; // or a dedicated "unauthorized" page
  }
  return children;
};

// Profile Protected Route Component for restricted features
const ProfileProtectedRoute = ({ children, user, isLoading = false }) => {
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  // Check if user exists (better than checking userRole which might have timing issues)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // REMOVED: Profile completion check - all users can now access all features
  // All users have access to all features regardless of profile completion status

  return children;
};

// User Context
export const UserContext = createContext();

export default function App() {
  const { user, loading, logout: authLogout } = useAuth();
  const [userRole, setUserRole] = useState('guest');
  const [userData, setUserData] = useState(null);
  const [refreshMoodData, setRefreshMoodData] = useState(0);
  // const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const systemStats = {
    totalInstitutions: 127,
    activeUsers: "3000+",
  };

  const socket = useSocket();

  useEffect(() => {
    if (socket && user?._id) {
      socket.emit("student-online", user._id);

      // Optional: clean up on unmount
      return () => {
        socket.emit("student-offline", user._id);
      };
    }
  }, [socket, user]);


  // Function to refresh mood data in navbar
  const handleRefreshMoodData = () => {
    setRefreshMoodData(prev => prev + 1);
  };

  // Update userRole when user changes
  useEffect(() => {
    if (user) {
      setUserRole(user.role || 'student');
    } else {
      setUserRole('guest');
    }
  }, [user]);

  // Always show intro on every page load/refresh
  // Remove localStorage check to show video every time

  const handleLogin = (role) => {
    setUserRole(role);

    
    // Handle different user types
    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'counselor') {
      // Counselor login flow - always redirect to counselor dashboard
      navigate('/counsellordash');
    } else if (role === 'student') {
      // Student login flow - ALWAYS redirect to contact-choice first
      navigate('/dashboard');
    }

    // Refresh mood data after login for students
    if (role === 'student') {
      setTimeout(() => {
        handleRefreshMoodData();
      }, 1000); // Small delay to ensure user state is updated
    }
  };

  const handleLoginError = (role, error, googleData = null) => {
   
    // If user not found in database, redirect to signup flow
    if (error && (error.includes('not found') || error.includes('User not found') || error.includes('Invalid credentials'))) {
      if (role === 'student') {
        // Redirect to user-signup first, then signup, then contact-choice
        navigate('/user-signup', {
          state: {
            isNewUser: true,
            fromLogin: true,
            loginType: role,
            googleData: googleData // Pass Google data if available
          }
        });
      } else {
        // For admin, redirect to their respective signup
        navigate('/signup', {
          state: {
            isNewUser: true,
            fromLogin: true,
            loginType: role,
            googleData: googleData // Pass Google data if available
          }
        });
      }
    }
  };

  const handleLogout = async () => {
    await authLogout();
    setUserRole('guest');
    setUserData(null);
    navigate('/');
  };

  // Show intro screen first (every time on refresh)
  // if (showIntro) {
  //   return <IntroScreen onFinish={() => {
  //     setShowIntro(false);
  //   }} />;
  // }

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userRole, user, systemStats }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onLogin={() => navigate('/login')} systemStats={systemStats} />} />
          <Route path="/check" element={<ProfileGeneral />} />
          <Route path="/box" element={<Box />} />
        <Route path="/supplier-login" element={<SupplierLoginPage />} />
        <Route path="/supplier-dashboard" element={<SupplierDashboard />} />
        <Route path="/login" element={
          userRole !== 'guest' ?
            <Navigate to={userRole === 'admin' ? '/admin' : userRole === 'counselor' ? '/counsellordash' : '/dashboard'} replace /> :
            <Login
              onLogin={handleLogin}
              onLoginError={handleLoginError}
              onShowSignup={() => navigate('/signup')}
              onShowUserSignup={() => navigate('/user-signup')}
            />
        } />
        <Route path="/user-signup" element={<UserInitialData onNext={(data) => { setUserData(data); navigate('/signup'); }} onShowLogin={() => navigate('/login')} />} />
        <Route path="/signup" element={
          <UserFinalData
            onLogin={handleLogin}
            onShowLogin={() => navigate('/login')}
            userData={userData}
            onBackToUserSignup={() => navigate('/user-signup')}
          />
        } />


        <Route path="/counsellordash" element={
          <ProtectedRoute userRole={userRole} requiredRole="counselor" isLoading={loading}>
            <CounselorDashboard />
          </ProtectedRoute>
        } />

        <Route path="/room/:roomId" element={
          <ProtectedRoute userRole={userRole} isLoading={loading}>
            <RoomPage />
          </ProtectedRoute>
        } />

        <Route path="/chat/:counselorId" element={
          <ProtectedRoute userRole={userRole} isLoading={loading}>
            <UserCounselorChat />
          </ProtectedRoute>
        } />


        {/* --- PROTECTED APPLICATION ROUTES using AppLayout --- */}
        <Route
          element={
            <ProtectedRoute userRole={userRole} isLoading={loading}>
              <AppLayout userRole={userRole} user={user} onLogout={handleLogout} systemStats={systemStats} onRefreshMoodData={refreshMoodData} />
            </ProtectedRoute>
          }
        >
          {/* Student Routes */}
          <Route path="/dashboard" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/neurodashboard" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><NeuroDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><UserProfile /></ProtectedRoute>} />
          <Route path="/chat" element={<ProfileProtectedRoute user={user} isLoading={loading}><AIChat /></ProfileProtectedRoute>} />
          <Route path="/ai" element={<ProfileProtectedRoute user={user} isLoading={loading}><Voice /></ProfileProtectedRoute>} />
          <Route path="/appointments" element={<ProfileProtectedRoute user={user} isLoading={loading}><AppointmentBooking /></ProfileProtectedRoute>} />
          {/* <Route path="/resources" element={<ProtectedRoute userRole={userRole} requiredRole="student" isLoading={loading}><ResourceHub /></ProtectedRoute>} /> */}
          <Route path="/community" element={<ProfileProtectedRoute user={user} isLoading={loading}><PeerSupport /></ProfileProtectedRoute>} />
          <Route path="/games" element={<ProfileProtectedRoute user={user} isLoading={loading}><Games /></ProfileProtectedRoute>} />
          <Route path="/cognitive-report" element={<ProfileProtectedRoute user={user} isLoading={loading}><Report /></ProfileProtectedRoute>} />
          <Route path="/reports" element={<ProfileProtectedRoute user={user} isLoading={loading}><MedicalReports /></ProfileProtectedRoute>} />
          <Route path="/delivery" element={<ProfileProtectedRoute user={user} isLoading={loading}><MedicineDelivery /></ProfileProtectedRoute>} />
          <Route path="/doctor" element={<ProfileProtectedRoute user={user} isLoading={loading}><Doctors /></ProfileProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/crisis" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><ErrorBoundary><CrisisManagement /></ErrorBoundary></ProtectedRoute>} />
          <Route path="/innovation" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><InnovationShowcase /></ProtectedRoute>} />
          <Route path="/institutions" element={<ProtectedRoute userRole={userRole} requiredRole="admin" isLoading={loading}><Institutions /></ProtectedRoute>} />
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContext.Provider>
  );
}
