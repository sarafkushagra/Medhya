// API Test Utility
import { appointmentAPI, crisisAPI, authAPI } from '../services/api.js';

export const testAPIs = async () => {
  console.log('🧪 Starting API Tests...');
  
  try {
    // Test 1: Check if API_BASE_URL is correct
    console.log('🔧 Testing API_BASE_URL...');
    const { API_BASE_URL } = await import('../services/api.js');
    console.log('✅ API_BASE_URL:', API_BASE_URL);
    
    // Test 2: Test appointment API
    console.log('🔧 Testing Appointment API...');
    try {
      const appointments = await appointmentAPI.getStudentAppointments('test-student');
      console.log('✅ Appointment API Response:', appointments);
    } catch (error) {
      console.log('❌ Appointment API Error:', error.message);
    }
    
    // Test 3: Test crisis API
    console.log('🔧 Testing Crisis API...');
    try {
      const crisisAlerts = await crisisAPI.getCrisisAlerts();
      console.log('✅ Crisis API Response:', crisisAlerts);
    } catch (error) {
      console.log('❌ Crisis API Error:', error.message);
    }
    
    // Test 4: Test auth API
    console.log('🔧 Testing Auth API...');
    try {
      const profile = await authAPI.getProfile();
      console.log('✅ Auth API Response:', profile);
    } catch (error) {
      console.log('❌ Auth API Error:', error.message);
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
};

// Function to test specific API endpoints
export const testSpecificEndpoint = async (endpoint, method = 'GET', data = null) => {
  console.log(`🧪 Testing ${method} ${endpoint}...`);
  
  try {
    const response = await fetch(`http://localhost:5000/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    const result = await response.json();
    console.log(`✅ ${method} ${endpoint} Response:`, {
      status: response.status,
      data: result
    });
    
    return result;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint} Error:`, error);
    throw error;
  }
};
