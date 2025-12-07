import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWorkout } from '../hooks/useWorkout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { workouts, workoutTypes, fetchWorkouts, fetchWorkoutTypes } = useWorkout();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [typeDistribution, setTypeDistribution] = useState<any[]>([]);

  useEffect(() => {
    fetchWorkouts();
    fetchWorkoutTypes();
  }, [fetchWorkouts, fetchWorkoutTypes]);

  // Calculate weekly data for chart
  useEffect(() => {
    if (workouts.length > 0) {
      // Generate last 7 days data
      const days = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayWorkouts = workouts.filter((w: any) => 
          w.startTime.startsWith(dateString)
        );
        
        const totalCalories = dayWorkouts.reduce((sum: number, w: any) => sum + w.caloriesBurned, 0);
        const totalDuration = dayWorkouts.reduce((sum: number, w: any) => sum + w.durationMinutes, 0);
        
        days.push({
          date: dateString,
          calories: totalCalories,
          duration: totalDuration,
          count: dayWorkouts.length
        });
      }
      
      setWeeklyData(days);
    }
  }, [workouts]);

  // Calculate workout type distribution
  useEffect(() => {
    if (workouts.length > 0 && workoutTypes.length > 0) {
      const typeMap: Record<number, { name: string; count: number; color: string }> = {};
      
      // Initialize with all types
      workoutTypes.forEach((type: any) => {
        typeMap[type.id] = {
          name: type.name,
          count: 0,
          color: '#' + Math.floor(Math.random()*16777215).toString(16)
        };
      });
      
      // Count workouts by type
      workouts.forEach((workout: any) => {
        if (typeMap[workout.workoutTypeId]) {
          typeMap[workout.workoutTypeId].count++;
        }
      });
      
      setTypeDistribution(Object.values(typeMap));
    }
  }, [workouts, workoutTypes]);

  // Get recent workouts
  const recentWorkouts = [...workouts]
    .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">欢迎回来, {user?.name}!</h1>
        <p className="text-blue-100">让我们一起继续你的健身之旅</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <span className="text-2xl">🔥</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">本周卡路里</p>
              <p className="text-2xl font-bold">
                {weeklyData.reduce((sum, day) => sum + day.calories, 0)} <span className="text-sm font-normal">千卡</span>
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
              <p className="text-gray-500 text-sm">本周运动时长</p>
              <p className="text-2xl font-bold">
                {weeklyData.reduce((sum, day) => sum + day.duration, 0)} <span className="text-sm font-normal">分钟</span>
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
              <p className="text-2xl font-bold">{workouts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-6">本周活动趋势</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
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
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, '次']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold mb-6">最近运动记录</h2>
        {recentWorkouts.length === 0 ? (
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
                {recentWorkouts.map((workout: any) => {
                  const workoutType = workoutTypes.find((t: any) => t.id === workout.workoutTypeId);
                  return (
                    <tr key={workout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{workout.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {workoutType?.name || '未知'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workout.durationMinutes} 分钟
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {workout.caloriesBurned} 千卡
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(workout.startTime)}
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