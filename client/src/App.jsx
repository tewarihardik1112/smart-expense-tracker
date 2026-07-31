import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './layouts/Layout';
import Insights from './pages/Insights';
import Chat from './pages/Chat';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Layout>
              <Expenses />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
  path="/insights"
  element={
    <ProtectedRoute>
      <Layout>
        <Insights />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Layout>
        <Chat />
      </Layout>
    </ProtectedRoute>
  }
/>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;