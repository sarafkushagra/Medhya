"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Alert, AlertDescription } from "../ui/Alert";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";
import { Checkbox } from "../ui/Checkbox";

import { ImageWithFallback } from '../ui/Imi';
import {
  Heart,
  Shield,
  Brain,
  Eye,
  EyeOff,
  Building2,
  GraduationCap,
  UserCheck,
  Lock,
  Leaf,
  Users,
  Zap,
  Globe,
  CheckCircle,
  AlertTriangle,
  Mail,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth.js";
import { validateGoogleOAuthConfig, getOAuthErrorMessage } from "../utils/googleOAuthConfig.js";

import LP from "../assets/logo.png";
import Footer from "./Footer.jsx";

const Login = ({ onLogin, onShowUserSignup, onLoginError }) => {
  const navigate = useNavigate();
  const { login, googleAuth, loading, error } = useAuth();
  const [loginType, setLoginType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    institutionId: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [googleOAuthError, setGoogleOAuthError] = useState(null);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordChangeUser, setPasswordChangeUser] = useState(null);
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordChangeErrors, setPasswordChangeErrors] = useState({});
  const [changingPassword, setChangingPassword] = useState(false);


  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (loginType === "student" && !formData.institutionId) {
      newErrors.institutionId = "Please select your institution";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validate password change form
    const newErrors = {};
    if (!passwordChangeData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordChangeData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordChangeData.newPassword)) {
      newErrors.newPassword = "Password must contain uppercase, lowercase, and number";
    }

    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordChangeErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setChangingPassword(true);

    try {
      // For password change, we need to use the dummy password as current password
      const user = await login(passwordChangeUser.email, 'TempPass123!');

      // Reset password change state
      setShowPasswordChange(false);
      setPasswordChangeUser(null);
      setPasswordChangeData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

      // Proceed with login
      if (onLogin) {
        onLogin(user.role, user);
      }
    } catch (err) {
      setPasswordChangeErrors({ general: err.message });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (!validateGoogleOAuthConfig()) {
        const errorMessage = 'Google OAuth is not properly configured for this domain. Please contact support.';
        alert(errorMessage);
        return;
      }

      const google = window.google;
      if (!google) throw new Error('Google OAuth not available');

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'your-google-client-id') {
        throw new Error('Google Client ID not configured');
      }

      google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'email profile',
        callback: async (response) => {
          try {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { 'Authorization': `Bearer ${response.access_token}` }
            });
            const userInfo = await userInfoResponse.json();
            const user = await googleAuth({
              googleId: userInfo.id,
              email: userInfo.email,
              firstName: userInfo.given_name,
              lastName: userInfo.family_name,
              profilePicture: userInfo.picture,
              loginType: loginType
            });
            if (onLogin) {
              onLogin(user.role, user);
            }
          } catch (err) {
            if (err.message.includes('access blocked') || err.message.includes('invalid')) {
              const errorMessage = getOAuthErrorMessage(err);
              alert(errorMessage);
            } else if (err.message.includes('Google login is not allowed for')) {
              // Handle case where user tries to use Google OAuth for admin/counselor
              const role = err.message.includes('admin') ? 'admin' : 'counselor';
              const errorMessage = `Google login is not allowed for ${role} accounts. Please use the regular login form with your password.`;
              alert(errorMessage);
              return;
            } else if (err.message.includes('registered as admin') || err.message.includes('registered as counselor')) {
              // Handle case where user is already registered as admin/counselor
              const role = err.message.includes('admin') ? 'admin' : 'counselor';
              const errorMessage = `This email is registered as ${role}. For security reasons, ${role} accounts cannot use Google login. Please use the regular login form with your password.`;
              alert(errorMessage);
              // Optionally redirect to login or reset the form
              return;
            } else if (err.code === 'USER_NOT_FOUND' && loginType !== 'counselor') {
              if (onLoginError) {
                onLoginError(loginType, err.message, err.googleData);
              }
            } else {
              if (onLoginError) {
                onLoginError(loginType, err.message);
              }
            }
          }
        }
      }).requestAccessToken();
    } catch (err) {
      const errorMessage = getOAuthErrorMessage(err);
      alert(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (googleOAuthError) {
      setGoogleOAuthError(null);
    }
  };

  const demoCredentials = {
    student: { email: "student@mindcare.com", password: "Student@123" },
    counselor: { email: "counselor@mindcare.com", password: "Counselor@123" },
    admin: { email: "admin@mindcare.com", password: "Admin@123" },
  };

  const fillDemoCredentials = () => {
    const creds = demoCredentials[loginType];
    setFormData((prev) => ({
      ...prev,
      email: creds.email,
      password: creds.password,
      institutionId: loginType === "student" ? "iit-delhi" : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const user = await login(formData.email, formData.password, loginType);

      // Check if password change is required (for new counselors)
      if (user.requiresPasswordChange) {
        setPasswordChangeUser(user);
        setShowPasswordChange(true);
        return;
      }

      if (onLogin) {
        onLogin(user.role, user);
      }
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled by the useAuth hook
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-sky-50 to-teal-50 flex relative overflow-hidden font-['Poppins',sans-serif]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-gradient-to-tl from-sky-200/25 to-blue-200/25 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-mint-200/20 to-emerald-200/20 rounded-full blur-2xl"></div>
      </div>


      {/* Left Section (Logo and Info) */}
      <div className="w-1/2 relative flex flex-col items-center justify-center p-8 z-10">
        {/* Header Logo */}
        <div className=" top-8 left-8">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="relative">
              <div className="w-12 h-12  rounded-2xl flex items-center justify-center shadow-lg">
                <img src={LP} alt="Logo" className="w-12 h-12 object-contain rounded-md" />
              </div>

            </div>
            <div className="text-slate-800">
              <h2 className="font-bold text-xl tracking-wide">MEDHYA</h2>
              <p className="text-xs text-slate-600 opacity-80">Mental Wellness Platform</p>
            </div>
          </div>
        </div>

        {/* Main Wellness Image */}
        <div className="flex-1 flex flex-col items-center justify-center max-w-lg">
          <div className="relative group mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-500"></div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1635725277998-6c8ffdfb6b1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMG1lZGl0YXRpb24lMjBuYXR1cmUlMjB3ZWxsbmVzcyUyM
xlwZGl0YXRpb24lMjBuYXR1cmUlMjB3ZWxsbmVzc3xlbnwxfHx8fDE3NTc2NTczNzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Peaceful Wellness Environment"
              className="relative w-80 h-64 object-cover rounded-3xl shadow-2xl border-4 border-white/80 group-hover:scale-105 transition-all duration-500"
            />
          </div>

          {/* Welcome Content */}
          <div className="text-center space-y-6 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent leading-tight">
              Welcome to MEDHYA
            </h1>
            <p className="text-lg text-slate-700 max-w-md leading-relaxed">
              Your safe space for mental wellness, healing, and growth. Find peace, support, and tools for your wellbeing journey.
            </p>


          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm space-y-4">
            {loginType === "student" && (
              <div className="space-y-3">
                <Button
                  onClick={onShowUserSignup}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
                <Button
                  onClick={fillDemoCredentials}
                  variant="outline"
                  className="w-full h-12 border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
                <Button
                  onClick={() => navigate('/supplier-login')}
                  variant="outline"
                  className="w-full h-12 border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Supplier Login
                </Button>
              </div>
            )}

            {loginType === "counselor" && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="font-semibold text-slate-700">Want to explore first?</p>
                  <p className="text-sm text-slate-500">Try our platform with sample data</p>
                </div>
                <Button
                  onClick={fillDemoCredentials}
                  variant="outline"
                  className="w-full h-12 border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Try Demo
                </Button>
              </div>
            )}

            {loginType === "admin" && (
              <div className="space-y-3">
                <div className="text-center">
                  <p className="font-semibold text-slate-700">Want to explore ?</p>
                  <p className="text-sm text-slate-500">Contact us!!</p>
                </div>
                <Button

                  variant="outline"
                  className="w-full h-12 border-2 border-sky-300 text-sky-700 hover:bg-sky-50 hover:border-sky-400 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  medhya46@gmail.com
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex justify-center space-x-8 text-slate-600">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm">10K+ Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm">500+ Counselors</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-sky-600" />
              <span className="text-sm">100% Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (Login Card) */}
      <div className="w-1/2 flex items-center justify-center p-8 relative z-10">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border border-slate-200/50 shadow-2xl rounded-3xl">
          <CardHeader className="space-y-6 p-6">
            <Tabs
              value={loginType}
              onValueChange={(value) => {
                setLoginType(value);
                setGoogleOAuthError(null);
              }}
              className="w-full"
            >
              <TabsList className="grid w-full h-14 grid-cols-3 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/50">
                <TabsTrigger
                  value="student"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-emerald-700 data-[state=active]:border data-[state=active]:border-emerald-200 rounded-xl transition-all duration-300 hover:bg-white/70"
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="counselor"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-sky-700 data-[state=active]:border data-[state=active]:border-sky-200 rounded-xl transition-all duration-300 hover:bg-white/70"
                >
                  <Heart className="w-4 h-4" />
                  Counselor
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-slate-700 data-[state=active]:border data-[state=active]:border-slate-200 rounded-xl transition-all duration-300 hover:bg-white/70"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-3">
                {loginType === "student" ? (
                  <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl">
                    <GraduationCap className="w-6 h-6 text-emerald-600" />
                  </div>
                ) : loginType === "counselor" ? (
                  <div className="p-3 bg-gradient-to-br from-sky-100 to-blue-100 rounded-2xl">
                    <Heart className="w-6 h-6 text-sky-600" />
                  </div>
                ) : (
                  <div className="p-3 bg-gradient-to-br from-slate-100 to-gray-100 rounded-2xl">
                    <Shield className="w-6 h-6 text-slate-600" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-2xl text-slate-800 font-bold">
                    {loginType === "student" ? "Student Portal" :
                      loginType === "counselor" ? "Counselor Portal" : "Admin Portal"}
                  </CardTitle>
                </div>
              </div>
              <CardDescription className="text-slate-600">
                {loginType === "student"
                  ? "Access your personal wellness dashboard and resources"
                  : loginType === "counselor"
                    ? "Provide compassionate care and professional support"
                    : "Manage institutional wellness programs and insights"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 rounded-2xl shadow-sm hover:shadow-md"
              onClick={handleGoogleLogin}
              disabled={loading || loginType === "admin" || loginType === "counselor"}
              title={loginType === "admin" || loginType === "counselor" ? "Google login is not available for admin and counselor accounts. Please use password login." : ""}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>



            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-slate-500 text-sm">or continue with email</span>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 rounded-2xl">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-700 font-medium">{error}</AlertDescription>
              </Alert>
            )}

            {googleOAuthError && (
              <Alert className="border-sky-200 bg-sky-50 rounded-2xl">
                <Globe className="h-4 w-4 text-sky-600" />
                <AlertDescription className="text-sky-800 font-medium">
                  {googleOAuthError}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`h-12 rounded-2xl border-2 border-slate-200 focus:border-emerald-300 focus:ring-emerald-100 transition-all duration-300 ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""
                    }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`h-12 pr-12 rounded-2xl border-2 border-slate-200 focus:border-emerald-300 focus:ring-emerald-100 transition-all duration-300 ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-100" : ""
                      }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-slate-100 rounded-r-2xl"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-slate-500" />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => handleInputChange("rememberMe", checked)}
                    className="border-2 border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                  />
                  <Label htmlFor="remember" className="text-slate-700 text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="text-sky-600 hover:text-sky-700 p-0 h-auto text-sm">
                  Forgot password?
                </Button>
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5 mr-3" />
                    Sign In Securely
                    <Leaf className="w-4 h-4 ml-3" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    // </div>
  );
};

export default Login;
