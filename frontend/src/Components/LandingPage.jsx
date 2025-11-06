
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';

import LP from "../assets/LandingPageImg.png";
import {
  Heart, Brain, Shield, Users, TrendingUp, Globe, Smartphone, Award,
  CheckCircle, ArrowRight, BarChart3, MessageCircle, Calendar, BookOpen,
  Zap, Lock, Database, Map, Star, Target, AlertTriangle, Phone, Building2,
  Play, Headphones, Clock, UserCheck, Activity, Sparkles, Home, Sun,
  Moon, Coffee, Smile, HandHeart, Lightbulb, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from './Footer';

const LandingPage = ({ onLogin, systemStats }) => {
  const [selectedDemo, setSelectedDemo] = useState('student');
  const [showBanner, setShowBanner] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  const studentChallenges = [
    {
      challenge: "Academic Pressure & Exam Anxiety",
      solution: "AI-powered stress management and study planning tools",
      icon: <BookOpen className="w-5 h-5 text-blue-600" />
    },
    {
      challenge: "Social Isolation & Loneliness",
      solution: "Peer support communities and social connection programs",
      icon: <Users className="w-5 h-5 text-green-600" />
    },
    {
      challenge: "Family Expectations & Career Pressure",
      solution: "Culturally-aware counseling and family therapy resources",
      icon: <Home className="w-5 h-5 text-purple-600" />
    },
    {
      challenge: "Financial Stress & Future Uncertainty",
      solution: "Career guidance and financial wellness support",
      icon: <Target className="w-5 h-5 text-orange-600" />
    }
  ];

  const problemStats = [
    {
      label: "Indian students experiencing mental health challenges",
      value: "74%",
      color: "text-red-600",
      description: "Academic pressure, career uncertainty, and social challenges"
    },
    {
      label: "Students who avoid seeking help due to stigma",
      value: "82%",
      color: "text-orange-600",
      description: "Fear of judgment and lack of confidential resources"
    },
    {
      label: "Colleges lacking  mental health support",
      value: "88%",
      color: "text-yellow-600",
      description: "Limited counselors and outdated intervention methods"
    },
    {
      label: "Improvement with early, accessible intervention",
      value: "96%",
      color: "text-green-600",
      description: "Students show significant improvement with proper support"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-emerald-600" />,
      title: "AI Mental Health Companion",
      description: "24/7 empathetic AI counselor trained on Indian student experiences, offering immediate support in your preferred language with complete understanding of academic and family pressures.",
      metrics: "Available in 15+ languages",
      highlight: "Always available when you need support most"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Anonymous & Confidential Care",
      description: "Connect with professional counselors through our secure, stigma-free booking system. Your identity remains completely protected while you receive the care you deserve.",
      metrics: "100% confidential, HIPAA compliant",
      highlight: "Your privacy is our top priority"
    },
    {
      icon: <HandHeart className="w-8 h-8 text-pink-600" />,
      title: "Peer Support Community",
      description: "Join safe spaces with fellow students who understand your journey. Share experiences, coping strategies, and support each other through moderated, positive communities.",
      metrics: "Moderated 24/7 by trained peers",
      highlight: "You're not alone in this journey"
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      title: "Personalized Wellness Plans",
      description: "AI-generated wellness strategies tailored to your academic schedule, stress patterns, and personal goals. Track your mental health journey with compassionate insights.",
      metrics: "Personalized for each student",
      highlight: "Wellness plans that fit your life"
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-red-600" />,
      title: "Crisis Prevention & Response",
      description: "Advanced early warning system identifies stress patterns and connects you with immediate help. Our crisis response team ensures no student suffers in silence.",
      metrics: "Response time under 2 minutes",
      highlight: "Immediate help when you need it most"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Institution-Wide Wellness",
      description: "Help your institution create a mentally healthy campus environment with comprehensive analytics and evidence-based intervention strategies.",
      metrics: "Data-driven mental health policies",
      highlight: "Building healthier campus communities"
    }
  ];

  const wellnessTools = [
    {
      title: "Mood Check-ins",
      description: "Quick daily assessments to track your emotional well-being",
      icon: <Smile className="w-6 h-6 text-green-600" />
    },
    {
      title: "Breathing Exercises",
      description: "Guided breathing and mindfulness practices for stress relief",
      icon: <Activity className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Sleep Tracking",
      description: "Monitor and improve your sleep patterns for better mental health",
      icon: <Moon className="w-6 h-6 text-indigo-600" />
    },
    {
      title: "Study Stress Manager",
      description: "Tools to manage exam anxiety and academic pressure",
      icon: <BookOpen className="w-6 h-6 text-purple-600" />
    }
  ];

  const testimonials = [
    {
      name: "Priya M.",
      role: "Engineering Student, Mumbai",
      text: "During my toughest semester, the AI companion helped me through panic attacks at 3 AM when no one  was available. It understood my  context and family pressure better than I expected.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Rahul K.",
      role: "Medical Student, Delhi",
      text: "The anonymous booking system was a game-changer. I could finally seek help without worrying about my family or friends finding out. The counselor really understood student life.",
      rating: 5,
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    },
    {
      name: "Anjali S.",
      role: "Arts Student, Bangalore",
      text: "The peer support community made me realize I wasn't alone. Finding other students who faced similar struggles helped me build resilience and find my support network.",
      rating: 5,
      image: "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2"
    }
  ];

  const institutionTestimonials = [
    {
      name: "Dr. Meera Gupta",
      role: "Dean of Student Affairs, IIT Mumbai",
      text: "MEDHYA Pro has transformed our approach to student mental health. Early detection has reduced crisis interventions by 60% while increasing student engagement with counseling services.",
      institution: "IIT Mumbai"
    },
    {
      name: "Prof. Suresh Nair",
      role: "Vice Chancellor",
      text: "The cultural sensitivity and multilingual support make this platform uniquely suited for Indian institutions. Our student satisfaction scores have improved dramatically.",
      institution: "University of Kerala"
    }
  ];

  const crisisResources = [
    { name: "National Crisis Helpline", number: "1-800-273-8255", available: "24/7" },
    { name: "Student Support Chat", number: "Text STUDENT to 741741", available: "24/7" },
    { name: "Campus Emergency", number: "Emergency Services", available: "Immediate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      {/* Crisis Support Banner */}
      {showBanner && (
        <div className="absolute top-0 left-0 w-full bg-gradient-to-r from-red-600/70 to-pink-600/70 text-white py-3 px-4 z-50">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-sm relative">
            {/* Close Button */}
            <button
              onClick={() => setShowBanner(false)}
              className="absolute -right-8 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close banner"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="font-medium">Need immediate help? Crisis support available 24/7</span>
            </div>
            <Button
              size="sm"
              className="bg-white text-red-600 hover:bg-red-50 text-xs px-3 py-1"
            >
              Get Help Now
            </Button>
          </div>
        </div>
      )}
      <div className="space-y-20 pb-8">
        {/* Enhanced Hero Section */}
        <section className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Hero Section */}
          <div className="relative w-full h-screen flex items-center justify-center text-center px-6">
            {/* Background Image - The previously generated image */}
            <img
              src={LP}
              alt="Students supporting each other in a peaceful environment"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay Gradient - Darker for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl space-y-6 text-white">
              <h1 className="text-4xl md:text-7xl font-bold leading-tight">
                <span className="block text-white drop-shadow-lg">Mental Health Support</span>
                <span className="block bg-gradient-to-r from-cyan-300 via-lime-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-lg">
                  Made for Students
                </span>
              </h1>

              <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-gray-100 drop-shadow-md">
                Breaking the stigma around mental health in Indian education. Get 24/7 support,
                connect with understanding peers, and access professional care—all in a safe,
                confidential space designed specifically for students like you.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-full"
                onClick={onLogin}
              >
                <Heart className="w-5 h-5 mr-2" />
                Start Your Wellness Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 pt-8">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>24/7 Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>15+ Languages</span>
            </div>
          </div>

          {/* Live Stats with Animation */}
          <div className="grid gap-6 md:grid-cols-4 max-w-5xl mx-auto mt-12">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-900 mb-1">{systemStats.activeUsers.toLocaleString()}</div>
                <div className="text-sm text-blue-700 font-medium">Students Supported</div>
                <div className="text-xs text-blue-600 mt-1">Growing every day</div>
              </CardContent>
            </Card>
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-900 mb-1">2000+</div>
                <div className="text-sm text-green-700 font-medium">Support Sessions Today</div>
                <div className="text-xs text-green-600 mt-1">Real-time help provided</div>
              </CardContent>
            </Card>
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-900 mb-1">{systemStats.totalInstitutions}</div>
                <div className="text-sm text-purple-700 font-medium">Partner Colleges</div>
                <div className="text-xs text-purple-600 mt-1">Across India</div>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-900 mb-1">97%</div>
                <div className="text-sm text-orange-700 font-medium">Student Satisfaction</div>
                <div className="text-xs text-orange-600 mt-1">Positive experiences</div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Challenges & Solutions */}
        <section className="space-y-16 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">We Understand What Students Face</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto font-light">
              Every challenge you're experiencing is valid. Our platform is built around the real struggles
              Indian students face every day, offering solutions that actually work.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {studentChallenges.map((item, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border-l-4 border-sky-400 rounded-2xl bg-white/80 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-sky-50 rounded-xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-3 text-lg">{item.challenge}</h3>
                      <p className="text-slate-600 mb-4 leading-relaxed">{item.solution}</p>
                      <Badge className="bg-sky-50 text-sky-700 border border-sky-200 rounded-full px-3 py-1">
                        Specialized Support Available
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Problem Statement with Enhanced Visuals */}
        <section className="space-y-16 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">The Reality of Student Mental Health in India</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto font-light">
              Behind every statistic is a student who deserves support, understanding, and hope.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {problemStats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                <CardContent className="space-y-6">
                  <div className={`text-6xl font-bold ${stat.color} mb-4`}>
                    {stat.value}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 leading-relaxed">{stat.label}</h3>
                  <p className="text-slate-600 leading-relaxed">{stat.description}</p>
                  <Progress value={parseInt(stat.value.replace('%', ''))} className="h-3 bg-slate-100" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-rose-50 to-orange-50 p-8 border-rose-200 max-w-5xl mx-auto rounded-2xl">
            <CardContent className="p-0">
              <div className="flex items-start gap-8">
                <div className="p-4 bg-rose-100 rounded-2xl">
                  <AlertTriangle className="w-10 h-10 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-rose-900 mb-6 text-2xl">Why Traditional Approaches Fall Short</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <ul className="space-y-4 text-slate-700">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">Limited counselors for massive student populations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">Cultural stigma preventing help-seeking behavior</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">Reactive rather than preventive mental health care</span>
                      </li>
                    </ul>
                    <ul className="space-y-4 text-slate-700">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">Lack of 24/7 support for urgent mental health needs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">No data-driven insights for institutional planning</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">Language barriers in seeking mental health support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Solution Features with Enhanced Design */}
        <section className="space-y-16 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">Comprehensive Mental Health Ecosystem</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
              Six integrated tools designed with student mental health as the priority,
              not an afterthought
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 group rounded-2xl bg-white/80 backdrop-blur-sm border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-100 transition-colors">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl text-slate-800">{feature.title}</CardTitle>
                  </div>
                  <div className="text-xs text-sky-600 font-semibold mb-2 bg-sky-50 px-3 py-1 rounded-full inline-block">
                    {feature.highlight}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  <Badge variant="outline" className="text-xs border-slate-200 text-slate-600">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {feature.metrics}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Wellness Tools Preview */}
        <section className="space-y-12 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-3xl p-12 mx-4 max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Daily Wellness Tools</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
              Simple, effective tools you can use anytime to support your mental well-being
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {wellnessTools.map((tool, index) => (
              <Card key={index} className="text-center p-8 bg-white/90 backdrop-blur hover:bg-white transition-all duration-300 rounded-2xl border-slate-200">
                <CardContent className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      {tool.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg">{tool.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{tool.description}</p>
                  <Button size="sm" variant="ghost" className="text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-full">
                    Try Now <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Demo Selection with Enhanced UX */}
        <section className="space-y-12 px-4 max-w-6xl mx-auto">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">Experience MEDHYA Pro</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto font-light">
              Choose your perspective to explore how we're transforming mental health support
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-2xl ${selectedDemo === 'student'
              ? 'ring-4 ring-sky-500 bg-gradient-to-br from-sky-50 to-sky-100/50 shadow-xl'
              : 'hover:shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm'
              }`}
              onClick={() => setSelectedDemo('student')}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-4 text-2xl text-slate-800">
                  <div className="p-3 bg-sky-100 rounded-xl">
                    <Users className="w-8 h-8 text-sky-600" />
                  </div>
                  Student Experience
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Discover mental health tools designed specifically for student
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  {[
                    { icon: MessageCircle, text: "AI companion that understands student stress" },
                    { icon: UserCheck, text: "Anonymous counselor appointments" },
                    { icon: Users, text: "Peer support groups and communities" },
                    { icon: Activity, text: "Personal wellness tracking & insights" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-700">
                      <item.icon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 ${selectedDemo === 'student' ? 'bg-sky-600 shadow-lg hover:bg-sky-700' : 'bg-slate-600 hover:bg-slate-700'}`}
                  onClick={onLogin}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Launch Student Portal
                </Button>
              </CardContent>
            </Card>

            <Card className={`cursor-pointer transition-all duration-300 transform hover:scale-105 rounded-2xl ${selectedDemo === 'admin'
              ? 'ring-4 ring-violet-500 bg-gradient-to-br from-violet-50 to-violet-100/50 shadow-xl'
              : 'hover:shadow-lg border-slate-200 bg-white/80 backdrop-blur-sm'
              }`}
              onClick={() => setSelectedDemo('admin')}>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-4 text-2xl text-slate-800">
                  <div className="p-3 bg-violet-100 rounded-xl">
                    <BarChart3 className="w-8 h-8 text-violet-600" />
                  </div>
                  Institution Dashboard
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Comprehensive oversight and analytics for administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  {[
                    { icon: BarChart3, text: "Real-time mental health trends and analytics" },
                    { icon: AlertTriangle, text: "Early warning system for at-risk students" },
                    { icon: Building2, text: "Multi-campus management capabilities" },
                    { icon: Target, text: "Predictive intervention recommendations" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-700">
                      <item.icon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span className="leading-relaxed">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/admin">
                  <Button
                    className={`w-full py-4 rounded-2xl font-medium transition-all duration-300 ${selectedDemo === 'admin' ? 'bg-violet-600 shadow-lg hover:bg-violet-700' : 'bg-slate-600 hover:bg-slate-700'}`}
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    Access Admin Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Student Testimonials */}
        <section className="space-y-8 px-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-gray-900">Stories from Students Like You</h2>
            <p className="text-lg text-gray-600">
              Real experiences from students who found support, hope, and healing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 space-y-6">
                  <div className="flex gap-1 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Institution Testimonials */}
        <section className="space-y-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 mx-4 max-w-7xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Trusted by Leading Institutions</h2>
            <p className="text-lg text-gray-600">
              Educational leaders across India are seeing transformational results
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {institutionTestimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur">
                <CardContent className="p-8 space-y-4">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-700 italic leading-relaxed text-lg">
                    "{testimonial.text}"
                  </blockquote>
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600 font-medium">{testimonial.institution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="text-center space-y-8 py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl text-white mx-4">
          <div className="space-y-6 px-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Heart className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold">Your Mental Health Matters</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Take the first step towards better mental health. Join thousands of students who've found
              support, understanding, and hope through our platform.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center px-8">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              onClick={onLogin}
            >
              <Heart className="w-5 h-5 mr-2" />
              Begin Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg transition-all duration-200"
              onClick={onLogin}
            >
              <Headphones className="w-5 h-5 mr-2" />
              Talk to Support
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12 px-8">
            {[
              { icon: CheckCircle, text: "Free to start", desc: "No cost barrier to mental health" },
              { icon: Clock, text: "24/7 support", desc: "Help when you need it most" },
              { icon: Shield, text: "Completely private", desc: "Your information stays safe" },
              { icon: Heart, text: "Judgement-free", desc: "Safe space for all students" }
            ].map((item, i) => (
              <div key={i} className="text-center space-y-2">
                <item.icon className="w-6 h-6 mx-auto text-white" />
                <div className="font-semibold text-sm">{item.text}</div>
                <div className="text-xs text-blue-100">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety & Support Information */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 mx-4 max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Your Safety & Well-being Come First</h2>

            <div className="grid gap-6 md:grid-cols-3">
              {crisisResources.map((resource, index) => (
                <Card key={index} className="bg-white border-green-200 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <Phone className="w-8 h-8 text-green-600 mx-auto" />
                    <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                    <p className="text-sm font-medium text-green-700">{resource.number}</p>
                    <Badge className="bg-green-100 text-green-800">
                      {resource.available}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-green-100 rounded-xl p-6 text-center">
              <p className="text-green-800 font-medium">
                If you're experiencing thoughts of self-harm or suicide, please reach out immediately.
                You matter, your life has value, and help is always available.
              </p>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;