// src/Components/AppLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  MessageCircle, Calendar, BookOpen, Users, BarChart3, Heart, AlertTriangle, Zap, Building2,
  Database,
  Box, Brain,
  BriefcaseMedical,
  Menu,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import ChatBot from '../ui/ChatBot.jsx';
import LP from '../assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/Avatar';
import { Button } from '../ui/Button';

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
    <div className="h-screen bg-slate-50 flex overflow-hidden font-['Poppins',sans-serif]">
      {/* Sidebar */}
      <aside
        className={`relative z-20 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-72' : 'w-20'} flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-2xl`}
      >
        {/* Decorative Background Gradient for Sidebar */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />

        {/* Logo Section */}
        <div className="relative p-6 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-all duration-300 ${!isSidebarExpanded && 'justify-center w-full'}`}>
            <div className="relative group cursor-pointer" onClick={toggleSidebar}>
              <div className="absolute inset-0 bg-emerald-200/30 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
              <img src={LP} alt="Medhya Logo" className="relative w-10 h-10 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
            </div>

            {isSidebarExpanded && (
              <div className="flex flex-col overflow-hidden whitespace-nowrap transition-all duration-300 animate-in fade-in slide-in-from-left-4">
                <h2 className="font-bold text-xl tracking-tight text-slate-800">MEDHYA</h2>
                <p className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Wellness Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Button (Floating) */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 z-50 p-1.5 bg-white border border-slate-200 rounded-full shadow-md text-slate-500 hover:text-emerald-600 hover:border-emerald-200 transition-all duration-200"
        >
          {isSidebarExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Navigation Items */}
        <nav className="relative flex-1 px-3 py-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                  ${isActive
                    ? 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 shadow-sm border border-emerald-100/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
                title={!isSidebarExpanded ? item.label : ''}
              >
                <div className={`
                  p-2 rounded-lg transition-all duration-200
                  ${isActive ? 'bg-white text-emerald-600 shadow-sm' : 'bg-transparent group-hover:bg-white group-hover:shadow-sm text-slate-500 group-hover:text-emerald-500'}
                `}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                </div>

                {isSidebarExpanded && (
                  <span className={`font-medium text-sm whitespace-nowrap transition-all duration-200 ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}

                {/* Active Indicator */}
                {isActive && isSidebarExpanded && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile Section */}
        <div className="relative p-4 mt-auto">
          <div className={`
            relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300
            ${isSidebarExpanded ? 'bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm' : ''}
          `}>
            <Link to="/profile" className="flex items-center gap-3 flex-1 min-w-0 group">
              <div className="relative">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={user?.imageUrl || user?.profilePicture} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold">
                    {user?.firstName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {isSidebarExpanded && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-slate-800 truncate group-hover:text-emerald-700 transition-colors">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500 capitalize truncate">{userRole}</p>
                </div>
              )}
            </Link>

            {isSidebarExpanded && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Logout"
              >
                <LogOut size={18} />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Pattern for Main Content Area */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

        <main className="flex-1 p-6 overflow-auto relative z-10">
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