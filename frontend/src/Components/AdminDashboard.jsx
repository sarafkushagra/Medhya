
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Alert, AlertDescription } from '../ui/Alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, Users, MessageCircle, Calendar, AlertTriangle, TrendingUp, Download, Filter, Eye, Shield, UserCheck, X, Lock, CheckCircle, GraduationCap, Phone, MapPin, Heart, Building, IdCard, Globe, Clock } from 'lucide-react';
import ScoresChart from './ScoresChart';
import CrisisChart from './CrisisChart';
import useAdminAnalytics from '../hooks/useAdminAnalytics';
import { adminAPI, apiCall } from '../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [counselors, setCounselors] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCounselors, setLoadingCounselors] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Create Counselor Modal State
  const [showCreateCounselorModal, setShowCreateCounselorModal] = useState(false);
  const [counselorForm, setCounselorForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualifications: '',
    licenseNumber: '',
    bio: ''
  });
  const [creatingCounselor, setCreatingCounselor] = useState(false);
  const [counselorFormError, setCounselorFormError] = useState('');
  const analytics = useAdminAnalytics();


  const trendData = [
    { month: 'Jan', anxiety: 45, depression: 32, stress: 58, sleep: 28 },
    { month: 'Feb', anxiety: 52, depression: 38, stress: 62, sleep: 35 },
    { month: 'Mar', anxiety: 48, depression: 35, stress: 71, sleep: 42 },
    { month: 'Apr', anxiety: 61, depression: 45, stress: 68, sleep: 38 },
    { month: 'May', anxiety: 55, depression: 42, stress: 75, sleep: 45 },
    { month: 'Jun', anxiety: 58, depression: 48, stress: 82, sleep: 52 }
  ];


  // Fetch users (students only)
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await adminAPI.getUsers();
      // Filter to show only students
      const students = data.filter(user => user.role === 'student');
      setUsers(students);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch counselors
  const fetchCounselors = async () => {
    setLoadingCounselors(true);
    try {
      const data = await adminAPI.getCounselors();
      setCounselors(data);
    } catch (error) {
      console.error('Error fetching counselors:', error);
    } finally {
      setLoadingCounselors(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchUsers();
    fetchCounselors();
  }, []);

  // Handle viewing user details
  const handleViewUserDetails = (user) => {
    setSelectedUser(user);
    setShowPasswordPrompt(true);
    setPassword('');
    setPasswordError('');
  };

  // Verify admin password
  const verifyAdminPassword = async () => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    setLoadingPassword(true);
    setPasswordError('');

    try {
      await apiCall('/admin/verify-password', {
        method: 'POST',
        body: JSON.stringify({ password })
      });

      setShowPasswordPrompt(false);
      setShowUserModal(true);
    } catch (error) {
      console.error('Password verification error:', error);
      setPasswordError(error.message || 'Failed to verify password. Please try again.');
    } finally {
      setLoadingPassword(false);
    }
  };

  // Close modals
  const closeModals = () => {
    setShowUserModal(false);
    setShowPasswordPrompt(false);
    setShowCreateCounselorModal(false);
    setSelectedUser(null);
    setPassword('');
    setPasswordError('');
    setCounselorFormError('');
  };

  // Handle create counselor
  const handleCreateCounselor = async (e) => {
    e.preventDefault();

    // Validate form
    if (!counselorForm.firstName.trim() || !counselorForm.lastName.trim() ||
      !counselorForm.email.trim() || !counselorForm.phone.trim() ||
      !counselorForm.specialization.trim()) {
      setCounselorFormError('Please fill in all required fields');
      return;
    }

    setCreatingCounselor(true);
    setCounselorFormError('');

    try {
      await apiCall('/admin/create-counselor', {
        method: 'POST',
        body: JSON.stringify(counselorForm)
      });

      // Reset form
      setCounselorForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialization: '',
        experience: '',
        qualifications: '',
        licenseNumber: '',
        bio: ''
      });

      setShowCreateCounselorModal(false);

      // Refresh data
      fetchUsers();
      fetchCounselors();

      alert('Counselor created successfully! They will receive login credentials via email.');
    } catch (error) {
      console.error('Create counselor error:', error);
      setCounselorFormError(error.message || 'Failed to create counselor. Please try again.');
    } finally {
      setCreatingCounselor(false);
    }
  };

  return (

    <div className="min-h-screen  text-gray-800 bg-gradient-to-br from-sky-100 via-white to-blue-100 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 shadow-2xl shadow-gray-800 rounded-lg">
        <Card className="shadow-2xl rounded-2xl mb-8 transform transition-transform duration-500 hover:scale-[1.005]">
          <CardHeader>
            <CardTitle className="flex items-center gap-4 text-4xl font-extrabold text-indigo-800">
              <BarChart3 className="w-10 h-10 text-indigo-600" />
              Administrator Dashboard
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 mt-2">
              Monitor system usage, user trends, and safety alerts with a modern overview.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-8 gap-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 text-green-600 border-green-600 hover:bg-green-50 transition-colors duration-300 transform hover:scale-105"
              onClick={() => setShowCreateCounselorModal(true)}
            >
              <UserCheck className="w-4 h-4" />
              Create Counselor
            </Button>

          </div>
          <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600 px-3 py-1 text-sm rounded-full animate-pulse transition-colors duration-300">
            <Shield className="w-3 h-3" />
            HIPAA Compliant
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Total Users</CardTitle>
              <Users className="h-6 w-6 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {analytics.loading ? '...' : analytics.totalUsers}
              </div>
              <p className="text-xs text-gray-500 mt-1">Registered students</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500"> Counselors</CardTitle>
              <UserCheck className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {loadingCounselors ? '...' : counselors.length}
              </div>
              <p className="text-xs text-gray-500 mt-1">Active counselors</p>
            </CardContent>
          </Card>



          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Chat Sessions </CardTitle>
              <MessageCircle className="h-6 w-6 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {analytics.loading ? '...' : analytics.chatSessions}
              </div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Appointments</CardTitle>
              <Calendar className="h-6 w-6 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {analytics.loading ? '...' : analytics.appointments}
              </div>  <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-md font-medium text-gray-500">Forum Posts</CardTitle>
              <Users className="h-6 w-6 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-gray-900">
                {analytics.loading ? '...' : analytics.forumPosts}
              </div>
              <p className="text-xs text-gray-500 mt-1">This week</p>
            </CardContent>
          </Card>


        </div>

        <Tabs defaultValue="usage" className="my-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-200 rounded-2xl p-1 mb-8 shadow-inner">
            <TabsTrigger value="usage" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300 hover:text-indigo-800">Usage Analytics</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300 hover:text-indigo-800">Mental Health Trends</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300 hover:text-indigo-800">User Management</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md rounded-xl transition-all duration-300 hover:text-indigo-800">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-6">
            <div className="grid gap-8 lg:grid-cols-2">
              <ScoresChart
                timeRange="7d"
                title="Weekly Assessment Patterns"
              />
              <CrisisChart timeRange="30d" title="Crisis Management Analytics" />
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="shadow-lg rounded-2xl p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Mental Health Trends (6 Months)</CardTitle>
                <CardDescription className="text-md text-gray-600">
                  Anonymized data showing trends in mental health concerns across the student population
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Line type="monotone" dataKey="anxiety" stroke="#F43F5E" name="Anxiety" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="depression" stroke="#10B981" name="Depression" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="stress" stroke="#FBBF24" name="Academic Stress" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="sleep" stroke="#6366F1" name="Sleep Issues" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="shadow-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-500" />
                    <span className="text-sm">Academic stress increasing by 15%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm">Sleep issues more common in final years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Early intervention showing positive results</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Peak Usage Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0">
                  <div className="text-sm text-gray-600">
                    <strong>Chat Support:</strong> 8-10 PM weekdays
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Appointments:</strong> Tuesday-Thursday afternoons
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Forum Activity:</strong> Late evenings & weekends
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg rounded-2xl p-6 transition-all duration-300 transform hover:scale-[1.03] hover:shadow-2xl">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-0 text-sm text-gray-600">
                  <div>• Increase counselor availability during exam periods</div>
                  <div>• Implement stress management workshops</div>
                  <div>• Promote sleep hygiene resources</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Users Section */}
              <Card className="shadow-lg rounded-2xl p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-6 h-6 text-indigo-600" />
                    Students ({users.length})
                  </CardTitle>
                  <CardDescription className="text-md text-gray-600">
                    Manage student accounts and profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {loadingUsers ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading students...</p>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No students found</p>
                      </div>
                    ) : (
                      users.map((user) => (
                        <div key={user._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 font-semibold text-sm">
                                {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {user.isProfileComplete ? 'Complete' : 'Incomplete'}
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => handleViewUserDetails(user)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Counselors Section */}
              <Card className="shadow-lg rounded-2xl p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-green-600" />
                    Counselors ({counselors.length})
                  </CardTitle>
                  <CardDescription className="text-md text-gray-600">
                    Manage counselor accounts and availability
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {loadingCounselors ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                        <p className="text-gray-600">Loading counselors...</p>
                      </div>
                    ) : counselors.length === 0 ? (
                      <div className="text-center py-8">
                        <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">No counselors found</p>
                      </div>
                    ) : (
                      counselors.map((counselor) => (
                        <div key={counselor._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold text-sm">
                                {counselor.firstName?.charAt(0) || counselor.email?.charAt(0) || 'C'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {counselor.firstName} {counselor.lastName}
                              </p>
                              <p className="text-sm text-gray-600">{counselor.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Active
                            </Badge>
                            <Button size="sm" variant="outline" onClick={() => handleViewUserDetails(counselor)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={fetchUsers}
                disabled={loadingUsers}
                className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <Users className="w-4 h-4 mr-2" />
                Refresh Students
              </Button>
              <Button
                onClick={fetchCounselors}
                disabled={loadingCounselors}
                className="bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Refresh Counselors
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-lg rounded-2xl p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">System Reports</CardTitle>
                <CardDescription className="text-md text-gray-600">Generate comprehensive reports for institutional review</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Monthly Usage Report</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Comprehensive overview of system usage, user engagement, and feature adoption
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Mental Health Trends Analysis</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Anonymized analysis of mental health trends and intervention effectiveness
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Safety & Compliance Report</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Safety protocols, alert responses, and compliance with regulations
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300">
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">Resource Utilization Report</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Analysis of resource usage, counselor workload, and capacity planning
                    </p>
                    <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300">
                      <Download className="w-4 h-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Alert className="border-indigo-200 bg-indigo-50 text-indigo-800 rounded-lg shadow-md">
              <Shield className="h-5 w-5" />
              <AlertDescription className="text-md font-medium">
                All reports are generated with anonymized data to protect student privacy. No personally identifiable information is included in institutional reports.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>

      {/* Password Verification Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                Security Verification
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Please enter your admin password to view user details.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your password"
                  onKeyPress={(e) => e.key === 'Enter' && verifyAdminPassword()}
                />
                {passwordError && (
                  <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={verifyAdminPassword}
                  disabled={loadingPassword}
                  className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {loadingPassword ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Verify & View Details'
                  )}
                </Button>
                <Button
                  onClick={closeModals}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-indigo-600" />
                User Details
              </h3>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-lg text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <Badge variant="outline" className="text-sm capitalize">
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Status</label>
                  <div className="flex items-center gap-2">
                    {selectedUser.isProfileComplete ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600 border-orange-200">
                        Incomplete
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Information for Complete Profiles */}
              {selectedUser.isProfileComplete && (
                <>
                  {/* Personal Information */}
                  <div className="border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      Personal Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.phone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <p className="text-gray-900">{selectedUser.phone}</p>
                        </div>
                      )}
                      {selectedUser.dateOfBirth && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                          <p className="text-gray-900">
                            {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      {selectedUser.gender && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                          <p className="text-gray-900 capitalize">{selectedUser.gender}</p>
                        </div>
                      )}
                      {selectedUser.emergencyContact && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            Emergency Contact
                          </label>
                          <p className="text-gray-900">{selectedUser.emergencyContact}</p>
                        </div>
                      )}
                      {selectedUser.emergencyPhone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            Emergency Phone
                          </label>
                          <p className="text-gray-900">{selectedUser.emergencyPhone}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.username && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <p className="text-gray-900">@{selectedUser.userDetails.username}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.institutionId && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            Institution ID
                          </label>
                          <p className="text-gray-900">{selectedUser.userDetails.institutionId}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.studentId && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <IdCard className="w-3 h-3" />
                            Student ID
                          </label>
                          <p className="text-gray-900">{selectedUser.userDetails.studentId}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.course && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                          <p className="text-gray-900">{selectedUser.userDetails.course}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.year && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">College Year</label>
                          <p className="text-gray-900">{selectedUser.userDetails.year}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.department && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          <p className="text-gray-900">{selectedUser.userDetails.department}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.preferredContactMethod && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Contact</label>
                          <p className="text-gray-900 capitalize">{selectedUser.userDetails.preferredContactMethod}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.timezone && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Timezone
                          </label>
                          <p className="text-gray-900">{selectedUser.userDetails.timezone}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.language && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Language
                          </label>
                          <p className="text-gray-900">{selectedUser.userDetails.language.toUpperCase()}</p>
                        </div>
                      )}
                      {selectedUser.userDetails?.securityQuestion && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Security Question
                          </label>
                          <p className="text-gray-900">{selectedUser.userDetails.securityQuestion}</p>
                        </div>
                      )}
                    </div>

                    {/* Interests */}
                    {selectedUser.userDetails?.interests && selectedUser.userDetails.interests.length > 0 && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                        <div className="flex flex-wrap gap-2">
                          {selectedUser.userDetails.interests.map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Address Information */}
                    {(selectedUser.address || selectedUser.city || selectedUser.state || selectedUser.country) && (
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          Address
                        </label>
                        <p className="text-gray-900">
                          {[selectedUser.address, selectedUser.city, selectedUser.state, selectedUser.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Role-specific Information */}
                  {selectedUser.role === 'student' && selectedUser.userDetails && (
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        Academic Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUser.userDetails.course && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course/Program</label>
                            <p className="text-gray-900">{selectedUser.userDetails.course}</p>
                          </div>
                        )}
                        {selectedUser.userDetails.year && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                              <GraduationCap className="w-3 h-3" />
                              College Year
                            </label>
                            <p className="text-gray-900">{selectedUser.userDetails.year}</p>
                          </div>
                        )}
                        {selectedUser.userDetails.department && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <p className="text-gray-900">{selectedUser.userDetails.department}</p>
                          </div>
                        )}
                        {selectedUser.userDetails.academicYear && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                            <p className="text-gray-900">{selectedUser.userDetails.academicYear}</p>
                          </div>
                        )}
                        {selectedUser.userDetails.major && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Major/Specialization</label>
                            <p className="text-gray-900">{selectedUser.userDetails.major}</p>
                          </div>
                        )}
                        {selectedUser.userDetails.university && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">University/Institution</label>
                            <p className="text-gray-900">{selectedUser.userDetails.university}</p>
                          </div>
                        )}
                        {selectedUser.userDetails.graduationYear && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
                            <p className="text-gray-900">{selectedUser.userDetails.graduationYear}</p>
                          </div>
                        )}
                        {selectedUser.userDetails.gpa && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                            <p className="text-gray-900">{selectedUser.userDetails.gpa}</p>
                          </div>
                        )}
                      </div>

                      {/* Mental Health Information */}
                      {(selectedUser.userDetails.mentalHealthHistory || selectedUser.userDetails.currentMedications || selectedUser.userDetails.allergies || selectedUser.userDetails.supportNeeded) && (
                        <div className="mt-4">
                          <h5 className="text-md font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            Mental Health Information
                          </h5>
                          <div className="space-y-2">
                            {selectedUser.userDetails.mentalHealthHistory && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mental Health History</label>
                                <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">{selectedUser.userDetails.mentalHealthHistory}</p>
                              </div>
                            )}
                            {selectedUser.userDetails.currentMedications && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                                <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">{selectedUser.userDetails.currentMedications}</p>
                              </div>
                            )}
                            {selectedUser.userDetails.allergies && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                                <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">{selectedUser.userDetails.allergies}</p>
                              </div>
                            )}
                            {selectedUser.userDetails.supportNeeded && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Support Needed</label>
                                <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">{selectedUser.userDetails.supportNeeded}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Counselor-specific Information */}
                  {selectedUser.role === 'counselor' && selectedUser.counselorProfile && (
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-green-600" />
                        Professional Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedUser.specialization && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                            <p className="text-gray-900">{selectedUser.specialization}</p>
                          </div>
                        )}
                        {selectedUser.experience && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                            <p className="text-gray-900">{selectedUser.experience} years</p>
                          </div>
                        )}
                        {selectedUser.qualifications && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                            <p className="text-gray-900">{selectedUser.qualifications}</p>
                          </div>
                        )}
                        {selectedUser.licenseNumber && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                            <p className="text-gray-900">{selectedUser.licenseNumber}</p>
                          </div>
                        )}
                      </div>

                      {/* Counselor Profile Details */}
                      {selectedUser.counselorProfile && (
                        <div className="mt-4">
                          <h5 className="text-md font-medium text-gray-900 mb-2">Additional Details</h5>
                          <div className="space-y-2">
                            {selectedUser.counselorProfile.bio && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">{selectedUser.counselorProfile.bio}</p>
                              </div>
                            )}
                            {selectedUser.counselorProfile.specializations && selectedUser.counselorProfile.specializations.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specializations</label>
                                <div className="flex flex-wrap gap-1">
                                  {selectedUser.counselorProfile.specializations.map((spec, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {spec}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedUser.counselorProfile.education && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                                <p className="text-gray-900 text-sm bg-gray-50 p-2 rounded">
                                  {selectedUser.counselorProfile.education.degree && selectedUser.counselorProfile.education.institution
                                    ? `${selectedUser.counselorProfile.education.degree} from ${selectedUser.counselorProfile.education.institution}${selectedUser.counselorProfile.education.year ? ` (${selectedUser.counselorProfile.education.year})` : ''}`
                                    : 'Education information not available'
                                  }
                                </p>
                              </div>
                            )}
                            {selectedUser.counselorProfile.certifications && selectedUser.counselorProfile.certifications.length > 0 && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications</label>
                                <div className="flex flex-wrap gap-1">
                                  {selectedUser.counselorProfile.certifications.map((cert, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {cert}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                            {selectedUser.counselorProfile.availability && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                <div className="text-gray-900 text-sm">
                                  {(() => {
                                    const availability = selectedUser.counselorProfile.availability;
                                    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                                    const availableDays = days.filter(day => availability[day]?.available);

                                    if (availableDays.length === 0) {
                                      return 'No availability information';
                                    }

                                    if (availableDays.length === 7) {
                                      return 'Available all days';
                                    }

                                    return availableDays.map(day =>
                                      day.charAt(0).toUpperCase() + day.slice(1)
                                    ).join(', ');
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Emergency Contact Section */}
                  {(selectedUser.emergencyContact || selectedUser.userDetails?.emergencyContact) && (
                    <div className="border-t pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Emergency Contact
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <p className="text-gray-900">{selectedUser.emergencyContact || selectedUser.userDetails?.emergencyContact}</p>
                        </div>
                        {(selectedUser.emergencyPhone || selectedUser.userDetails?.emergencyPhone) && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <p className="text-gray-900">{selectedUser.emergencyPhone || selectedUser.userDetails?.emergencyPhone}</p>
                          </div>
                        )}
                        {selectedUser.emergencyEmail && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900">{selectedUser.emergencyEmail}</p>
                          </div>
                        )}
                        {selectedUser.emergencyRelationship && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                            <p className="text-gray-900">{selectedUser.emergencyRelationship}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Account Information */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-gray-600" />
                  Account Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                    <p className="text-sm font-mono text-gray-600 bg-gray-50 p-2 rounded">
                      {selectedUser._id}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <Alert className="border-yellow-200 bg-yellow-50">
                <Shield className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm text-yellow-800">
                  <strong>Security Notice:</strong> This information is protected and should only be viewed by authorized administrators.
                  All access is logged for audit purposes.
                </AlertDescription>
              </Alert>
            </div>

            <div className="flex justify-end mt-6">
              <Button onClick={closeModals} className="bg-indigo-600 text-white hover:bg-indigo-700">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Counselor Modal */}
      {showCreateCounselorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-green-600" />
                Create New Counselor
              </h3>
              <button
                onClick={() => setShowCreateCounselorModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateCounselor} className="space-y-6">
              {counselorFormError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-sm text-red-800">
                    {counselorFormError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={counselorForm.firstName}
                    onChange={(e) => setCounselorForm({ ...counselorForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={counselorForm.lastName}
                    onChange={(e) => setCounselorForm({ ...counselorForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={counselorForm.email}
                    onChange={(e) => setCounselorForm({ ...counselorForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="counselor@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={counselorForm.phone}
                    onChange={(e) => setCounselorForm({ ...counselorForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                  <select
                    required
                    value={counselorForm.specialization}
                    onChange={(e) => setCounselorForm({ ...counselorForm, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a specialization</option>
                    <option value="Anxiety">Anxiety</option>
                    <option value="Depression">Depression</option>
                    <option value="Stress Management">Stress Management</option>
                    <option value="Academic Stress">Academic Stress</option>
                    <option value="Relationship Issues">Relationship Issues</option>
                    <option value="Social Anxiety">Social Anxiety</option>
                    <option value="Career Counseling">Career Counseling</option>
                    <option value="Trauma">Trauma</option>
                    <option value="PTSD">PTSD</option>
                    <option value="Family Issues">Family Issues</option>
                    <option value="Eating Disorders">Eating Disorders</option>
                    <option value="Substance Abuse">Substance Abuse</option>
                    <option value="Grief and Loss">Grief and Loss</option>
                    <option value="Self-Esteem">Self-Esteem</option>
                    <option value="Mindfulness">Mindfulness</option>
                    <option value="General">General</option>
                    <option value="Body Image Issues">Body Image Issues</option>
                    <option value="Addiction">Addiction</option>
                    <option value="Behavioral Therapy">Behavioral Therapy</option>
                    <option value="Bereavement">Bereavement</option>
                    <option value="Life Transitions">Life Transitions</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input
                      type="number"
                      min="0"
                      value={counselorForm.experience}
                      onChange={(e) => setCounselorForm({ ...counselorForm, experience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                      type="text"
                      value={counselorForm.licenseNumber}
                      onChange={(e) => setCounselorForm({ ...counselorForm, licenseNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="License number"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    value={counselorForm.qualifications}
                    onChange={(e) => setCounselorForm({ ...counselorForm, qualifications: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., PhD, Licensed Professional Counselor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows="3"
                    value={counselorForm.bio}
                    onChange={(e) => setCounselorForm({ ...counselorForm, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Brief professional biography..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateCounselorModal(false)}
                  disabled={creatingCounselor}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creatingCounselor}
                  className="bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {creatingCounselor ? 'Creating...' : 'Create Counselor'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;