import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Fitness Tracker
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-2xl mx-auto">
          您的专属健身追踪助手 💪
        </p>
        <Link 
          to="/register" 
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-10 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          🚀 开始健身之旅
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
          <div className="text-6xl mb-4 text-center">🏃‍♂️</div>
          <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">运动记录</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            记录您的每一次运动，包括跑步、骑行、游泳等各种活动
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
          <div className="text-6xl mb-4 text-center">📊</div>
          <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">数据统计</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            可视化展示您的运动数据，帮助您了解健身进展
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
          <div className="text-6xl mb-4 text-center">🎯</div>
          <h3 className="text-2xl font-bold mb-3 text-center text-gray-800">目标设定</h3>
          <p className="text-gray-600 text-center leading-relaxed">
            设定健身目标并跟踪进度，助您达成健康生活目标
          </p>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-10 my-16 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          为什么选择 Fitness Tracker？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">简单易用</h3>
              <p className="text-gray-600 leading-relaxed">直观的界面设计，轻松记录和查看您的健身数据</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">全面追踪</h3>
              <p className="text-gray-600 leading-relaxed">记录运动时长、距离、卡路里消耗等关键指标</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">数据可视化</h3>
              <p className="text-gray-600 leading-relaxed">通过图表清晰展示您的健身趋势和进步</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-gray-800">随时随地</h3>
              <p className="text-gray-600 leading-relaxed">响应式设计，支持手机和平板设备使用</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">准备好开始了吗？</h2>
        <p className="text-xl text-gray-600 mb-8">加入我们，开启您的健康生活方式</p>
        <Link 
          to="/register" 
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-10 rounded-full text-lg font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          立即注册
        </Link>
      </div>
    </div>
  );
};

export default Home;