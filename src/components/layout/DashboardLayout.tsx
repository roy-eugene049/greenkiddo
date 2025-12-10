import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser, SignOutButton } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  User,
  Menu,
  X,
  Search,
  Bell,
  Settings,
  LogOut,
  PlayCircle,
  TrendingUp,
  Calendar,
  BookmarkCheck
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useUser();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuSections = [
    {
      title: 'Learning',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'My Courses', path: '/dashboard/courses' },
        { icon: PlayCircle, label: 'Continue Learning', path: '/dashboard/continue' },
        { icon: Search, label: 'Browse Courses', path: '/courses' },
        { icon: BookmarkCheck, label: 'Bookmarks', path: '/dashboard/bookmarks' },
      ]
    },
    {
      title: 'Progress',
      items: [
        { icon: TrendingUp, label: 'My Progress', path: '/dashboard/progress' },
        { icon: GraduationCap, label: 'Certificates', path: '/dashboard/certificates' },
        { icon: Award, label: 'Achievements', path: '/dashboard/achievements' },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', path: '/dashboard/profile' },
        { icon: Calendar, label: 'Schedule', path: '/dashboard/schedule' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
      ]
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen bg-black text-white flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed inset-y-0 left-0 z-50
          bg-gray-900 border-r border-gray-800
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ width: '280px', maxWidth: '280px' }}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
              <div className="w-10 h-10 rounded-lg bg-green-ecco flex items-center justify-center">
                <span className="text-black font-bold text-lg">GK</span>
              </div>
              <span className="text-xl font-bold text-green-ecco">GreenKiddo</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 flex-shrink-0">
          <div className="space-y-6">
            {menuSections.map((section, index) => (
              <div key={section.title}>
                {index > 0 && <div className="border-t border-gray-800 mb-6 -mx-4"></div>}
                <h3 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 rounded-lg
                            transition-all duration-200
                            ${
                              active
                                ? 'bg-green-ecco/20 text-green-ecco border-l-4 border-green-ecco font-semibold'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-green-ecco' : ''}`} />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        {/* Quick Actions CTA */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <Link
            to="/courses"
            onClick={() => setSidebarOpen(false)}
            className="w-full bg-green-ecco text-black font-bold py-3 px-4 rounded-lg text-center hover:bg-green-300 transition-colors flex items-center justify-center gap-2 mb-3"
          >
            <Search className="w-5 h-5" />
            <span>Explore Courses</span>
          </Link>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-gray-800/50">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.firstName || 'User'}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-ecco flex items-center justify-center">
                <span className="text-black font-bold">
                  {user?.firstName?.[0] || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user?.firstName || 'User'} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <SignOutButton>
            <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-[280px]">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between px-4 md:px-6 py-4 h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses, lessons..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-green-ecco"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-green-ecco rounded-full"></span>
              </button>
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition-colors hidden md:block"
              >
                Back to Site
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-black">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
