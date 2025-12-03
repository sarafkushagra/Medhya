import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { apiCall, userDetailsAPI } from '../services/api.js';
import { useJournal } from '../hooks/useJournal.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Label } from '../ui/Label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Progress } from '../ui/Progress.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs.jsx';
import AppointmentBooking from './AppointmentBooking.jsx';
import { Avatar, AvatarFallback } from '../ui/Avatar.jsx';
import DailyJournal from './DailyJournal.jsx';
import {
  AlertTriangle,
  CheckCircle,
  User,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  MapPin,
  BookOpen,
  Users,
  Shield,
  Lock,
  Heart,
  ArrowLeft,
  RefreshCw,
  Edit3,
  Save,
  EyeOff,
  Eye,
  Edit,
  Trash2,
  X
} from 'lucide-react';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { entries, getJournalEntries } = useJournal();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});

  // Password management state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    newPasswordConfirm: '',
    currentPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    newPasswordConfirm: false,
    currentPassword: false
  });

  const [lastFetchTime, setLastFetchTime] = useState(null);
  const [_isInitialLoad, setIsInitialLoad] = useState(true);

  const checkPasswordStatus = useCallback(async () => {
    try {
      const response = await apiCall('/users/password-status', {
        method: 'GET'
      });
      setHasPassword(response.data.hasPassword);
    } catch (err) {
      console.error('Failed to check password status:', err);
      // Default to false if we can't check
      setHasPassword(false);
    }
  }, []);

  const fetchUserDetails = useCallback(async (forceRefresh = false) => {
    if (!user?._id) return;

    // Prevent multiple simultaneous requests
    if (isLoading && !forceRefresh) return;

    // Cache check - don't refetch if data is fresh (less than 30 seconds old) unless forced
    const now = Date.now();
    if (!forceRefresh && lastFetchTime && (now - lastFetchTime) < 30000 && userDetails) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const timestamp = Date.now(); // Cache buster
      const response = await apiCall(`/user-details/${user._id}?t=${timestamp}`, {
        method: 'GET'
      });

      if (response.data && response.data.userDetails) {
        setUserDetails(response.data.userDetails);
        setEditedDetails(response.data.userDetails);
        setLastFetchTime(Date.now());
        setIsInitialLoad(false);
      } else {
        setUserDetails(null);
        setEditedDetails({});
        setIsInitialLoad(false);
      }
    } catch (err) {
      if (err.message.includes('404') || err.message.includes('not found')) {
        setError('No profile details found. Please complete your profile first.');
        setUserDetails(null);
        setEditedDetails({});
        setIsInitialLoad(false);
      } else {
        setError('Failed to load profile details. Please try again.');
        // Retry after 2 seconds for network errors
        if (!err.message.includes('404')) {
          setTimeout(() => fetchUserDetails(), 2000);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch user details on component mount or when user changes
  useEffect(() => {
    if (user?._id) {
      // If profile is not complete, don't fetch details - show incomplete state immediately
      if (user.isProfileComplete === false) {
        setUserDetails(null);
        setEditedDetails({});
        setIsInitialLoad(false);
        setIsLoading(false);
        return;
      }
      fetchUserDetails();
      checkPasswordStatus();
    }
  }, [user?._id, user?.isProfileComplete, fetchUserDetails, checkPasswordStatus]); // fetchUserDetails is memoized, checkPasswordStatus is memoized

  // Load journal entries on component mount
  useEffect(() => {
    if (user?._id) {
      getJournalEntries({ page: 1, limit: 50 }); // Load more entries for the profile view
    }
  }, [user?._id, getJournalEntries]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedDetails(userDetails);
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetails(userDetails);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field, value) => {
    setEditedDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Update user details
      const response = await apiCall(`/user-details/${user._id}`, {
        method: 'PUT',
        body: JSON.stringify(editedDetails)
      });

      // Update local state with response data
      if (response.data && response.data.userDetails) {
        setUserDetails(response.data.userDetails);
        setEditedDetails(response.data.userDetails);
      } else {
        setUserDetails(editedDetails);
      }

      setIsEditing(false);
      setSuccess('Profile updated successfully!');

      // Update user context with data from backend response
      if (response.data && response.data.user) {
        updateUser(response.data.user);
      }

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkProfileComplete = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await userDetailsAPI.markProfileComplete(user._id);

      // Update user context with the response
      if (response.data && response.data.user) {
        updateUser(response.data.user);
      }

      setSuccess('Profile marked as complete successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to mark profile as complete');
    } finally {
      setIsLoading(false);
    }
  };

  // Password management functions
  const handleSetPassword = async () => {
    if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSettingPassword(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiCall('/users/set-password', {
        method: 'PATCH',
        body: JSON.stringify({
          newPassword: passwordData.newPassword,
          newPasswordConfirm: passwordData.newPasswordConfirm
        })
      });

      setSuccess('Password set successfully! You can now login with email and password.');
      setPasswordData({ newPassword: '', newPasswordConfirm: '', currentPassword: '' });
      setShowPasswordSection(false);
      // Update password status from response
      if (response.data && response.data.hasPassword !== undefined) {
        setHasPassword(response.data.hasPassword);
      } else {
        setHasPassword(true);
      }

      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to set password');
    } finally {
      setIsSettingPassword(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.newPasswordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      await apiCall('/users/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          newPasswordConfirm: passwordData.newPasswordConfirm
        })
      });

      setSuccess('Password changed successfully!');
      setPasswordData({ newPassword: '', newPasswordConfirm: '', currentPassword: '' });
      setShowPasswordSection(false);
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const resetPasswordForm = () => {
    setPasswordData({ newPassword: '', newPasswordConfirm: '', currentPassword: '' });
    setShowPasswords({ newPassword: false, newPasswordConfirm: false, currentPassword: false });
    setError('');
    setSuccess('');
  };

  const calculateProfileCompletion = useCallback(() => {
    if (!userDetails) return 0;

    const requiredFields = [
      'firstName', 'lastName', 'username', 'phone', 'dateOfBirth', 'gender',
      'institutionId', 'studentId', 'course', 'year',
      'securityQuestion', 'securityAnswer',
      'privacyConsent', 'dataProcessingConsent', 'mentalHealthConsent',
      'emergencyContact', 'emergencyPhone'
    ];

    const completedFields = requiredFields.filter(field =>
      userDetails[field] &&
      (typeof userDetails[field] === 'boolean' ? userDetails[field] : userDetails[field].toString().trim() !== '')
    );

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [userDetails]);

  const profileCompletion = useMemo(() => calculateProfileCompletion(), [calculateProfileCompletion]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please log in to view your profile.</p>
            <Button onClick={() => navigate('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your profile...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 " />
              
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-muted-foreground">Manage your personal information and preferences</p>
            </div>
          </div>

          {!isEditing && (
            <Button
              onClick={() => fetchUserDetails(true)}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>


        {/* Tabs */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            {/* Edit Profile Button */}
            {!isEditing && userDetails && (
              <div className="flex justify-end">
                <Button
                  onClick={handleEdit}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit Profile
                </Button>
              </div>
            )}

            {/* Profile Completion Status */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <CheckCircle className="h-5 w-5" />
                  Profile Completion Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Completion Progress</span>
                    <Badge variant={profileCompletion === 100 ? "default" : "secondary"}>
                      {profileCompletion}% Complete
                    </Badge>
                  </div>
                  <Progress value={profileCompletion} className="h-3 bg-blue-200" />

                  {profileCompletion === 100 ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Profile Complete! You have access to all features.</span>
                      </div>
                      {!user?.isProfileComplete && (
                        <Button
                          onClick={handleMarkProfileComplete}
                          disabled={isLoading}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {isLoading ? 'Marking...' : 'Mark Profile as Complete'}
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-blue-700">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Complete your profile to unlock all MindCare features.</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Success/Error Messages */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {/* Profile Details */}
            {!userDetails ? (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <AlertTriangle className="h-5 w-5" />
                    No Profile Details Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-700 mb-4">
                    You haven't completed your profile yet. Please complete your profile to view and edit your details.
                  </p>
                  <Button
                    onClick={() => navigate('/user-signup')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Complete Profile Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        {isEditing ? (
                          <Input
                            id="firstName"
                            value={editedDetails.firstName || ''}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="First Name"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">
                            {userDetails?.firstName || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        {isEditing ? (
                          <Input
                            id="lastName"
                            value={editedDetails.lastName || ''}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Last Name"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">
                            {userDetails?.lastName || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      {isEditing ? (
                        <Input
                          id="username"
                          value={editedDetails.username || ''}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                          placeholder="Username"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">
                          {userDetails?.username || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <p className="text-sm text-muted-foreground py-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editedDetails.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            placeholder="Phone Number"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground py-2 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {userDetails?.phone || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        {isEditing ? (
                          <Select value={editedDetails.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">
                            {userDetails?.gender ? userDetails.gender.charAt(0).toUpperCase() + userDetails.gender.slice(1) : 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={editedDetails.dateOfBirth ? new Date(editedDetails.dateOfBirth).toISOString().split('T')[0] : ''}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground py-2 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {userDetails?.dateOfBirth ? new Date(userDetails.dateOfBirth).toLocaleDateString() : 'Not provided'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Academic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                      Academic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="institutionId">Institution</Label>
                      {isEditing ? (
                        <Input
                          id="institutionId"
                          value={editedDetails.institutionId || ''}
                          onChange={(e) => handleInputChange('institutionId', e.target.value)}
                          placeholder="Institution ID"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground py-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {userDetails?.institutionId || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID</Label>
                        {isEditing ? (
                          <Input
                            id="studentId"
                            value={editedDetails.studentId || ''}
                            onChange={(e) => handleInputChange('studentId', e.target.value)}
                            placeholder="Student ID"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">
                            {userDetails?.studentId || 'Not provided'}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        {isEditing ? (
                          <Select value={editedDetails.year || ''} onValueChange={(value) => handleInputChange('year', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1st Year</SelectItem>
                              <SelectItem value="2">2nd Year</SelectItem>
                              <SelectItem value="3">3rd Year</SelectItem>
                              <SelectItem value="4">4th Year</SelectItem>
                              <SelectItem value="5">5th Year</SelectItem>
                              <SelectItem value="phd">PhD</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm text-muted-foreground py-2">
                            {userDetails?.year ? `${userDetails.year}${userDetails.year === '1' ? 'st' : userDetails.year === '2' ? 'nd' : userDetails.year === '3' ? 'rd' : 'th'} Year` : 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course">Course</Label>
                      {isEditing ? (
                        <Input
                          id="course"
                          value={editedDetails.course || ''}
                          onChange={(e) => handleInputChange('course', e.target.value)}
                          placeholder="Course/Program"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground py-2 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {userDetails?.course || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      {isEditing ? (
                        <Input
                          id="department"
                          value={editedDetails.department || ''}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          placeholder="Department (Optional)"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground py-2">
                          {userDetails?.department || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>)}

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Contact Name</Label>
                    {isEditing ? (
                      <Input
                        id="emergencyContact"
                        value={editedDetails.emergencyContact || ''}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        placeholder="Emergency Contact Name"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        {userDetails?.emergencyContact || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    {isEditing ? (
                      <Input
                        id="emergencyPhone"
                        value={editedDetails.emergencyPhone || ''}
                        onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                        placeholder="Emergency Contact Phone"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground py-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {userDetails?.emergencyPhone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Security Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="securityQuestion">Security Question</Label>
                    {isEditing ? (
                      <Input
                        id="securityQuestion"
                        value={editedDetails.securityQuestion || ''}
                        onChange={(e) => handleInputChange('securityQuestion', e.target.value)}
                        placeholder="Security Question"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        {userDetails?.securityQuestion || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="securityAnswer">Security Answer</Label>
                    {isEditing ? (
                      <Input
                        id="securityAnswer"
                        value={editedDetails.securityAnswer || ''}
                        onChange={(e) => handleInputChange('securityAnswer', e.target.value)}
                        placeholder="Security Answer"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        {userDetails?.securityAnswer ? '••••••••' : 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-600" />
                  Password Management
                </CardTitle>
                <CardDescription>
                  {hasPassword ? 'Change your password' : 'Set a password to enable email/password login'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showPasswordSection ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${hasPassword ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                      <span className="text-sm text-muted-foreground">
                        {hasPassword ? 'Password is set' : 'No password set'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordSection(true)}
                      className="border-purple-300 text-purple-700 hover:bg-purple-50"
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      {hasPassword ? 'Change Password' : 'Set Password'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {hasPassword && (
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPasswords.currentPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Enter current password"
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('currentPassword')}
                          >
                            {showPasswords.currentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.newPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password (min 8 characters)"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('newPassword')}
                        >
                          {showPasswords.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPasswordConfirm">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPasswordConfirm"
                          type={showPasswords.newPasswordConfirm ? 'text' : 'password'}
                          value={passwordData.newPasswordConfirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPasswordConfirm: e.target.value }))}
                          placeholder="Confirm new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => togglePasswordVisibility('newPasswordConfirm')}
                        >
                          {showPasswords.newPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowPasswordSection(false);
                          resetPasswordForm();
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        onClick={hasPassword ? handleChangePassword : handleSetPassword}
                        disabled={isSettingPassword || isChangingPassword}
                        className="bg-purple-300 hover:bg-purple-400 text-white"
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        {isSettingPassword || isChangingPassword
                          ? (hasPassword ? 'Changing...' : 'Setting...')
                          : (hasPassword ? 'Change Password' : 'Set Password')
                        }
                      </Button>
                    </div>
                  </div>
                )}

                {/* Password Benefits Info */}
                {!hasPassword && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Why set a password?</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Login without Google OAuth when needed</li>
                      <li>• Access your account even if Google services are down</li>
                      <li>• Enhanced security for your MindCare account</li>
                      <li>• Password must be at least 8 characters long</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Consent Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Consent & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${userDetails?.privacyConsent ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Privacy Policy Agreement</span>
                    {userDetails?.privacyConsent && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${userDetails?.dataProcessingConsent ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Data Processing Consent</span>
                    {userDetails?.dataProcessingConsent && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${userDetails?.mentalHealthConsent ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Mental Health Services Consent</span>
                    {userDetails?.mentalHealthConsent && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Actions */}
            {isEditing && (
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6 mt-6">
            <AppointmentBooking />
          </TabsContent>

          <TabsContent value="journal" className="space-y-6 mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    All Journal Entries
                  </h2>
                  <p className="text-muted-foreground">View and manage all your journal entries</p>
                </div>
              </div>

              {/* Show all journal entries directly */}
              <div className="space-y-4">
                {entries && entries.length > 0 ? (
                  entries.map((entry) => (
                    <Card key={entry._id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-green-100 text-green-800">
                                {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`px-3 py-1 ${
                              entry.mood === 'happy' ? 'bg-green-100 text-green-800' :
                              entry.mood === 'neutral' ? 'bg-yellow-100 text-yellow-800' :
                              entry.mood === 'sad' ? 'bg-blue-100 text-blue-800' :
                              entry.mood === 'anxious' ? 'bg-orange-100 text-orange-800' :
                              entry.mood === 'stressed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {entry.mood === 'happy' ? '😊' :
                               entry.mood === 'neutral' ? '😐' :
                               entry.mood === 'sad' ? '😔' :
                               entry.mood === 'anxious' ? '😰' :
                               entry.mood === 'stressed' ? '😡' : '😐'} {entry.mood}
                            </Badge>
                            <Badge variant="outline">
                              Wellness: {entry.wellnessScore}%
                            </Badge>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                        </div>

                        <div className="grid gap-4 text-sm text-muted-foreground md:grid-cols-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Mood Score:</span>
                            <span>{entry.moodScore}/10</span>
                          </div>
                          {entry.sleepHours && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Sleep:</span>
                              <span>{entry.sleepHours} hours</span>
                            </div>
                          )}
                          {entry.stressLevel && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Stress Level:</span>
                              <span>{entry.stressLevel}/10</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              // This would need to be implemented to edit entries
                              alert('Edit functionality would be implemented here');
                            }}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this journal entry?')) {
                                // This would need to be implemented to delete entries
                                alert('Delete functionality would be implemented here');
                              }
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Journal Entries Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start your wellness journey by writing your first journal entry.
                      </p>
                      <Button className="bg-green-600 hover:bg-green-700 text-white">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Write Your First Entry
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
