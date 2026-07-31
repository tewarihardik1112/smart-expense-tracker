import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getDashboardSummary();
        setSummary(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      }
    };
    fetchSummary();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.fullName || user?.full_name}</h1>
        <button onClick={handleLogout} className="text-sm text-red-600 font-medium">
          Logout
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.totalIncome}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Expense</p>
            <p className="text-2xl font-bold text-red-600">₹{summary.totalExpense}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Balance</p>
            <p className="text-2xl font-bold">₹{summary.balance}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;