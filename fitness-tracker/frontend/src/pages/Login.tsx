import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { authAPI } from '../services/api';
import OAuthButtons from '../components/OAuthButtons';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  token: string;
  user: UserData;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });

      // For mock API, the response structure is different
      let token: string;
      let user: UserData;

      // Check if it's a mock response or real API response
      if (response && typeof response === 'object' && 'token' in response) {
        // Mock API response
        token = (response as { token: string; user: UserData }).token;
        user = (response as { token: string; user: UserData }).user;
      } else {
        // Real API response
        const data = response as unknown as { data: LoginResponse };
        token = data.data.token;
        user = data.data.user;
      }

      // Dispatch to Redux store
      dispatch(loginSuccess({ token, user }));

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Redirect to dashboard with refresh
      window.location.href = '/dashboard';
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">欢迎回来</h2>
          <p className="text-gray-500 mt-2">登录您的健身账户</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <span className="text-xl mr-2">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm">
              📧 邮箱地址
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              placeholder="请输入您的邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-semibold mb-2 text-sm">
              🔑 密码
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
              placeholder="请输入您的密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            disabled={loading}
          >
            {loading ? '🔄 登录中...' : '🚀 立即登录'}
          </button>
        </form>

        <OAuthButtons />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            还没有账户？{' '}
            <Link to="/register" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-200">
              立即注册 →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;