import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Alert, AlertDescription } from '../ui/Alert.jsx';
import { Progress } from '../ui/Progress.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import {
  MessageCircle, Calendar, Users, Shield, Heart, Brain, Phone,
  TrendingUp, Globe, Zap, CheckCircle, Target, Smartphone, AlertTriangle, Lock,
  BookOpen, X, Badge, Gamepad2, Puzzle, Smile, Leaf
} from 'lucide-react';
import ResourceContent from './ResourceContent.jsx';
import AssessmentGraph from './AssessmentGraph.jsx';
import DailyJournal from './DailyJournal.jsx';

// Fake data for games
const games = [
  { name: 'Breathing Exercise', icon: Heart, badge: 'New' },
  { name: 'Mindfulness Puzzle', icon: Puzzle, badge: 'Recommended' },
  { name: 'Mood Tracker', icon: Smile, badge: 'Popular' },
  { name: 'Stress Relief', icon: Leaf, badge: 'New' }
];

const StudentDashboard = () => {
  // Full Dashboard Content for Complete Profiles
  const FullDashboardContent = () => (
    <div className="space-y-6">


      {/* Resources Content */}
      <ResourceContent />

      {/* Play Games */}
      <div className="grid flex-row gap-6 md:grid-cols-1">
        <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-emerald-600" />
                Wellness Games
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {games.map((game, index) => (
                  <div key={index} className="relative bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
                    <game.icon className="w-8 h-8 text-emerald-600 mb-2" />
                    <div className="text-sm font-medium text-gray-800">{game.name}</div>
                    <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
                      game.badge === 'New' ? 'bg-green-100 text-green-800' :
                      game.badge === 'Recommended' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {game.badge}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-4 text-emerald-600 hover:text-emerald-700">
                Explore All Interventions
              </Button>
            </CardContent>
          </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid flex-row gap-6 md:grid-cols-2">


        <Card className="border-purple-200">
          <AssessmentGraph />
        </Card>

        <DailyJournal />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <FullDashboardContent />
    </div>
  );
};

export default StudentDashboard;