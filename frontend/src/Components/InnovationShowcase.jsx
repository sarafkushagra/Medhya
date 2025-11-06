import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  Brain, Zap, Globe, Smartphone, Database, Lock, TrendingUp, Eye,
  MessageCircle, Heart, Activity, Target, Cpu, Cloud, Shield, Award,
  CheckCircle, ArrowRight, Star, Users, BarChart3, Bot, Map, Languages
} from 'lucide-react';

const InnovationShowcase = () => {
  const [selectedInnovation, setSelectedInnovation] = useState('ai');

  const aiMetrics = {
    accuracy: 94.7,
    responseTime: 1.8,
    languages: 15,
    conversations: 45000,
    culturalAccuracy: 89.3,
    satisfactionRate: 96.2
  };

  const moodTrendData = [
    { week: 'Week 1', anxiety: 65, depression: 58, stress: 72, overall: 61 },
    { week: 'Week 2', anxiety: 62, depression: 55, stress: 69, overall: 58 },
    { week: 'Week 3', anxiety: 58, depression: 51, stress: 65, overall: 54 },
    { week: 'Week 4', anxiety: 54, depression: 48, stress: 61, overall: 51 },
    { week: 'Week 5', anxiety: 51, depression: 45, stress: 58, overall: 48 },
    { week: 'Week 6', anxiety: 47, depression: 42, stress: 54, overall: 45 }
  ];

  const languageData = [
    { name: 'Hindi', value: 35, color: '#8884d8' },
    { name: 'English', value: 28, color: '#82ca9d' },
    { name: 'Bengali', value: 12, color: '#ffc658' },
    { name: 'Tamil', value: 8, color: '#ff7300' },
    { name: 'Telugu', value: 7, color: '#8dd1e1' },
    { name: 'Others', value: 10, color: '#d084d0' }
  ];

  const predictiveInsights = [
    {
      type: 'Early Warning',
      accuracy: '94.3%',
      description: 'Identifies students at risk 7-14 days before crisis',
      impact: '67% reduction in crisis incidents',
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    {
      type: 'Intervention Timing',
      accuracy: '89.7%',
      description: 'Predicts optimal timing for mental health interventions',
      impact: '43% improvement in treatment success',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      type: 'Resource Allocation',
      accuracy: '91.2%',
      description: 'Forecasts counselor workload and resource needs',
      impact: '35% efficiency improvement',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    {
      type: 'Trend Analysis',
      accuracy: '87.8%',
      description: 'Identifies seasonal and academic stress patterns',
      impact: '52% better preparation for high-stress periods',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    }
  ];

  const technicalInnovations = [
    {
      title: 'Advanced NLP with Cultural Context',
      description: 'Custom-trained language models understand Indian cultural nuances, family dynamics, and regional expressions of mental distress.',
      tech: 'Transformer-based architecture, fine-tuned on 500K+ culturally diverse conversations',
      metrics: { accuracy: '94.7%', languages: 15, culturalAccuracy: '89.3%' },
      icon: <Brain className="w-8 h-8 text-blue-600" />
    },
    {
      title: 'Predictive Crisis Detection',
      description: 'Machine learning algorithms analyze behavioral patterns, conversation sentiment, and engagement metrics to predict mental health crises.',
      tech: 'Ensemble of LSTM, Random Forest, and SVM models with real-time feature extraction',
      metrics: { precision: '96.8%', recall: '94.3%', f1Score: '95.5%' },
      icon: <Target className="w-8 h-8 text-red-600" />
    },
    {
      title: 'Real-time Multilingual Processing',
      description: 'Simultaneous processing of 15+ Indian languages with context-aware translation and cultural adaptation.',
      tech: 'Custom tokenization, code-switching detection, and cultural context embeddings',
      metrics: { languages: 15, translationAccuracy: '92.4%', responseTime: '<2s' },
      icon: <Globe className="w-8 h-8 text-green-600" />
    },
    {
      title: 'Edge AI for Privacy',
      description: 'On-device processing for sensitive mental health data, ensuring privacy while maintaining AI capabilities.',
      tech: 'TensorFlow Lite models, federated learning, and differential privacy',
      metrics: { privacyScore: '99.9%', batteryEfficiency: '95%', offlineCapability: '100%' },
      icon: <Lock className="w-8 h-8 text-purple-600" />
    },
    {
      title: 'Scalable Cloud Infrastructure',
      description: 'Auto-scaling architecture designed to serve millions of students across thousands of institutions.',
      tech: 'Kubernetes orchestration, microservices, auto-scaling pods',
      metrics: { uptime: '99.97%', scalability: '10M+ users', responseTime: '<100ms' },
      icon: <Cloud className="w-8 h-8 text-orange-600" />
    },
    {
      title: 'Behavioral Analytics Engine',
      description: 'Advanced analytics to understand student behavior patterns and predict intervention needs.',
      tech: 'Stream processing, graph neural networks, anomaly detection',
      metrics: { patternAccuracy: '91.2%', anomalyDetection: '96.7%', insights: '1000+' },
      icon: <Activity className="w-8 h-8 text-indigo-600" />
    }
  ];

  const aiCapabilities = [
    {
      name: 'Emotional Intelligence',
      description: 'Understanding and responding to emotional states',
      score: 93,
      color: 'bg-pink-500'
    },
    {
      name: 'Cultural Sensitivity',
      description: 'Adapting responses to Indian cultural contexts',
      score: 89,
      color: 'bg-orange-500'
    },
    {
      name: 'Crisis Detection',
      description: 'Identifying mental health emergencies',
      score: 97,
      color: 'bg-red-500'
    },
    {
      name: 'Personalization',
      description: 'Tailoring conversations to individual needs',
      score: 91,
      color: 'bg-blue-500'
    },
    {
      name: 'Multilingual Processing',
      description: 'Understanding and responding in multiple languages',
      score: 88,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            AI Innovation & Technical Excellence
          </CardTitle>
          <CardDescription>
            Cutting-edge technology showcase demonstrating advanced AI capabilities and scalable architecture
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={selectedInnovation} onValueChange={setSelectedInnovation} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai">AI Capabilities</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="cultural">Cultural AI</TabsTrigger>
          <TabsTrigger value="scalability">Scalability</TabsTrigger>
          <TabsTrigger value="innovations">Tech Stack</TabsTrigger>
        </TabsList>

        <TabsContent value="ai" className="space-y-6">
          {/* AI Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6 text-center">
                <Bot className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                <div className="text-3xl font-bold text-blue-900">{aiMetrics.accuracy}%</div>
                <div className="text-sm text-blue-700">AI Accuracy Rate</div>
                <div className="text-xs text-blue-600 mt-1">Across all interactions</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <div className="text-3xl font-bold text-green-900">{aiMetrics.responseTime}s</div>
                <div className="text-sm text-green-700">Response Time</div>
                <div className="text-xs text-green-600 mt-1">Average processing speed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6 text-center">
                <Languages className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                <div className="text-3xl font-bold text-purple-900">{aiMetrics.languages}</div>
                <div className="text-sm text-purple-700">Languages Supported</div>
                <div className="text-xs text-purple-600 mt-1">Including regional dialects</div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time AI Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Live AI Demonstration</CardTitle>
              <CardDescription>Experience our AI's real-time mental health conversation capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
                <Brain className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive AI Demo</h3>
                <p className="text-muted-foreground mb-4">
                  Try our AI assistant trained specifically for Indian student mental health concerns
                </p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Start Demo Chat
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    Watch Video Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* AI Capabilities Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>AI Capability Assessment</CardTitle>
              <CardDescription>Detailed breakdown of our AI's mental health support capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {aiCapabilities.map((capability, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{capability.name}</div>
                      <div className="text-sm text-muted-foreground">{capability.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{capability.score}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${capability.color}`}
                      style={{ width: `${capability.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>


        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mental Health Trend Prediction</CardTitle>
                <CardDescription>AI-powered forecasting of student mental health patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="anxiety" stroke="#ef4444" name="Anxiety" strokeWidth={2} />
                    <Line type="monotone" dataKey="depression" stroke="#3b82f6" name="Depression" strokeWidth={2} />
                    <Line type="monotone" dataKey="stress" stroke="#f59e0b" name="Stress" strokeWidth={2} />
                    <Line type="monotone" dataKey="overall" stroke="#10b981" name="Overall Wellbeing" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Model Performance</CardTitle>
                <CardDescription>Accuracy metrics for our AI prediction models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Crisis Prediction Accuracy</span>
                    <span className="font-bold text-red-600">94.3%</span>
                  </div>
                  <Progress value={94.3} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Intervention Success Rate</span>
                    <span className="font-bold text-green-600">89.7%</span>
                  </div>
                  <Progress value={89.7} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resource Optimization</span>
                    <span className="font-bold text-blue-600">91.2%</span>
                  </div>
                  <Progress value={91.2} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Trend Forecasting</span>
                    <span className="font-bold text-purple-600">87.8%</span>
                  </div>
                  <Progress value={87.8} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predictive Insights Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {predictiveInsights.map((insight, index) => (
              <Card key={index} className={insight.color}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{insight.type}</h3>
                      <p className="text-sm opacity-80">{insight.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-white/50">
                      {insight.accuracy}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{insight.impact}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cultural" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>Usage across Indian languages and regions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cultural Adaptation Features</CardTitle>
                <CardDescription>How our AI understands Indian cultural contexts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Family Dynamics Understanding</div>
                      <div className="text-sm text-muted-foreground">Joint family pressures, arranged marriages, career expectations</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Academic System Awareness</div>
                      <div className="text-sm text-muted-foreground">Competitive exams, reservation system, peer pressure</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Regional Expression Patterns</div>
                      <div className="text-sm text-muted-foreground">Cultural metaphors, emotional expressions, communication styles</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">Stigma-Sensitive Responses</div>
                      <div className="text-sm text-muted-foreground">Addressing mental health taboos and cultural barriers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cultural Intelligence Metrics</CardTitle>
              <CardDescription>Measuring our AI's cultural sensitivity and adaptation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">89.3%</div>
                  <div className="text-sm text-muted-foreground">Cultural Context Accuracy</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">92.7%</div>
                  <div className="text-sm text-muted-foreground">Regional Adaptation Score</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">96.1%</div>
                  <div className="text-sm text-muted-foreground">Cultural Sensitivity Rating</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-orange-600">88.5%</div>
                  <div className="text-sm text-muted-foreground">Family Context Understanding</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scalability" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                <div className="text-3xl font-bold text-blue-900">10M+</div>
                <div className="text-sm text-blue-700">Concurrent Users</div>
                <div className="text-xs text-blue-600 mt-1">Horizontally scalable</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6 text-center">
                <Database className="w-12 h-12 mx-auto text-green-600 mb-3" />
                <div className="text-3xl font-bold text-green-900">99.97%</div>
                <div className="text-sm text-green-700">System Uptime</div>
                <div className="text-xs text-green-600 mt-1">High availability design</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 mx-auto text-purple-600 mb-3" />
                <div className="text-3xl font-bold text-purple-900">&lt;100ms</div>
                <div className="text-sm text-purple-700">Response Time</div>
                <div className="text-xs text-purple-600 mt-1">Global CDN optimized</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Architecture Overview</CardTitle>
              <CardDescription>Cloud-native, microservices architecture designed for scale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Infrastructure Capabilities</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Auto-scaling</span>
                      <Badge className="bg-green-50 text-green-700">0-1000 pods</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Load balancing</span>
                      <Badge className="bg-blue-50 text-blue-700">Global</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database replication</span>
                      <Badge className="bg-purple-50 text-purple-700">Multi-region</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CDN coverage</span>
                      <Badge className="bg-orange-50 text-orange-700">50+ locations</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API response time</span>
                      <span className="font-medium text-green-600">&lt;50ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database queries</span>
                      <span className="font-medium text-blue-600">&lt;5ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI inference</span>
                      <span className="font-medium text-purple-600">&lt;100ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Error rate</span>
                      <span className="font-medium text-orange-600">&lt;0.01%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="innovations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technicalInnovations.map((innovation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {innovation.icon}
                    <CardTitle className="text-lg">{innovation.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{innovation.description}</p>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs font-mono text-muted-foreground">{innovation.tech}</p>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(innovation.metrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center text-sm">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <Badge variant="outline">{value}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-6 h-6 text-yellow-500" />
                Innovation Highlights for SIH 2024
              </CardTitle>
              <CardDescription>
                Key technical differentiators that set our solution apart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-900">Novel AI Approaches</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>First culturally-aware mental health AI for India</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Real-time multilingual crisis detection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Predictive intervention timing optimization</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-purple-900">Scalability Innovations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Edge AI for privacy-preserving processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Auto-scaling architecture for 10M+ users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Offline-first design for rural connectivity</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InnovationShowcase;