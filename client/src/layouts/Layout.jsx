import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

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
      <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center transition-colors">
        <div className="flex items-center gap-6">
          <span className="font-bold text-lg text-blue-600 dark:text-blue-400">ExpenseTracker</span>
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
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-lg p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">{user?.fullName || user?.full_name}</span>
          <button onClick={handleLogout} className="text-sm text-red-600 dark:text-red-400 font-medium">
            Logout
          </button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;