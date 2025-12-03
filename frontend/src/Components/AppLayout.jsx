// src/Components/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  MessageCircle, Calendar, BookOpen, Users, BarChart3, Heart, AlertTriangle, Zap, Building2,
  Database,
  Box, Brain,
  BriefcaseMedical
} from 'lucide-react';
import ChatBot from '../ui/ChatBot.jsx';
import Navbar from './Navbar.jsx';
import LP from '../assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';

const studentNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  // { path: '/neurodashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/chat', label: 'Medhya Support', icon: MessageCircle },
  { path: '/doctor', label: 'Doctor', icon: BriefcaseMedical },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
  { path: '/games', label: 'Cognitive Games', icon: Brain },
  { path: '/community', label: 'Community', icon: Users },
  { path: '/reports', label: 'Report', icon: Database },
  { path: '/delivery', label: 'Market Place', icon: Box },
];

const adminNavItems = [
  { path: '/admin', label: 'Analytics', icon: BarChart3 },
  { path: '/crisis', label: 'Crisis Management', icon: AlertTriangle },
  { path: '/innovation', label: 'AI Innovation', icon: Zap },
  { path: '/institutions', label: 'Institutions', icon: Building2 },
];

const AppLayout = ({ userRole, user, onLogout, systemStats, onRefreshMoodData }) => {
  const location = useLocation();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const navItems = userRole === 'student' ? studentNavItems : adminNavItems;

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-white shadow-lg transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-16'} flex flex-col h-full`}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-center cursor-pointer" onClick={toggleSidebar}>
          <img src={LP} alt="Medhya Logo" className="w-12 h-12 object-contain rounded-md" />
          {isSidebarExpanded && (
            <div className="ml-3 text-slate-800">
              <h2 className="font-bold text-xl tracking-wide">MEDHYA</h2>
              <p className="text-xs text-slate-600 opacity-80">A-Z Wellness Platform</p>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-100 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                title={!isSidebarExpanded ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-slate-200">
          <Link
            to="/profile"
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors text-slate-600 hover:bg-slate-100 ${
              location.pathname === '/profile' ? 'bg-emerald-100 text-emerald-700' : ''
            }`}
            title={!isSidebarExpanded ? 'My Profile' : ''}
          >
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage src={user?.imageUrl || user?.profilePicture} alt={user?.firstName || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                {user?.firstName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {isSidebarExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-500 capitalize">{userRole}</p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          key={user?.id || 'guest'}
          userRole={userRole}
          user={user}
          onLogout={onLogout}
          systemStats={systemStats}
          onRefreshMoodData={onRefreshMoodData}
        />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>

      <ChatBot 
        isOpen={isChatBotOpen} 
        onToggle={() => setIsChatBotOpen(!isChatBotOpen)} 
      />
    </div>
  );
};

export default AppLayout;