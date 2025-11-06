// Test utility for API endpoints
import { crisisAPI, appointmentAPI } from '../services/api';

export const testAPI = async () => {
  console.log('🧪 Testing API endpoints...');
  
  try {
    // Test crisis alerts endpoint
    console.log('📡 Testing crisis alerts endpoint...');
    const crisisAlerts = await crisisAPI.getCrisisAlerts();
    console.log('✅ Crisis alerts fetched:', crisisAlerts?.length || 0, 'alerts');
    
    // Test appointments endpoint
    console.log('📡 Testing appointments endpoint...');
    const appointments = await appointmentAPI.getStudentAppointments('demo-student-123');
    console.log('✅ Appointments fetched:', appointments?.length || 0, 'appointments');
    
    console.log('🎉 All API tests passed!');
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    console.log('💡 Make sure your backend server is running on http://localhost:5000');
    return false;
  }
};

// Test creating a sample crisis alert
export const testCreateCrisisAlert = async () => {
  try {
    const testAlert = {
      alertId: `TEST-${Date.now()}`,
      severity: 'medium',
      type: 'test_alert',
      studentId: 'test-student-123',
      source: 'ai_chat',
      aiConfidence: 85.5,
      keywordsTrigger: ['test', 'sample'],
      location: 'Test Location'
    };
    
    const result = await crisisAPI.createCrisisAlert(testAlert);
    console.log('✅ Test crisis alert created:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to create test crisis alert:', error);
    return null;
  }
};

// Test creating a sample appointment
export const testCreateAppointment = async () => {
  try {
    const testAppointment = {
      student: 'test-student-123',
      counselor: 'test-counselor-123',
      institutionId: 'test-institution-123',
      appointmentType: 'oncampus',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      timeSlot: '10:00 AM',
      urgencyLevel: 'routine',
      reason: 'Test appointment',
      status: 'pending'
    };
    
    const result = await appointmentAPI.createAppointment(testAppointment);
    console.log('✅ Test appointment created:', result);
    return result;
  } catch (error) {
    console.error('❌ Failed to create test appointment:', error);
    return null;
  }
};

export default {
  testAPI,
  testCreateCrisisAlert,
  testCreateAppointment,
};
