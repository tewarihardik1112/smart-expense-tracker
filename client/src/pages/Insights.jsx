import { useEffect, useState } from 'react';
import { getMonthlyInsights } from '../services/insightsService';

const Insights = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await getMonthlyInsights();
        setInsights(data.insights);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load insights');
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 dark:text-white">AI Insights</h1>

      {loading && <p className="text-gray-400 dark:text-gray-500">Analyzing your finances...</p>}
      {error && <p className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-2 rounded">{error}</p>}

      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow md:col-span-2 transition-colors">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Summary</h2>
            <p className="text-gray-800 dark:text-gray-200">{insights.summary}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow transition-colors">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Highest Spending Category</h2>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {insights.highestSpendingCategory || 'No expenses yet'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow transition-colors">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Saving Tip</h2>
            <p className="text-gray-800 dark:text-gray-200">{insights.savingTip}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow md:col-span-2 transition-colors">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Budget Recommendation</h2>
            <p className="text-gray-800 dark:text-gray-200">{insights.budgetRecommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;