import { useEffect, useState } from 'react';
import { getDashboardSummary } from '../services/dashboardService';
import { useTheme } from '../context/ThemeContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CATEGORY_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const { isDark } = useTheme();
  const axisColor = isDark ? '#9ca3af' : '#6b7280';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const monthlyChartData =
    summary?.monthlyBreakdown.map((row) => ({
      month: MONTH_NAMES[row.month - 1],
      Income: row.income,
      Expense: row.expense,
    })) || [];

  return (
    <div>
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {summary && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹{summary.totalIncome}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expense</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">₹{summary.totalExpense}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Balance</p>
              <p className="text-2xl font-bold dark:text-white">₹{summary.balance}</p>
            </div>
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Pie Chart — spending by category */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Spending by Category</h2>
              {summary.categoryBreakdown.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={summary.categoryBreakdown}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 90 : 100}
                      label={isMobile ? false : (entry) => `${entry.category}: ₹${entry.total}`}
                    >
                      {summary.categoryBreakdown.map((_, index) => (
                        <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      formatter={(value, entry) => `${value}: ₹${entry.payload.total}`}
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-sm">No expense data yet</p>
              )}
            </div>

            {/* Bar Chart — Income vs Expense by month */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Income vs Expense</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke={axisColor} />
                  <YAxis stroke={axisColor} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Income" fill="#10b981" />
                  <Bar dataKey="Expense" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart — spending trend */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-colors">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Monthly Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke={axisColor} />
                <YAxis stroke={axisColor} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;