import React, { useState } from 'react';

interface WorkoutPlan {
  id: string;
  name: string;
  type: string;
  goal: string;
  frequency: number;
  duration: number;
  startDate: string;
  endDate: string;
}

const WorkoutPlans: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([
    // Sample data - in a real app, this would come from an API
    {
      id: '1',
      name: '减脂计划',
      type: 'running',
      goal: '每周跑步3次，每次30分钟',
      frequency: 3,
      duration: 30,
      startDate: '2023-01-01',
      endDate: '2023-03-01'
    }
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState('running');
  const [goal, setGoal] = useState('');
  const [frequency, setFrequency] = useState('3');
  const [duration, setDuration] = useState('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setName('');
    setType('running');
    setGoal('');
    setFrequency('3');
    setDuration('30');
    setStartDate('');
    setEndDate('');
    setShowForm(true);
  };

  const handleEditPlan = (plan: WorkoutPlan) => {
    setEditingPlan(plan);
    setName(plan.name);
    setType(plan.type);
    setGoal(plan.goal);
    setFrequency(plan.frequency.toString());
    setDuration(plan.duration.toString());
    setStartDate(plan.startDate);
    setEndDate(plan.endDate);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPlan: WorkoutPlan = {
      id: editingPlan ? editingPlan.id : Date.now().toString(),
      name,
      type,
      goal,
      frequency: parseInt(frequency),
      duration: parseInt(duration),
      startDate,
      endDate
    };
    
    if (editingPlan) {
      setPlans(plans.map(plan => plan.id === editingPlan.id ? newPlan : plan));
    } else {
      setPlans([...plans, newPlan]);
    }
    
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这个运动计划吗？')) {
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  const resetForm = () => {
    setName('');
    setType('running');
    setGoal('');
    setFrequency('3');
    setDuration('30');
    setStartDate('');
    setEndDate('');
    setEditingPlan(null);
    setShowForm(false);
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      running: '🏃 跑步',
      cycling: '🚴 骑行',
      swimming: '🏊 游泳',
      walking: '🚶 步行',
      strength: '🏋️ 力量训练',
      yoga: '🧘 瑜伽',
      other: '🎯 其他'
    };
    return types[type] || type;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📋 运动计划
          </h1>
          <p className="text-gray-500 mt-2">制定和管理您的健身计划</p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 font-semibold"
        >
          ➕ 创建计划
        </button>
      </div>

      {/* Workout Plan Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-100 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="text-3xl mr-3">{editingPlan ? '✏️' : '✨'}</span>
            {editingPlan ? '编辑运动计划' : '创建运动计划'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🎯 计划名称 *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="例如：春季减脂计划"
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
                  🎯 目标描述 *
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="例如：每周跑步3次，每次30分钟，目标减重5公斤"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  📅 时间安排
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-600 text-xs mb-1">开始日期</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 text-xs mb-1">结束日期</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  🔁 频率 (每周次数)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="3"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  min="1"
                  max="7"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  ⏱️ 每次时长 (分钟)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {editingPlan ? '✔️ 更新' : '✨ 保存'}
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

      {/* Workout Plans List */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {plans.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">暂无运动计划</p>
            <p className="text-gray-400 mt-2">点击“创建计划”按钮开始制定您的健身计划吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {plans.map((plan) => (
              <div key={plan.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="text-blue-600 hover:text-blue-900 font-semibold transition-colors duration-150"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="text-red-600 hover:text-red-900 font-semibold transition-colors duration-150"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24 text-sm">运动类型:</span>
                    <span className="font-medium">{getTypeLabel(plan.type)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24 text-sm">目标:</span>
                    <span className="font-medium text-sm">{plan.goal}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24 text-sm">频率:</span>
                    <span className="font-medium">每周 {plan.frequency} 次</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-gray-500 w-24 text-sm">时长:</span>
                    <span className="font-medium">每次 {plan.duration} 分钟</span>
                  </div>
                  
                  {(plan.startDate || plan.endDate) && (
                    <div className="flex items-center">
                      <span className="text-gray-500 w-24 text-sm">时间:</span>
                      <span className="font-medium text-sm">
                        {plan.startDate && `${plan.startDate} 至 `}
                        {plan.endDate || '未指定'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>计划ID: {plan.id}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;