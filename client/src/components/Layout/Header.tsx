import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  BookOpen, 
  User, 
  LogOut, 
  Settings,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks';
import SearchModal from '../Search/SearchModal';
import NotificationPanel from '../Notification/NotificationCenter';
import toast from 'react-hot-toast';

// TODO: Replace with real notifications API

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Use real notifications API
  const { 
    notifications, 
    unreadCount: notificationUnreadCount, 
    isLoading: notificationsLoading, 
    error: notificationsError,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchSelect = (result: any) => {
    console.log('Selected search result:', result);
    
    // Navigate based on result type
    switch (result.type) {
      case 'topic':
        navigate(`/learning/${result.id}`);
        break;
      case 'lesson':
        navigate(`/lessons/${result.id}`);
        break;
      case 'video':
        navigate(`/lessons/${result.lessonId || result.id}`);
        break;
      case 'path':
        navigate(`/learning/${result.topicId || result.id}`);
        break;
      default:
        console.warn('Unknown result type:', result.type);
    }
    
    // Show success toast
    if (typeof window !== 'undefined' && window.location.pathname.includes(result.id)) {
      // Already on the page
    } else {
      toast.success(`Opening ${result.title}`);
    }
  };

  const handleNotificationClick = (notification: any) => {
    console.log('Clicked notification:', notification);
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification._id);
    }
    // Handle notification click action based on type/data
    if (notification.data?.path) {
      navigate(notification.data.path);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black-950/80 backdrop-blur-xl border-b border-dark-800/50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative p-1 rounded-xl">
              <img 
                src="/lexora-logo.png" 
                alt="Lexora Logo" 
                className="h-8 w-8 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-gradient hidden sm:block">
              Lexora
            </span>
          </Link>


          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {/* Search Icon */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-all duration-200"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2.5 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                {notificationUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-error-500 to-error-600 rounded-full border-2 border-black-950 animate-pulse">
                    <span className="sr-only">{notificationUnreadCount} unread notifications</span>
                  </span>
                )}
              </button>
              
              <NotificationPanel
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
                onMarkAsRead={markAsRead}
                onMarkAllAsRead={markAllAsRead}
                onNotificationClick={handleNotificationClick}
                isLoading={notificationsLoading}
                error={notificationsError}
              />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 hover:bg-dark-800/50 rounded-lg transition-all duration-200"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-dark-400">{user?.email}</p>
                </div>
                
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.displayName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                
                <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-64 bg-dark-900/95 backdrop-blur-xl border border-dark-700 rounded-2xl shadow-dark-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-dark-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center overflow-hidden">
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.displayName} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{user?.displayName}</p>
                          <p className="text-sm text-dark-400">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-3 py-2.5 text-dark-300 hover:text-white hover:bg-dark-800/50 rounded-xl transition-all duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <div className="border-t border-dark-800 my-2"></div>
                      
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 text-error-400 hover:text-error-300 hover:bg-error-500/10 rounded-xl transition-all duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>

      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelect={handleSearchSelect}
      />
    </header>
  );
};

export default Header;
