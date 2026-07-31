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
      <h1 className="text-2xl font-bold mb-6">AI Insights</h1>

      {loading && <p className="text-gray-400">Analyzing your finances...</p>}
      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded">{error}</p>}

      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-lg shadow md:col-span-2">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Summary</h2>
            <p className="text-gray-800">{insights.summary}</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Highest Spending Category</h2>
            <p className="text-lg font-semibold text-gray-800">
              {insights.highestSpendingCategory || 'No expenses yet'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Saving Tip</h2>
            <p className="text-gray-800">{insights.savingTip}</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow md:col-span-2">
            <h2 className="text-sm font-medium text-gray-500 mb-2">Budget Recommendation</h2>
            <p className="text-gray-800">{insights.budgetRecommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;