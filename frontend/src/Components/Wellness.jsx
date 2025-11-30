import React, { useState, useEffect } from 'react'
import { CardHeader, CardTitle, Card, CardDescription, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { Alert, AlertDescription } from '../ui/Alert'
import { Badge } from '../ui/Badge'
import { Heart, Brain, Clock, TrendingUp, CheckCircle, Target, Calendar, BarChart3, X, Plus } from 'lucide-react'
import { useJournal } from '../hooks/useJournal.js'
import { useAuth } from '../hooks/useAuth.js'
import { useAssessment } from '../hooks/useAssessment.js'
import { calculateWellnessScore, getWellnessLevel } from '../utils/wellnessCalculator.js'
import StressAssessment from './StressAssessment.jsx'
import DailyJournal from './DailyJournal.jsx'

export default function Wellness() {
  const {
    todayEntry,
    weeklyProgress,
    getJournalEntries,
    getTodayEntry,
    getWeeklyProgress,
    getJournalStats,
  } = useJournal();

  const {
    todayAssessments,
    getTodayAssessments
  } = useAssessment();

  // Calculate wellness score from assessments
  const calculateCurrentWellnessScore = () => {
    const gad7Score = todayAssessments['GAD-7']?.score || 0;
    const phq9Score = todayAssessments['PHQ-9']?.score || 0;

    if (gad7Score === 0 && phq9Score === 0) {
      return 78; // Default score if no assessments
    }

    return calculateWellnessScore(gad7Score, phq9Score);
  };

  const wellnessScore = calculateCurrentWellnessScore();
  const wellnessLevel = getWellnessLevel(wellnessScore);
  const [showStressAssessment, setShowStressAssessment] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)



  // Load data on component mount
  useEffect(() => {
    getTodayEntry();
    getWeeklyProgress();
    getJournalStats();
    getJournalEntries({ page: currentPage, limit: 10 });
    getTodayAssessments();
  }, [currentPage]);

  const handleMoodSelect = (mood) => {
    setCurrentMood(mood)
    // Here you would typically save to backend
  }

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      neutral: '😐',
      sad: '😔',
      anxious: '😰',
      stressed: '😡'
    }
    return moodMap[mood] || '😐'
  }

  return (
    <div className="space-y-6">
      {/* Main Wellness Card */}

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-800 mb-2">
              Wellness Tracking & Mood Analysis
            </CardTitle>
            <CardDescription className="text-red-600 font-medium">
              AI-powered mood tracking with personalized insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hero Section */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-4 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Advanced Wellness Features</h3>
              
            </div>

            {/* Feature Grid */}
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-2">
                {/* Daily Mood Check-in */}
                <div className="group">
                  <Button
                    className="w-full h-20 flex-col gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => handleMoodSelect('check-in')}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Daily Mood</div>
                      <div className="text-xs opacity-90">Check-in</div>
                    </div>
                  </Button>
                </div>

                {/* Stress Assessment */}
                <div className="group">
                  <Button
                    className="w-full h-20 flex-col gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    onClick={() => setShowStressAssessment(true)}
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Stress</div>
                      <div className="text-xs opacity-90">Assessment</div>
                    </div>
                  </Button>
                </div>
              </div>

             
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Today's Progress
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {todayEntry ? '✓' : '?'}
                  </div>
                  <div className="text-gray-600">Journal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(todayAssessments).length}
                  </div>
                  <div className="text-gray-600">Assessments</div>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800 mb-2">
              Current Wellness Score
            </CardTitle>
            <CardDescription className="text-green-600 font-medium">
              AI-powered mood tracking with personalized insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wellness Score Display */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="text-6xl font-bold mt-1 text-green-600 mb-2">{wellnessScore}%</div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <Progress
                value={wellnessScore}
                className="h-3 mt-4 mb-4 bg-green-100"
              />
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full">
                <div className={`w-3 h-3 rounded-full ${wellnessLevel.color.replace('text-', 'bg-')}`}></div>
                <span className={`text-sm font-semibold ${wellnessLevel.color}`}>
                  {wellnessLevel.level} Wellness
                </span>
              </div>
            </div>

            {/* Wellness Message */}
            <div className="text-center">
              <p className="text-gray-700 font-medium leading-relaxed">
                {wellnessScore >= 80 ? '🌟 Excellent! Keep up the great work!' :
                  wellnessScore >= 60 ? '👍 Good progress! You\'re doing well.' :
                    wellnessScore >= 40 ? '🤔 Fair wellness. Consider taking assessments to improve.' :
                      '💪 Let\'s work on improving your wellness together. Try the stress assessments!'}
              </p>
            </div>

            {/* Assessment Results */}
            {(todayAssessments['GAD-7']?.score !== undefined || todayAssessments['PHQ-9']?.score !== undefined) && (
              <div className="bg-blue-50 rounded-lg mt-8 p-4 border border-blue-200">
                <h4 className="text-sm my-4 font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Today's Assessment Results
                </h4>
                <div className="space-y-2">
                  {todayAssessments['GAD-7']?.score !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">GAD-7 (Anxiety):</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {todayAssessments['GAD-7'].score}/21
                      </Badge>
                    </div>
                  )}
                  {todayAssessments['PHQ-9']?.score !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-700">PHQ-9 (Depression):</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {todayAssessments['PHQ-9'].score}/27
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

           
          </CardContent>
        </Card>
      </div>

      {/* Daily Journal Section */}
      <Card>

        <div className="mt-2 pt-2 mx-2 mb-4  ">
          <DailyJournal showAsCard={false} fullManagement={true} />
        </div>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Weekly Wellness Progress
          </CardTitle>
          <CardDescription>Your wellness score over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm font-medium mb-2">{day.day}</div>
                <div className="w-full bg-gray-200 rounded-full h-24 relative">
                  {day.hasEntry ? (
                    <>
                      <div
                        className="bg-gradient-to-t from-green-400 to-green-600 rounded-full absolute bottom-0 w-full"
                        style={{ height: `${day.entry?.wellnessScore || 70}%` }}
                      ></div>
                      <div className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="text-xs font-bold text-white">{day.entry?.wellnessScore || 70}%</span>
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="w-4 h-4 text-green-600 bg-white rounded-full" />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs text-gray-500">No entry</span>
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {day.hasEntry && day.entry?.mood && (
                    <span>{getMoodEmoji(day.entry.mood)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wellness Tips */}
      

      {/* Stress Assessment Popup */}
      {showStressAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Stress Assessment</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStressAssessment(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <StressAssessment
                isPopup={true}
                onAssessmentComplete={() => {
                  getTodayAssessments();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>

  )
}
