import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login?error=missing_token');
      return;
    }

    localStorage.setItem('token', token);

    const fetchUser = async () => {
      try {
        const response = await api.get('/auth/me');
        login(token, response.data.user);
        navigate('/dashboard');
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login?error=google_auth_failed');
      }
    };

    fetchUser();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Signing you in...</p>
    </div>
  );
};

export default AuthCallback;