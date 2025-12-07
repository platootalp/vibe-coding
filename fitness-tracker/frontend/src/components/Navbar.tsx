import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">💪</span>
            <span className="text-white text-xl font-bold hover:text-blue-100 transition-colors">
              Fitness Tracker
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-blue-100 transition-colors font-medium"
                >
                  📊 仪表板
                </Link>
                <Link 
                  to="/workouts" 
                  className="text-white hover:text-blue-100 transition-colors font-medium"
                >
                  🏃 运动记录
                </Link>
                <Link 
                  to="/profile" 
                  className="text-white hover:text-blue-100 transition-colors font-medium"
                >
                  👤 个人资料
                </Link>
                <button 
                  onClick={onLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  退出登录
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-100 transition-colors font-medium"
                >
                  登录
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg transition-colors font-medium shadow-md"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;