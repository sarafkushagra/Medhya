import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Progress } from '../ui/Progress.jsx';
import {
  MessageCircle, Calendar, Users, Shield, Heart, Brain, Phone,
  TrendingUp, Globe, Zap, CheckCircle, Target, Smartphone, AlertTriangle, Lock,
  BookOpen, X, Badge, Gamepad2, Puzzle, Smile, Leaf, BarChart3
} from 'lucide-react';
import ResourceContent from './ResourceContent.jsx';
import AssessmentGraph from './AssessmentGraph.jsx';
import DailyJournal from './DailyJournal.jsx';
import DailyAssessment from './DailyAssessment.jsx';
import MoodTrackerModal from './MoodTrackerModal.jsx';
import { moodAPI } from '../services/api.js';
import { useJournal } from '../hooks/useJournal.js';

const wellnessTips = [
  "Take a 5-minute breathing break every hour",
  "Practice gratitude by writing 3 things you're thankful for",
  "Get 7-9 hours of quality sleep tonight",
  "Take a 10-minute walk outside",
  "Connect with a friend or family member"
]


// Fake data for games
const games = [
  { name: 'Breathing Exercise', icon: Heart, badge: 'New' },
  { name: 'Mindfulness Puzzle', icon: Puzzle, badge: 'Recommended' },
  { name: 'Mood Tracker', icon: Smile, badge: 'Popular' },
  { name: 'Stress Relief', icon: Leaf, badge: 'New' }
];

const StudentDashboard = () => {
  const [isMoodTrackerModalOpen, setIsMoodTrackerModalOpen] = useState(false);
  const [todaysMood, setTodaysMood] = useState(null);
  const [isLoadingMood, setIsLoadingMood] = useState(true);

  const { weeklyProgress, getWeeklyProgress } = useJournal();

  // Fetch today's mood on component mount
  useEffect(() => {
    const fetchTodaysMood = async () => {
      try {
        const response = await moodAPI.getTodaysMood();
        setTodaysMood(response.data);
      } catch (error) {
        // If no mood logged today, set to null
        setTodaysMood(null);
      } finally {
        setIsLoadingMood(false);
      }
    };

    fetchTodaysMood();
    getWeeklyProgress();
  }, []);

  // Handle mood submission
  const handleMoodSubmit = async (moodData) => {
    try {
      if (todaysMood) {
        // Update existing mood
        await moodAPI.updateTodaysMood(moodData);
      } else {
        // Log new mood
        await moodAPI.logMood(moodData);
      }

      // Refetch today's mood to ensure state is up to date
      const response = await moodAPI.getTodaysMood();
      setTodaysMood(response.data);
    } catch (error) {
      console.error('Error submitting mood:', error);
      throw error;
    }
  };

  // Handle mood tracker button click
  const handleMoodTrackerClick = () => {
    setIsMoodTrackerModalOpen(true);
  };

  const getMoodEmoji = (mood) => {
    const moodMap = {
      happy: '😊',
      neutral: '😐',
      sad: '😔',
      anxious: '😰',
      stressed: '😡'
    }
    return moodMap[mood] || '😐'
  };
  // Full Dashboard Content for Complete Profiles
  const FullDashboardContent = () => (
    <div className="space-y-6">



      {/* Resources Content */}
      <ResourceContent />

      {/* Feature Cards */}
      <div className="grid flex-row gap-6 md:grid-cols-2">
        <div className="grid flex-cols gap-6 md:grid-row-2">
          <div className="grid flex-row gap-6 md:grid-cols-2">
            <DailyAssessment />
            {/* Mood Check-in Card */}
            <Card className="border-blue-200 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-blue-600" />
                  Mood Check-in
                </CardTitle>
                <CardDescription>
                  {isLoadingMood ? 'Loading...' : todaysMood ? `Today's mood: ${todaysMood.moodEmoji}` : 'How are you feeling today?'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {isLoadingMood ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      <p className="text-sm text-gray-600 mt-2">Loading mood...</p>
                    </div>
                  ) : todaysMood ? (
                    <div className="text-center mt-8  py-4">
                      <div className="text-4xl mb-2">{todaysMood.moodEmoji}</div>
                      <p className="text-sm text-gray-600 capitalize">{todaysMood.mood}</p>
                      {todaysMood.note && (
                        <p className="text-xs text-gray-500 mt-2 italic">"{todaysMood.note}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center mt-8 py-4">
                      <Smile className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No mood logged today</p>
                    </div>
                  )}
                  <Button
                    onClick={handleMoodTrackerClick}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    disabled={isLoadingMood}
                  >
                    {todaysMood ? 'Update Mood' : 'Check In'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid flex-cols gap-6 md:grid-row-1">
            <DailyJournal />
          </div>
        </div>

        <Card className="border-purple-200">
          <AssessmentGraph />
        </Card>
      </div>
      {/* Weekly Wellness Progress */}
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
      <div className="grid flex-row gap-6 md:grid-cols-2">
        {/* Play Games */}
        <div className="grid flex-row gap-6 md:grid-cols-1">
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-lg">
                <Zap className="w-5 h-5 text-emerald-600" />
                Wellness Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                {games.map((game, index) => (
                  <div key={index} className="relative bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <game.icon className="w-8 h-8 text-emerald-600 mb-2" />
                    <div className="text-sm font-medium text-gray-800">{game.name}</div>
                    <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${game.badge === 'New' ? 'bg-green-100 text-green-800' :
                      game.badge === 'Recommended' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                      {game.badge}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-8 text-emerald-600 hover:text-emerald-700">
                Explore All Interventions
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid flex-row gap-6 md:grid-cols-1">
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Today's Wellness Tips
              </CardTitle>
              <CardDescription>Personalized recommendations for better mental health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wellnessTips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <FullDashboardContent />

      {/* Mood Tracker Modal */}
      <MoodTrackerModal
        isOpen={isMoodTrackerModalOpen}
        onClose={() => setIsMoodTrackerModalOpen(false)}
        onSubmit={handleMoodSubmit}
        todaysMood={todaysMood}
      />
    </div>
  );
};

export default StudentDashboard;