import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold hover:text-blue-200 transition-colors">
            🏋️‍♂️ FitnessTracker
          </Link>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-blue-200 transition-colors">个人资料</Link>
                <Link to="/workouts" className="hover:text-blue-200 transition-colors">运动记录</Link>
                <Link to="/workout-plans" className="hover:text-blue-200 transition-colors">运动计划</Link>
                <Link to="/health-profile" className="hover:text-blue-200 transition-colors">健康档案</Link>
                <Link to="/nutrition" className="hover:text-blue-200 transition-colors">膳食记录</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors">登录</Link>
                <Link to="/register" className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium">注册</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;