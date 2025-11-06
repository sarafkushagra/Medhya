// Test signup functionality with sample data
export const testSignup = async () => {
  const testUserData = {
    // Basic information
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe.test@example.com',
    phone: '+91-9876543210',
    dateOfBirth: '2000-01-15',
    gender: 'male',
    
    // Academic information
    institutionId: 'iit-delhi',
    studentId: 'IITD2024001',
    course: 'B.Tech - Computer Science',
    year: '3',
    department: 'Computer Science',
    
    // Security information
    password: 'TestPassword123!',
    passwordConfirm: 'TestPassword123!',
    securityQuestion: 'What was the name of your first pet?',
    securityAnswer: 'Buddy',
    
    // Consent information
    privacyConsent: true,
    dataProcessingConsent: true,
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+91-9876543211',
    mentalHealthConsent: true,
    communicationConsent: true
  };

  try {
    console.log('🧪 Testing signup with sample data...');
    
    const response = await fetch('http://localhost:5000/api/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUserData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Signup test failed:', result);
      return { success: false, error: result.message };
    }

    console.log('✅ Signup test successful:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Signup test error:', error);
    return { success: false, error: error.message };
  }
};

// Test login functionality
export const testLogin = async (email, password) => {
  try {
    console.log('🧪 Testing login...');
    
    const response = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Login test failed:', result);
      return { success: false, error: result.message };
    }

    console.log('✅ Login test successful:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Login test error:', error);
    return { success: false, error: error.message };
  }
};
