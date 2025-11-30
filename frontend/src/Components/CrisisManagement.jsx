
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert, AlertDescription } from '../ui/Alert';
import { Progress } from '../ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { Input } from '../ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import {
  AlertTriangle, Shield, Phone, Brain,
  CheckCircle, X, ArrowRight, TrendingUp, MapPin, Bell, Eye,
  Target, MessageCircle, Calendar, UserCheck,
  Search, Filter, RefreshCw, Loader2
} from 'lucide-react';
import { crisisAPI } from '../services/api';
import { useApi, useSearchAndFilter, useOptimisticUpdate } from '../hooks/useApi';
import { testAPI, testCreateCrisisAlert } from '../utils/testApi';

const CrisisManagement = () => {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Search and filter functionality
  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    clearFilters,
    getCombinedFilters,
  } = useSearchAndFilter({
    status: 'all',
    severity: 'all',
  });

  // API data fetching
  const { data: crisisAlerts, loading, error, refetch } = useApi(
    () => {
      const filters = getCombinedFilters();
      // Remove 'all' values from API filters
      const apiFilters = {};
      if (filters.status && filters.status !== 'all') apiFilters.status = filters.status;
      if (filters.severity && filters.severity !== 'all') apiFilters.severity = filters.severity;
      return crisisAPI.getCrisisAlerts(apiFilters);
    },
    [filters.status, filters.severity] // Removed searchTerm to prevent excessive re-renders
  );

  // Optimistic updates for status changes
  const { updateOptimistically } = useOptimisticUpdate(
    ({ alertId, status }) => crisisAPI.updateCrisisStatus(alertId, status)
  );

  // Manual refresh only - removed automatic refresh to prevent excessive API calls
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     refetch();
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, [refetch]);

  const responseProtocols = {
    critical: {
      color: 'bg-red-500',
      textColor: 'text-red-900',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      responseTime: '< 2 minutes',
      actions: [
        'Immediate alert to emergency contacts',
        'Campus security dispatch',
        'Mental health professional notification',
        'Automated wellness check initiation'
      ]
    },
    high: {
      color: 'bg-orange-500',
      textColor: 'text-orange-900',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      responseTime: '< 15 minutes',
      actions: [
        'Counselor notification',
        'Student reached out via secure channel',
        'Risk assessment initiated',
        'Support resource recommendations'
      ]
    },
    medium: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-900',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      responseTime: '< 2 hours',
      actions: [
        'Automated check-in message',
        'Counselor informed for follow-up',
        'Peer support group suggestion',
        'Wellness activity recommendations'
      ]
    },
    low: {
      color: 'bg-blue-500',
      textColor: 'text-blue-900',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      responseTime: '< 24 hours',
      actions: [
        'Automated wellness check',
        'Resource recommendations',
        'Follow-up scheduling',
        'Preventive care suggestions'
      ]
    }
  };

  // Calculate stats from real data (optimized)
  const statsData = React.useMemo(() => ({
    totalAlerts: crisisAlerts?.length || 0,
    activeAlerts: crisisAlerts?.filter(alert => alert.status === 'active').length || 0,
    averageResponseTime: '4.2 minutes', // This would come from backend analytics
    successfulInterventions: 98.7,
    counselorsOnDuty: 12,
    emergencyContacts: 8
  }), [crisisAlerts]);

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const handleAlertAction = async (alertId, action) => {
    try {
      if (action === 'status_update') {
        const newStatus = 'in_progress'; // This could be dynamic based on action
        await updateOptimistically(
          { alertId, status: newStatus },
          (prevData) => prevData?.map(alert =>
            alert._id === alertId ? { ...alert, status: newStatus } : alert
          )
        );
      }

      // In real implementation, this would trigger actual interventions
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const handleStatusUpdate = async (alertId, newStatus) => {
    try {
      await updateOptimistically(
        { alertId, status: newStatus },
        (prevData) => prevData?.map(alert =>
          alert._id === alertId ? { ...alert, status: newStatus } : alert
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filter alerts based on search term (optimized)
  const filteredAlerts = React.useMemo(() => {
    if (!crisisAlerts) return [];

    if (!searchTerm) return crisisAlerts;

    const searchLower = searchTerm.toLowerCase();
    return crisisAlerts.filter(alert =>
      alert.studentId?.toLowerCase().includes(searchLower) ||
      alert.type?.toLowerCase().includes(searchLower) ||
      alert.source?.toLowerCase().includes(searchLower) ||
      alert.keywordsTrigger?.some(keyword =>
        keyword.toLowerCase().includes(searchLower)
      )
    );
  }, [crisisAlerts, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error loading crisis alerts: {error}
          <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Advanced Crisis Detection & Management System
          </CardTitle>
          <CardDescription>
            AI-powered real-time monitoring and intervention system for student mental health emergencies
          </CardDescription>
        </CardHeader>
      </Card>

      {/* System Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-900">{statsData.activeAlerts}</div>
            <div className="text-sm text-red-700">Active Alerts</div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-900">{statsData.totalAlerts}</div>
            <div className="text-sm text-blue-700">Total This Month</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-900">{statsData.averageResponseTime}</div>
            <div className="text-sm text-green-700">Avg Response Time</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-900">{statsData.successfulInterventions}%</div>
            <div className="text-sm text-purple-700">Success Rate</div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-900">{statsData.counselorsOnDuty}</div>
            <div className="text-sm text-orange-700">Counselors On-Duty</div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-indigo-900">{statsData.emergencyContacts}</div>
            <div className="text-sm text-indigo-700">Emergency Contacts</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="protocols">Response Protocols</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="team">Response Team</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Search and Filter Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by student ID, type, source, or keywords..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filters.severity} onValueChange={(value) => updateFilter('severity', value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by Severity" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-md">
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                  <Button variant="outline" onClick={refetch} disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Crisis Alerts */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Crisis Alerts ({filteredAlerts.length})
                  {loading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={testAPI} disabled={loading}>
                    <Bell className="w-4 h-4 mr-2" />
                    Test API
                  </Button>
                  <Button size="sm" variant="outline" onClick={testCreateCrisisAlert} disabled={loading}>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Create Test Alert
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                  }}>
                    <Eye className="w-4 h-4 mr-2" />
                    Debug State
                  </Button>
                  <Button size="sm" variant="outline" onClick={refetch} disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh
                  </Button>
                  <Button size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Contacts
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="ml-2">Loading crisis alerts...</span>
                </div>
              ) : paginatedAlerts.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchTerm || Object.values(filters).some(f => f && f !== 'all')
                        ? 'No alerts match your search criteria'
                        : 'No crisis alerts found'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {paginatedAlerts.map((alert) => {
                    const protocol = responseProtocols[alert.severity] || responseProtocols.medium;
                    return (
                      <Card
                        key={alert._id || alert.id}
                        className={`${protocol.borderColor} cursor-pointer transition-all hover:shadow-md ${selectedAlert?._id === alert._id ? 'ring-2 ring-blue-500' : ''
                          }`}
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${protocol.color}`}></div>
                                <Badge className={`${protocol.bgColor} ${protocol.textColor} border-0`}>
                                  {alert.severity?.toUpperCase()}
                                </Badge>
                              </div>
                              <Badge variant="outline">
                                {alert.type?.replace('_', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <Badge
                              variant={alert.status === 'active' ? 'destructive' :
                                alert.status === 'in_progress' ? 'default' : 'secondary'}
                            >
                              {alert.status?.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">Student ID: {alert.studentId}</span>
                              <span className="text-muted-foreground">{getTimeAgo(alert.timestamp || alert.createdAt)}</span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Source: {alert.source?.replace('_', ' ')}</span>
                              <span>AI Confidence: {alert.aiConfidence}%</span>
                              {alert.previousAlerts > 0 && (
                                <span className="text-orange-600">Previous alerts: {alert.previousAlerts}</span>
                              )}
                            </div>

                            {alert.location && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span>{alert.location}</span>
                              </div>
                            )}

                            {alert.keywordsTrigger && alert.keywordsTrigger.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {alert.keywordsTrigger.slice(0, 3).map((keyword, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                                {alert.keywordsTrigger.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{alert.keywordsTrigger.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}

                            {alert.status === 'active' && (
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAlertAction(alert._id || alert.id, 'emergency_response');
                                  }}
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Emergency Response
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusUpdate(alert._id || alert.id, 'in_progress');
                                  }}
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Start Response
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAlertAction(alert._id || alert.id, 'assign_counselor');
                                  }}
                                >
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  Assign Counselor
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAlerts.length)} of {filteredAlerts.length} alerts
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        <span className="flex items-center px-3 text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Alert Details Panel */}
            <div className="space-y-4">
              {selectedAlert ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Alert Details</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedAlert(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Response Protocol</h4>
                      <div className="space-y-2">
                        {responseProtocols[selectedAlert.severity]?.actions.map((action, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Timeline</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Alert triggered</span>
                          <span>{getTimeAgo(selectedAlert.timestamp || selectedAlert.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Target response</span>
                          <span className="font-medium text-red-600">
                            {responseProtocols[selectedAlert.severity]?.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">AI Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Confidence Level</span>
                          <span className="font-medium">{selectedAlert.aiConfidence}%</span>
                        </div>
                        <Progress value={selectedAlert.aiConfidence} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Based on keyword analysis, behavioral patterns, and contextual understanding
                        </div>
                      </div>
                    </div>

                    {selectedAlert.status === 'active' && (
                      <div className="space-y-2">
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700"
                          onClick={() => handleAlertAction(selectedAlert._id || selectedAlert.id, 'emergency_response')}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Initiate Emergency Response
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleStatusUpdate(selectedAlert._id || selectedAlert.id, 'in_progress')}
                        >
                          <ArrowRight className="w-4 h-4 mr-2" />
                          Start Response Process
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center text-muted-foreground">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p>Select an alert to view details and response options</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(responseProtocols).map(([severity, protocol]) => (
              <Card key={severity} className={`${protocol.borderColor}`}>
                <CardHeader>
                  <CardTitle className={`${protocol.textColor} flex items-center gap-2`}>
                    <div className={`w-4 h-4 rounded-full ${protocol.color}`}></div>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)} Risk
                  </CardTitle>
                  <CardDescription>
                    Response time: {protocol.responseTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {protocol.actions.map((action, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></div>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Predictive Risk Modeling
                </CardTitle>
                <CardDescription>AI-powered early warning system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">High-risk students identified</span>
                    <Badge variant="outline">47 students</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Intervention success rate</span>
                    <Badge className="bg-green-50 text-green-700">94.3%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">False positive rate</span>
                    <Badge className="bg-blue-50 text-blue-700">3.2%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average prediction accuracy</span>
                    <Badge className="bg-purple-50 text-purple-700">91.8%</Badge>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Detailed Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  Early Intervention Impact
                </CardTitle>
                <CardDescription>Measuring preventive care effectiveness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">67%</div>
                  <div className="text-sm text-muted-foreground">Reduction in crisis incidents</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">4.2x</div>
                  <div className="text-sm text-muted-foreground">Faster intervention response</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-muted-foreground">Student satisfaction improvement</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Crisis Response Team</CardTitle>
                <CardDescription>24/7 mental health professionals on standby</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Dr. Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">Senior Clinical Psychologist</div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">On Duty</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Prof. Raj Patel</div>
                      <div className="text-sm text-muted-foreground">Crisis Intervention Specialist</div>
                    </div>
                    <Badge className="bg-green-50 text-green-700">On Duty</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Dr. Priya Sharma</div>
                      <div className="text-sm text-muted-foreground">Emergency Psychiatrist</div>
                    </div>
                    <Badge variant="outline">On Call</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
                <CardDescription>External crisis support network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Phone className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-red-900">iCALL Psychosocial Helpline</div>
                      <div className="text-sm text-red-700">1800-599-0019 (24/7)</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">KIRAN Mental Health</div>
                      <div className="text-sm text-blue-700">1800-599-0019</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Campus Security</div>
                      <div className="text-sm text-green-700">+91-XXX-XXX-XXXX</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrisisManagement;