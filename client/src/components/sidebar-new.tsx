import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Home,
  Calendar,
  Users,
  Wrench,
  Settings,
  LogOut,
  Sparkles,
  BarChart3,
  Zap,
  Crown,
  X,
  Linkedin,
  Phone,
  Mail,
  Laptop,
  Globe,
} from 'lucide-react';

export function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  const menuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      icon: Calendar,
      label: 'Appointments',
      path: '/appointments',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Users,
      label: 'Customers',
      path: '/customers',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Wrench,
      label: 'Services',
      path: '/services',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      gradient: 'from-slate-500 to-gray-600',
    },
    {
      icon: Globe,
      label: 'Public Page',
      path: `/book/${user?.publicUrlSlug}`,
      gradient: 'from-slate-500 to-gray-600',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location === '/';
    return location.startsWith(path);
  };

  return (
    <div className="w-72 bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900 text-white shadow-2xl relative overflow-hidden h-screen flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="p-6 border-b border-white/10 shrink-0">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-2xl flex items-center justify-center animate-float">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                IntelliServe
              </h1>
              <p className="text-xs text-purple-200">CRM Suite</p>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-purple-200 truncate">
                  {user?.businessName || 'Business Owner'}
                </p>
              </div>
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {/* Navigation Menu */}
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link key={item.path} href={item.path}>
                  <div
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      active
                        ? 'bg-white/20 shadow-lg shadow-purple-500/20'
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {active && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-20 animate-glow`}
                      ></div>
                    )}
                    <div className="relative p-4 flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          active
                            ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                            : 'bg-white/10 group-hover:bg-white/20'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            active
                              ? 'text-white'
                              : 'text-purple-200 group-hover:text-white'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          active
                            ? 'text-white'
                            : 'text-purple-200 group-hover:text-white'
                        }`}
                      >
                        {item.label}
                      </span>
                      {active && (
                        <div className="ml-auto">
                          <Zap className="w-4 h-4 text-cyan-300 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Premium Feature Highlight */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-700 opacity-50 animate-pulse"></div>
              <div className="relative z-10">
                <Crown className="w-8 h-8 text-white mx-auto mb-2" />
                <h3 className="font-bold text-white text-sm mb-1">
                  Premium Analytics
                </h3>
                <p className="text-xs text-amber-100 mb-3">
                  Unlock advanced insights
                </p>
                <Button
                  size="sm"
                  onClick={() => setShowModal(true)}
                  className="bg-white text-amber-600 hover:bg-amber-50 font-semibold px-4 py-2 rounded-xl"
                >
                  Upgrade
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <Button
            onClick={() => {
              logout();
              toast({
                title: 'Signed out',
                description: 'You have been successfully signed out.',
              });
              setLocation('/welcome');
            }}
            variant="ghost"
            className="w-full justify-start text-purple-200 hover:text-white hover:bg-red-500/20 rounded-2xl p-4 transition-all duration-300"
          >
            <LogOut className="w-5 h-5 mr-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white text-slate-800 rounded-2xl shadow-2xl w-[90%] max-w-md p-6 relative animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4">
              <Laptop className="w-10 h-10 mx-auto text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-800">Zaid Naeem</h2>
              <p className="text-sm text-gray-600">
                Full-stack Developer | MERN & React Native Expert <br />I help
                startups and businesses build beautiful, fast, and scalable web
                & mobile apps.
              </p>
              <div className="space-y-3 text-sm text-left mt-4">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-blue-600" />
                  <a
                    href="https://www.linkedin.com/in/zaid-naeem-1b24611a8/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    linkedin.com/in/zaid-naeem
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-red-600" />
                  <a
                    href="mailto:zaid.ch20@gmail.com"
                    className="hover:underline"
                  >
                    zaid.ch20@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span>+92 336 1435189</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
