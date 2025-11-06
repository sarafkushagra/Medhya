import { assessmentAPI } from '../services/api';

// Generate random assessment data for testing
export const generateTestAssessmentData = () => {
  const assessmentTypes = ['PHQ-9', 'GAD-7', 'GHQ-12'];
  const testUsers = [
    '507f1f77bcf86cd799439011', // Sample user ID
    '507f1f77bcf86cd799439012',
    '507f1f77bcf86cd799439013',
    '507f1f77bcf86cd799439014',
    '507f1f77bcf86cd799439015'
  ];

  const assessments = [];

  // Generate assessments for the last 30 days
  for (let i = 0; i < 50; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    
    const assessment = {
      user: testUsers[Math.floor(Math.random() * testUsers.length)],
      type: assessmentTypes[Math.floor(Math.random() * assessmentTypes.length)],
      score: Math.floor(Math.random() * 27) + 1, // Score between 1-27
      responses: Array.from({ length: 9 }, () => Math.floor(Math.random() * 4) + 1), // Random responses
      date: randomDate
    };
    
    assessments.push(assessment);
  }

  return assessments;
};

// Send test assessment data to backend
export const sendTestAssessmentData = async () => {
  try {
    console.log('📊 Generating test assessment data...');
    const testData = generateTestAssessmentData();
    
    console.log(`📤 Sending ${testData.length} test assessments to backend...`);
    
    const results = await Promise.allSettled(
      testData.map(assessment => assessmentAPI.createAssessment(assessment))
    );
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    console.log(`✅ Successfully created ${successful} assessments`);
    if (failed > 0) {
      console.log(`❌ Failed to create ${failed} assessments`);
    }
    
    return { successful, failed, total: testData.length };
  } catch (error) {
    console.error('❌ Error sending test assessment data:', error);
    throw error;
  }
};

// Test the assessment analytics API
export const testAssessmentAnalytics = async () => {
  try {
    console.log('🔍 Testing assessment analytics API...');
    
    const analytics = await assessmentAPI.getAssessmentAnalytics('7d');
    console.log('📊 Analytics data:', analytics);
    
    return analytics;
  } catch (error) {
    console.error('❌ Error testing assessment analytics:', error);
    throw error;
  }
};

// Test the weekly patterns API
export const testWeeklyPatterns = async () => {
  try {
    console.log('📈 Testing weekly patterns API...');
    
    const patterns = await assessmentAPI.getWeeklyPatterns();
    console.log('📊 Weekly patterns:', patterns);
    
    return patterns;
  } catch (error) {
    console.error('❌ Error testing weekly patterns:', error);
    throw error;
  }
};

// Comprehensive test function
export const runAssessmentTests = async () => {
  try {
    console.log('🧪 Starting assessment API tests...');
    
    // First, send some test data
    await sendTestAssessmentData();
    
    // Wait a moment for data to be processed
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test analytics
    await testAssessmentAnalytics();
    
    // Test weekly patterns
    await testWeeklyPatterns();
    
    console.log('✅ All assessment tests completed successfully!');
  } catch (error) {
    console.error('❌ Assessment tests failed:', error);
  }
};
