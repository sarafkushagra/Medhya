import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  Heart, Brain, Activity, Users, Stethoscope, Pill, FileText,
  Truck, ArrowRight, Shield, Clock, Phone, Star, CheckCircle,
  Building2, Microscope, Baby, Bone, Sparkles, Zap
} from 'lucide-react';
import Footer from './Footer';
import LP from "../assets/LandingPageImg.png"; // Keeping the image for now, or we can use a new one if needed
import { Link } from 'react-router-dom';

const LandingPage = ({ onLogin }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const specialties = [
    {
      title: "Mental Health",
      icon: <Brain className="w-8 h-8 text-purple-600" />,
      description: "Expert counseling and therapy for anxiety, depression, and stress.",
      color: "bg-purple-50 border-purple-100",
      textColor: "text-purple-900"
    },
    {
      title: "Neurology",
      icon: <Activity className="w-8 h-8 text-blue-600" />,
      description: "Advanced care for neurological disorders and brain health.",
      color: "bg-blue-50 border-blue-100",
      textColor: "text-blue-900"
    },
    {
      title: "Orthopedics",
      icon: <Bone className="w-8 h-8 text-orange-600" />,
      description: "Comprehensive treatment for bone, joint, and muscle conditions.",
      color: "bg-orange-50 border-orange-100",
      textColor: "text-orange-900"
    },
    {
      title: "Gynecology",
      icon: <Baby className="w-8 h-8 text-pink-600" />,
      description: "Women's health, pregnancy care, and reproductive wellness.",
      color: "bg-pink-50 border-pink-100",
      textColor: "text-pink-900",
      badge: "Coming Soon"
    }
  ];

  const features = [
    {
      role: "For Patients",
      icon: <Users className="w-10 h-10 text-emerald-600" />,
      title: "Complete Care Journey",
      description: "From booking appointments to getting medicines delivered and viewing reports - everything in one place.",
      benefits: ["Instant Doctor Access", "Medicine Delivery", "Digital Health Records"],
      action: "Find a Doctor",
      color: "from-emerald-50 to-teal-50",
      control : "/login"
    },
    {
      role: "For Doctors",
      icon: <Stethoscope className="w-10 h-10 text-blue-600" />,
      title: "Practice Management",
      description: "Streamline your practice with our advanced dashboard. Manage appointments, patients, and prescriptions effortlessly.",
      benefits: ["Smart Scheduling", "Digital Prescriptions", "Patient Analytics"],
      action: "Join as Doctor",
      color: "from-blue-50 to-indigo-50",
      control : "/login"
    },
    {
      role: "For Suppliers",
      icon: <Truck className="w-10 h-10 text-amber-600" />,
      title: "Supply Chain Partner",
      description: "Connect directly with patients and doctors. Manage inventory and orders through a dedicated supplier dashboard.",
      benefits: ["Order Management", "Inventory Tracking", "Direct Payments"],
      action: "Partner with Us",
      color: "from-amber-50 to-orange-50",
      control : "/supplier-login"
    }
  ];

  const stats = [
    { value: "10k+", label: "Patients Healed", icon: <Heart className="w-5 h-5 text-rose-500" /> },
    { value: "500+", label: "Expert Doctors", icon: <Stethoscope className="w-5 h-5 text-blue-500" /> },
    { value: "24/7", label: "Support Available", icon: <Clock className="w-5 h-5 text-green-500" /> },
    { value: "100%", label: "Secure Data", icon: <Shield className="w-5 h-5 text-purple-500" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src={LP}
            alt="Medical Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>

        <div className={`relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-3xl space-y-8">
           
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Our Priority
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              Medhya is your complete healthcare ecosystem. Connect with top specialists in Mental Health, Neurology, and Orthopedics.
              Get medicines delivered, track reports, and manage your well-being—all in one secure platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-blue-600/20"
                onClick={onLogin}
              >
                Book Appointment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg rounded-full"
              >
                Explore Services
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-slate-800/50">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-2 text-2xl font-bold text-white">
                    {stat.icon}
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Specialized Care For You</h2>
            <p className="text-lg text-slate-600">
              Expert doctors and advanced treatments across multiple specialties.
              We bring world-class healthcare to your fingertips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((spec, index) => (
              <Card key={index} className={`border-none shadow-sm hover:shadow-xl transition-all duration-300 ${spec.color}`}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      {spec.icon}
                    </div>
                    {spec.badge && (
                      <Badge variant="secondary" className="bg-white/50 text-slate-600">
                        {spec.badge}
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold mb-2 ${spec.textColor}`}>{spec.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                  <Button variant="ghost" className="p-0 hover:bg-transparent text-slate-900 font-medium group">
                    Learn more <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">One Platform, Endless Possibilities</h2>
            <p className="text-lg text-slate-600">
              Connecting the entire healthcare ecosystem for seamless care delivery.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`relative overflow-hidden border-none shadow-lg bg-gradient-to-br ${feature.color}`}>
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl w-fit shadow-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">{feature.role}</div>
                      <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                        <CheckCircle className="w-5 h-5 text-slate-900" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                    <Link to={feature.control}>
                  <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 py-6 rounded-xl shadow-lg">
                    {feature.action}
                  </Button>
                    </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust/Safety Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Healthcare You Can Trust <br />
                <span className="text-blue-400">Available 24/7</span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                We prioritize your safety and privacy above all else. Our platform is HIPAA compliant and
                uses state-of-the-art encryption to keep your medical data secure.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Secure & Private</h4>
                    <p className="text-slate-400 text-sm">End-to-end encrypted consultations</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg">
                    <Award className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Certified Doctors</h4>
                    <p className="text-slate-400 text-sm">Verified specialists only</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
                Learn About Our Safety Standards
              </Button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
              <Card className="bg-slate-800 border-slate-700 p-8 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">15+</div>
                    <div className="text-xs text-slate-400">Specialties</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-emerald-400 mb-1">50k+</div>
                    <div className="text-xs text-slate-400">Consultations</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">98%</div>
                    <div className="text-xs text-slate-400">Satisfaction</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl text-center">
                    <div className="text-3xl font-bold text-orange-400 mb-1">24/7</div>
                    <div className="text-xs text-slate-400">Emergency Care</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function Award({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}

export default LandingPage;