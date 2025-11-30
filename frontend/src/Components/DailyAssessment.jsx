import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { CheckCircle, Brain } from 'lucide-react';
import { useAssessment } from '../hooks/useAssessment.js';
import StressAssessment from './StressAssessment.jsx';

const DailyAssessment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { todayAssessments, getTodayAssessment } = useAssessment();

  useEffect(() => {
    // Only load GAD-7 and PHQ-9 assessments for this component
    getTodayAssessment('GAD-7');
    getTodayAssessment('PHQ-9');
  }, [getTodayAssessment]);

  const isCompleted = todayAssessments['GAD-7'] && todayAssessments['GAD-7'].score !== undefined &&
    todayAssessments['PHQ-9'] && todayAssessments['PHQ-9'].score !== undefined;

  const handleAttemptClick = () => {
    setIsModalOpen(true);
  };

  const handleAssessmentComplete = () => {
    // Don't close modal automatically, let user do both assessments
    // Refresh the status for GAD-7 and PHQ-9 only
    getTodayAssessment('GAD-7');
    getTodayAssessment('PHQ-9');
  };

  return (
    <>
      <Card className="border-blue-200 hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5 text-blue-600" />
            Daily Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCompleted ? (
            <div className="text-center py-4 mt-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Daily Tests Completed</p>
              <div className="text-xs text-gray-500 mt-1">
                <p>GAD-7: {todayAssessments['GAD-7'].score}</p>
                <p>PHQ-9: {todayAssessments['PHQ-9'].score}</p>
              </div>
            </div>
          ) : (
            <div className="text-center mt- py-4">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-4">Complete your daily mental health assessments (GAD-7 & PHQ-9)</p>
              <Button
                onClick={handleAttemptClick}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                Attempt Daily Test
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
            <div className="p-4">
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </Button>
              </div>
              <StressAssessment
                isPopup={true}
                onAssessmentComplete={handleAssessmentComplete}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyAssessment;