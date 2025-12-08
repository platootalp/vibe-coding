import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWorkout } from '../hooks/useWorkout';
import { useStats } from '../hooks/useStats';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { workouts, workoutTypes, fetchWorkouts, fetchWorkoutTypes } = useWorkout();
  const { workoutStats, weeklyStats, loading: statsLoading, error: statsError } = useStats();
  const [hotspotData, setHotspotData] = useState<any[]>([]);
  const [predictionData, setPredictionData] = useState<any[]>([]);
  const [rankingData, setRankingData] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkouts();
    fetchWorkoutTypes();
  }, [fetchWorkouts, fetchWorkoutTypes]);

  // Calculate hotspot data (peak exercise hours)
  useEffect(() => {
    if (workouts && workouts.length > 0) {
      // Generate data for 24 hours
      const hours = Array.from({ length: 24 }, (_, i) => i);
      const hourCounts = hours.map(hour => {
        const count = workouts.filter((w: any) => {
          const workoutHour = new Date(w.date).getHours();
          return workoutHour === hour;
        }).length;
        return { hour, count };
      });

      setHotspotData(hourCounts);
    }
  }, [workouts]);

  // Calculate prediction data (calories trend)
  useEffect(() => {
    if (weeklyStats && weeklyStats.length > 0) {
      // Simple linear regression for prediction
      const dataWithIndex = weeklyStats.map((item, index) => ({
        ...item,
        index
      }));

      // Calculate trend line
      const n = dataWithIndex.length;
      const sumX = dataWithIndex.reduce((sum, item) => sum + item.index, 0);
      const sumY = dataWithIndex.reduce((sum, item) => sum + item.calories, 0);
      const sumXY = dataWithIndex.reduce((sum, item) => sum + item.index * item.calories, 0);
      const sumXX = dataWithIndex.reduce((sum, item) => sum + item.index * item.index, 0);

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
      const intercept = (sumY - slope * sumX) / n;

      // Predict next 3 days
      const predictions = [];
      for (let i = 0; i < 3; i++) {
        const futureIndex = n + i;
        const predictedCalories = Math.max(0, Math.round(slope * futureIndex + intercept));
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + i);
        const dateStr = futureDate.toISOString().split('T')[0];

        predictions.push({
          date: dateStr,
          calories: predictedCalories,
          isPrediction: true
        });
      }

      // Combine actual and predicted data
      const combinedData = [
        ...weeklyStats.map(item => ({ ...item, isPrediction: false })),
        ...predictions
      ];

      setPredictionData(combinedData);
    }
  }, [weeklyStats]);

  // Calculate ranking data (mock data for demonstration)
  useEffect(() => {
    if (workoutStats) {
      // Mock ranking data - in a real app, this would come from the backend
      const mockRanking = [
        { name: '你', calories: workoutStats.totalCalories, rank: 1 },
        { name: '张三', calories: workoutStats.totalCalories * 0.9, rank: 2 },
        { name: '李四', calories: workoutStats.totalCalories * 0.85, rank: 3 },
        { name: '王五', calories: workoutStats.totalCalories * 0.8, rank: 4 },
        { name: '赵六', calories: workoutStats.totalCalories * 0.75, rank: 5 },
      ];

      setRankingData(mockRanking);
    }
  }, [workoutStats]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for hotspot chart
  const formatTime = (hour: number) => {
    return `${hour}:00`;
  };

  if (statsLoading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔄</div>
        <p className="text-xl text-gray-600">加载统计中...</p>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-xl text-red-500">统计加载失败: {statsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">欢迎回来, {user?.name}!</h1>
        <p className="text-blue-100">让我们一起继续你的健身之旅</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">总卡路里</p>
              <p className="text-2xl font-bold">
                {workoutStats?.totalCalories || 0} <span className="text-sm font-normal">千卡</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <span className="text-2xl">⏱️</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">总运动时长</p>
              <p className="text-2xl font-bold">
                {workoutStats?.totalDuration || 0} <span className="text-sm font-normal">分钟</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">总运动次数</p>
              <p className="text-2xl font-bold">{workoutStats?.totalWorkouts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg mr-4">
              <span className="text-2xl">📍</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">总距离</p>
              <p className="text-2xl font-bold">
                {workoutStats?.totalDistance?.toFixed(1) || 0} <span className="text-sm font-normal">公里</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-6">本周活动趋势</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, '千卡']}
                  labelFormatter={(value) => formatDate(value)}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-6">运动类型分布</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workoutStats?.workoutsByType || []}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="type"
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                >
                  {(workoutStats?.workoutsByType || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'][index % 6]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, '次']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hotspot Hours Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-6">运动热点时段</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotspotData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="hour"
                  tickFormatter={formatTime}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, '次']}
                  labelFormatter={formatTime}
                />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calories Prediction Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-6">卡路里消耗预测</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => [value, '千卡']}
                  labelFormatter={(value) => formatDate(value)}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ranking Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6">运动量排名</h2>
        {rankingData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    排名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    消耗卡路里
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rankingData.map((user: any, index: number) => (
                  <tr key={index} className={user.name === '你' ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.name === '你' && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            你
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.calories} 千卡
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            暂无排名数据
          </div>
        )}
      </div>

      {/* Recent Workouts */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6">最近运动记录</h2>
        {workouts && workouts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无运动记录</p>
            <p className="text-gray-400 mt-2">开始记录你的第一次运动吧！</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    运动名称
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时长
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    消耗
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workouts && [...workouts]
                  .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((workout: any) => {
                    const workoutType = workoutTypes.find((t: any) => t.name === workout.type);
                    return (
                      <tr key={workout.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{workout.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {workoutType?.name || workout.type || '未知'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workout.duration} 分钟
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workout.calories} 千卡
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(workout.date)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;