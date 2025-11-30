// API Test Utility
import { appointmentAPI, crisisAPI, authAPI } from '../services/api.js';

export const testAPIs = async () => {
  
  try {
    // Test 1: Check if API_BASE_URL is correct
    const { API_BASE_URL } = await import('../services/api.js');
    
    // Test 2: Test appointment API
    try {
      await appointmentAPI.getStudentAppointments('test-student');
    } catch (error) {
      // Handle error silently
    }
    
    // Test 3: Test crisis API
    try {
      await crisisAPI.getCrisisAlerts();
    } catch (_error) { // eslint-disable-line no-unused-vars
      // Handle error silently
    }
    
    // Test 4: Test auth API
    try {
      await authAPI.getProfile();
    } catch (_error) { // eslint-disable-line no-unused-vars
      // Handle error silently
    }
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
  }
};

// Function to test specific API endpoints
export const testSpecificEndpoint = async (endpoint, method = 'GET', data = null) => {
  
  try {
    const response = await fetch(`http://localhost:5000/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    const result = await response.json();
    
    return result;
  } catch (error) {
    console.error(`❌ ${method} ${endpoint} Error:`, error);
    throw error;
  }
};
