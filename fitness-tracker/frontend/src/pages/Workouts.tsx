import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../services/api';

interface Workout {
  _id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  distance?: number;
  steps?: number;
  date: string;
  notes?: string;
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [distance, setDistance] = useState('');
  const [steps, setSteps] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await workoutAPI.getAll();
      setWorkouts(response.data as Workout[]);
    } catch (err) {
      setError('获取运动记录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const workoutData = {
        name,
        type,
        duration: parseInt(duration),
        calories: parseInt(calories),
        distance: distance ? parseInt(distance) : undefined,
        steps: steps ? parseInt(steps) : undefined,
        date: date || new Date().toISOString().split('T')[0],
        notes
      };

      if (editingWorkout) {
        // Update existing workout
        await workoutAPI.update(editingWorkout._id, workoutData);
      } else {
        // Create new workout
        await workoutAPI.create(workoutData);
      }
      
      // Reset form and refresh data
      resetForm();
      fetchWorkouts();
    } catch (err) {
      setError('保存运动记录失败');
    }
  };

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
    setName(workout.name);
    setType(workout.type);
    setDuration(workout.duration.toString());
    setCalories(workout.calories.toString());
    setDistance(workout.distance?.toString() || '');
    setSteps(workout.steps?.toString() || '');
    setDate(workout.date.split('T')[0]);
    setNotes(workout.notes || '');
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('确定要删除这条运动记录吗？')) {
      try {
        await workoutAPI.delete(id);
        fetchWorkouts();
      } catch (err) {
        setError('删除运动记录失败');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setType('running');
    setDuration('');
    setCalories('');
    setDistance('');
    setSteps('');
    setDate('');
    setNotes('');
    setEditingWorkout(null);
    setShowForm(false);
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      running: '跑步',
      cycling: '骑行',
      swimming: '游泳',
      walking: '步行',
      strength: '力量训练',
      yoga: '瑜伽',
      other: '其他'
    };
    return types[type] || type;
  };

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🏋️‍♂️ 运动记录</h1>
          <p className="text-gray-500 mt-2">管理您的所有健身活动</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
        >
          {showForm ? '❌ 取消' : '➕ 添加运动'}
        </button>
      </div>

      {/* Workout Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-3xl mr-3">{editingWorkout ? '✏️' : '✨'}</span>
            {editingWorkout ? '编辑运动记录' : '添加运动记录'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🎯 运动名称 *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="例如：晚上跑步"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🏃 运动类型 *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="running">🏃 跑步</option>
                  <option value="cycling">🚴 骑行</option>
                  <option value="swimming">🏊 游泳</option>
                  <option value="walking">🚶 步行</option>
                  <option value="strength">🏋️ 力量训练</option>
                  <option value="yoga">🧘 瑜伽</option>
                  <option value="other">🎯 其他</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  ⏱️ 运动时长 (分钟) *
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🔥 消耗卡路里 *
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="200"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  📍 距离 (公里)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="5.0"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  👣 步数
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="10000"
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  📅 日期
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📝 备注
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                rows={3}
                placeholder="添加任何额外信息..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {editingWorkout ? '✔️ 更新' : '✨ 保存'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                ❌ 取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workouts List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {workouts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <p className="text-gray-500 text-lg">暂无运动记录</p>
            <p className="text-gray-400 mt-2">点击“添加运动”按钮开始记录吧！</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  运动名称
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  时长
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  卡路里
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  日期
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {workouts.map((workout) => (
                <tr key={workout._id} className="hover:bg-blue-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{workout.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getTypeLabel(workout.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 font-medium">{workout.duration} 分钟</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 font-medium">{workout.calories} 卡</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(workout.date).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(workout)}
                      className="text-blue-600 hover:text-blue-900 mr-4 font-semibold transition-colors duration-150"
                    >
                      ✏️ 编辑
                    </button>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="text-red-600 hover:text-red-900 font-semibold transition-colors duration-150"
                    >
                      🗑️ 删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Workouts;