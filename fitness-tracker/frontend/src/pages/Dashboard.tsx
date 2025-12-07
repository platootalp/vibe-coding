import React, { useState, useEffect } from 'react';
import { statsAPI } from '../services/api';

interface WorkoutStat {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  totalDistance: number;
  workoutsByType: {
    _id: string;
    count: number;
  }[];
}

interface WeeklyStat {
  date: string;
  duration: number;
  calories: number;
  workouts: number;
}

const Dashboard: React.FC = () => {
  const [workoutStats, setWorkoutStats] = useState<WorkoutStat | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutRes, weeklyRes] = await Promise.all([
          statsAPI.getWorkoutStats(),
          statsAPI.getWeeklyStats()
        ]);
        
        setWorkoutStats(workoutRes.data as WorkoutStat);
        setWeeklyStats(weeklyRes.data as WeeklyStat[]);
      } catch (err) {
        setError('获取数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔄</div>
        <p className="text-xl text-gray-600">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">📊 我的仪表板</h1>
        <p className="text-gray-500 mt-2">全面了解您的健身数据</p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">总运动次数</h3>
            <span className="text-3xl">🏋️</span>
          </div>
          <p className="text-4xl font-bold">{workoutStats?.totalWorkouts || 0}</p>
          <p className="text-xs opacity-75 mt-2">持续保持运动习惯</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">总运动时长</h3>
            <span className="text-3xl">⏱️</span>
          </div>
          <p className="text-4xl font-bold">{workoutStats?.totalDuration || 0}</p>
          <p className="text-xs opacity-75 mt-2">分钟</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">总消耗卡路里</h3>
            <span className="text-3xl">🔥</span>
          </div>
          <p className="text-4xl font-bold">{workoutStats?.totalCalories || 0}</p>
          <p className="text-xs opacity-75 mt-2">卡路里</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">总运动距离</h3>
            <span className="text-3xl">🏃</span>
          </div>
          <p className="text-4xl font-bold">{workoutStats?.totalDistance ? workoutStats.totalDistance.toFixed(2) : '0.00'}</p>
          <p className="text-xs opacity-75 mt-2">公里</p>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">📈</span>
            <h3 className="text-2xl font-bold text-gray-800">本周活动</h3>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {weeklyStats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all duration-300 shadow-lg"
                  style={{ height: `${Math.max(20, stat.workouts * 30)}px` }}
                ></div>
                <span className="mt-3 text-xs font-semibold text-gray-700">{stat.date.substring(5)}</span>
                <span className="text-xs text-blue-600 font-bold">{stat.workouts}次</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Workout Types Chart */}
        <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">🎯</span>
            <h3 className="text-2xl font-bold text-gray-800">运动类型分布</h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            {workoutStats?.workoutsByType && workoutStats.workoutsByType.length > 0 ? (
              <div className="w-full space-y-4">
                {workoutStats.workoutsByType.map((type, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700 flex items-center">
                        <span className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 mr-2"></span>
                        {type._id}
                      </span>
                      <span className="text-sm font-bold text-green-600">{type.count}次</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-inner transition-all duration-500" 
                        style={{ width: `${(type.count / (workoutStats.totalWorkouts || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-400">暂无数据</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;