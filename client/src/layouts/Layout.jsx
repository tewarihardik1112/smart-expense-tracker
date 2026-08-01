import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/expenses', label: 'Transactions' },
    { to: '/insights', label: 'Insights' },
    { to: '/chat', label: 'Chat' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-4 sm:px-6 py-4 transition-colors">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400">ExpenseTracker</span>
            {/* Desktop nav links — hidden on mobile */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium ${
                    location.pathname === link.to
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="text-lg p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {/* User name — hidden on small screens to save space */}
            <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">
              {user?.fullName || user?.full_name}
            </span>
            <button
  onClick={handleLogout}
  className="hidden md:inline text-sm text-red-600 dark:text-red-400 font-medium px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
>
  Logout
</button>
            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300"></div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 pb-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium ${
                  location.pathname === link.to
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
  onClick={handleLogout}
  className="text-sm text-red-600 dark:text-red-400 font-medium text-left px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
>
  Logout
</button>
          </div>
        )}
      </nav>
      <main className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Layout;