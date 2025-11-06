// Calculate wellness score from GAD-7 and PHQ-9 assessments
export const calculateWellnessScore = (gad7Score, phq9Score) => {
  // GAD-7 scoring: 0-4 (minimal), 5-9 (mild), 10-14 (moderate), 15-21 (severe)
  // PHQ-9 scoring: 0-4 (minimal), 5-9 (mild), 10-14 (moderate), 15-19 (moderately severe), 20-27 (severe)
  
  // Convert scores to percentages (lower is better for mental health)
  const gad7Percentage = Math.max(0, 100 - (gad7Score / 21) * 100);
  const phq9Percentage = Math.max(0, 100 - (phq9Score / 27) * 100);
  
  // Calculate average wellness score
  const wellnessScore = Math.round((gad7Percentage + phq9Percentage) / 2);
  
  return Math.max(0, Math.min(100, wellnessScore)); // Ensure score is between 0-100
};

// Get wellness level based on score
export const getWellnessLevel = (score) => {
  if (score >= 80) return { level: 'Excellent', color: 'text-green-600' };
  if (score >= 60) return { level: 'Good', color: 'text-yellow-600' };
  if (score >= 40) return { level: 'Fair', color: 'text-orange-600' };
  return { level: 'Poor', color: 'text-red-600' };
};
