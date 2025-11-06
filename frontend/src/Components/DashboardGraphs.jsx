import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, Users, Calendar, BookOpen } from 'lucide-react';

// Dummy data for Weekly Session Attendance
const weekendSessionData = [
  { day: 'Mon', sessions: 8 },
  { day: 'Tue', sessions: 12 },
  { day: 'Wed', sessions: 15 },
  { day: 'Thu', sessions: 10 },
  { day: 'Fri', sessions: 18 },
  { day: 'Sat', sessions: 22 },
  { day: 'Sun', sessions: 16 },
];

// Dummy data for Resources Engagement
const resourcesEngagementData = [
  { resource: 'Anxiety Guide', views: 245, downloads: 89, rating: 4.2 },
  { resource: 'Depression Help', views: 198, downloads: 67, rating: 4.5 },
  { resource: 'Stress Management', views: 312, downloads: 124, rating: 4.1 },
  { resource: 'Sleep Hygiene', views: 156, downloads: 45, rating: 4.3 },
  { resource: 'Mindfulness', views: 278, downloads: 98, rating: 4.4 },
  { resource: 'Crisis Support', views: 189, downloads: 76, rating: 4.6 },
];

// Colors for charts
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const DashboardGraphs = () => {
  return (
    <div className="grid flex flex-col gap-6 md:grid-cols-1">
      {/* Weekend Session Types Chart */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
            <Calendar className="w-6 h-6 text-blue-600" />
            Weekly Session Attendance
          </CardTitle>
          <p className="text-sm text-gray-600">Total sessions attended per day</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekendSessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" fill="#3b82f6" name="Sessions Attended" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resources Engagement Chart */}
      <Card className="bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 text-xl font-bold">
            <BookOpen className="w-6 h-6 text-green-600" />
            Resources Engagement
          </CardTitle>
          <p className="text-sm text-gray-600">Resource usage and popularity metrics</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={resourcesEngagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="resource" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="views"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Views"
              />
              <Area
                type="monotone"
                dataKey="downloads"
                stackId="2"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Downloads"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Insights Cards
      <Card className="bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-bold">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Session Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Peak Hours</span>
              <span className="font-semibold text-purple-600">2-4 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Most Popular Day</span>
              <span className="font-semibold text-purple-600">Saturday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Session Duration</span>
              <span className="font-semibold text-purple-600">45 mins</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-bold">
            <Users className="w-5 h-5 text-indigo-600" />
            Student Demographics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: '18-24', value: 35, color: '#10b981' },
                  { name: '25-34', value: 28, color: '#3b82f6' },
                  { name: '35-44', value: 22, color: '#f59e0b' },
                  { name: '45+', value: 15, color: '#ef4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {[
                  { name: '18-24', value: 35, color: '#10b981' },
                  { name: '25-34', value: 28, color: '#3b82f6' },
                  { name: '35-44', value: 22, color: '#f59e0b' },
                  { name: '45+', value: 15, color: '#ef4444' }
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default DashboardGraphs;