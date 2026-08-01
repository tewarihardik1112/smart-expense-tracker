import { useState, useEffect, useCallback } from 'react';
import {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/expenseService';
import TransactionModal from '../components/TransactionModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { AnimatePresence } from 'framer-motion';

const Expenses = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Delete confirmation state
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getTransactions({
        type: typeFilter || undefined,
        category: categoryFilter || undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: 10,
      });
      setTransactions(data.transactions);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [typeFilter, categoryFilter, searchTerm, currentPage]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAddClick = () => {
    setEditingTransaction(null);
    setShowModal(true);
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, formData);
    } else {
      await addTransaction(formData);
    }
    setShowModal(false);
    setEditingTransaction(null);
    fetchTransactions();
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTransaction(deleteTargetId);
      setDeleteTargetId(null);
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete transaction');
      setDeleteTargetId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">Transactions</h1>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
        >
          + Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-4">
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded p-2 text-sm"
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="text"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded p-2 text-sm"
        />

        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded p-2 text-sm w-full sm:w-auto flex-1 min-w-[200px]"
        />
      </div>

      {error && <p className="bg-red-50 text-red-600 text-sm p-2 rounded mb-3">{error}</p>}

      {/* Transaction list */}
      <p className="sm:hidden text-xs text-gray-400 dark:text-gray-500 mb-2 text-center">
        ← Swipe to see more →
      </p>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors overflow-x-auto">
        {loading ? (
          <p className="p-6 text-gray-400 dark:text-gray-500 text-center">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="p-6 text-gray-400 dark:text-gray-500 text-center">No transactions found</p>
        ) : (
          <table className="w-full text-sm whitespace-nowrap">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 dark:text-gray-200">{t.title}</td>
                  <td className="p-3 dark:text-gray-200">{t.category || '—'}</td>
                  <td className="p-3 dark:text-gray-200">{t.date.slice(0, 10)}</td>
                  <td className={`p-3 font-medium ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                  </td>
                  <td className="p-3 space-x-3">
                    <button onClick={() => handleEditClick(t)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTargetId(t.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 dark:text-gray-200 rounded text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <TransactionModal
            key="transaction-modal"
            initialData={editingTransaction}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingTransaction(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTargetId && (
          <ConfirmDialog
            key="confirm-dialog"
            message="Are you sure you want to delete this transaction? This cannot be undone."
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeleteTargetId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expenses;