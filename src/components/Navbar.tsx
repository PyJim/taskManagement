import { LogOut, Users, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const isAdmin = user?.groups?.includes('Admins') || false;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <span className="text-lg font-semibold">Welcome, {user?.firstname || user?.email}</span>
            <div className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`flex items-center ${
                  location.pathname === '/dashboard'
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard size={18} className="mr-2" />
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/team"
                  className={`flex items-center ${
                    location.pathname === '/team'
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Users size={18} className="mr-2" />
                  Team
                </Link>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};