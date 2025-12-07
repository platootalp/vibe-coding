import React, { useState, useEffect } from 'react';
import { workoutAPI } from '../services/api';
import WorkoutImport from '../components/WorkoutImport';

interface Workout {
  id: string;
  name: string;
  type: string;
  duration: number;
  calories: number;
  distance?: number;
  steps?: number;
  date: string;
  notes?: string;
  // Enhanced fields for real-time data
  heartRate?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  elevationGain?: number;
  gpsTrace?: object;
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
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
  // Enhanced fields for real-time data
  const [heartRate, setHeartRate] = useState('');
  const [avgSpeed, setAvgSpeed] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');
  const [elevationGain, setElevationGain] = useState('');

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
      // 根据运动类型动态计算卡路里消耗
      let calculatedCalories = parseInt(calories);
      if (!calculatedCalories || isNaN(calculatedCalories)) {
        calculatedCalories = calculateCalories(type, parseInt(duration) || 0, distance ? parseFloat(distance) : undefined, steps ? parseInt(steps) : undefined);
      }
      
      const workoutData = {
        name,
        type,
        duration: parseInt(duration) || 0,
        calories: calculatedCalories,
        distance: distance ? parseFloat(distance) : undefined,
        steps: steps ? parseInt(steps) : undefined,
        date: date || new Date().toISOString().split('T')[0],
        notes,
        // Enhanced fields for real-time data
        heartRate: heartRate ? parseInt(heartRate) : undefined,
        avgSpeed: avgSpeed ? parseFloat(avgSpeed) : undefined,
        maxSpeed: maxSpeed ? parseFloat(maxSpeed) : undefined,
        elevationGain: elevationGain ? parseFloat(elevationGain) : undefined
      };

      if (editingWorkout) {
        // Update existing workout
        await workoutAPI.update(editingWorkout.id, workoutData);
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

  // 根据运动类型计算卡路里消耗
  const calculateCalories = (type: string, duration: number, distance?: number, steps?: number): number => {
    // 基础代谢率估算（单位：卡路里/分钟）
    const baseMetabolicRates: Record<string, number> = {
      running: 10,    // 跑步
      cycling: 8,     // 骑行
      swimming: 9,    // 游泳
      walking: 4,     // 步行
      strength: 6,    // 力量训练
      yoga: 3,        // 瑜伽
      other: 5        // 其他
    };
    
    const rate = baseMetabolicRates[type] || 5;
    let calculatedCalories = rate * duration;
    
    // 根据距离调整卡路里（如果提供了距离）
    if (distance && distance > 0) {
      calculatedCalories += distance * 50; // 每公里额外消耗50卡路里
    }
    
    // 根据步数调整卡路里（如果提供了步数）
    if (steps && steps > 0) {
      calculatedCalories += steps * 0.05; // 每步额外消耗0.05卡路里
    }
    
    return Math.round(calculatedCalories);
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
    // Enhanced fields for real-time data
    setHeartRate(workout.heartRate?.toString() || '');
    setAvgSpeed(workout.avgSpeed?.toString() || '');
    setMaxSpeed(workout.maxSpeed?.toString() || '');
    setElevationGain(workout.elevationGain?.toString() || '');
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
    // Enhanced fields for real-time data
    setHeartRate('');
    setAvgSpeed('');
    setMaxSpeed('');
    setElevationGain('');
    setEditingWorkout(null);
    setShowForm(false);
  };

  // 根据运动类型显示不同的字段
  const renderDynamicFields = () => {
    switch (type) {
      case 'running':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📍 距离 (公里)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="5.0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                ⏱️ 配速 (分钟/公里)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="5:30"
                readOnly
                value={duration && distance ? `${(parseInt(duration) / parseFloat(distance || '1')).toFixed(2)} min/km` : ''}
              />
            </div>
          </>
        );
      case 'cycling':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📍 距离 (公里)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="20.0"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🚴 平均速度 (公里/小时)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="20 km/h"
                readOnly
                value={duration && distance ? `${(parseFloat(distance || '0') / (parseInt(duration) / 60)).toFixed(2)} km/h` : ''}
              />
            </div>
          </>
        );
      case 'swimming':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🏊 泳池长度 (米)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="25"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🔄 游泳圈数
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="20"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>
          </>
        );
      case 'walking':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📍 距离 (公里)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="3.0"
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
                placeholder="5000"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>
          </>
        );
      case 'strength':
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🏋️ 训练组数
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="3"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🔁 每组次数
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="12"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
          </>
        );
      case 'yoga':
        return (
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              🧘 瑜伽类型
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            >
              <option value="">选择瑜伽类型</option>
              <option value="hatha">哈他瑜伽</option>
              <option value="vinyasa">流瑜伽</option>
              <option value="ashtanga">阿斯汤加瑜伽</option>
              <option value="yin">阴瑜伽</option>
              <option value="restorative">修复瑜伽</option>
            </select>
          </div>
        );
      default:
        return (
          <>
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📍 距离 (公里)
              </label>
              <input
                type="number"
                step="0.1"
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
          </>
        );
    }
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
        <div className="flex gap-3">
          <button
            onClick={() => setShowImport(!showImport)}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 px-6 rounded-xl hover:from-green-700 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            {showImport ? '❌ 取消导入' : '📥 导入数据'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            {showForm ? '❌ 取消' : '➕ 添加运动'}
          </button>
        </div>
      </div>

      {/* Workout Import */}
      {showImport && (
        <WorkoutImport onImportSuccess={fetchWorkouts} />
      )}

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
              
              {/* 动态字段根据运动类型显示 */}
              {renderDynamicFields()}
              
              {/* Enhanced fields for real-time data */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  ❤️ 心率 (bpm)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="70"
                  value={heartRate}
                  onChange={(e) => setHeartRate(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🚀 平均速度 (km/h)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="10.5"
                  value={avgSpeed}
                  onChange={(e) => setAvgSpeed(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🏁 最大速度 (km/h)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="15.2"
                  value={maxSpeed}
                  onChange={(e) => setMaxSpeed(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  📈 爬升高度 (米)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="50.0"
                  value={elevationGain}
                  onChange={(e) => setElevationGain(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🔥 消耗卡路里 (自动计算)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-100"
                  placeholder="自动计算"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  readOnly={!editingWorkout} // 编辑时允许手动修改
                />
                {!editingWorkout && (
                  <p className="text-xs text-gray-500 mt-1">根据运动类型和数据自动计算，编辑时可手动修改</p>
                )}
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
            <p className="text-gray-400 mt-2">点击"添加运动"或"导入数据"按钮开始记录吧！</p>
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
                <tr key={workout.id} className="hover:bg-blue-50 transition-colors duration-150">
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
                      onClick={() => handleDelete(workout.id)}
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