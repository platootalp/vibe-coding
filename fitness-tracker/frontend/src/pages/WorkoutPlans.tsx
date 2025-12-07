import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { 
  fetchWorkoutPlans, 
  fetchWorkoutTypes,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  clearWorkoutPlanError
} from '../store/workoutPlanSlice';

const WorkoutPlans: React.FC = () => {
  const dispatch = useAppDispatch();
  const { plans, workoutTypes, loading, error } = useAppSelector((state: any) => state.workoutPlans);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    durationWeeks: 4,
    workoutTypeId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 weeks from now
    planDetails: '{}'
  });

  // Fetch plans and workout types on component mount
  useEffect(() => {
    dispatch(fetchWorkoutPlans({}));
    dispatch(fetchWorkoutTypes());
  }, [dispatch]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'durationWeeks' ? parseInt(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim()) {
      alert('Please enter a plan name');
      return;
    }
    
    if (formData.durationWeeks < 1 || formData.durationWeeks > 52) {
      alert('Duration must be between 1 and 52 weeks');
      return;
    }
    
    // Validate dates
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (start >= end) {
      alert('End date must be after start date');
      return;
    }
    
    // Validate JSON
    try {
      JSON.parse(formData.planDetails);
    } catch (err) {
      alert('Plan details must be valid JSON');
      return;
    }
    
    // Submit form
    const planData = {
      ...formData,
      workoutTypeId: formData.workoutTypeId ? parseInt(formData.workoutTypeId) : undefined,
      planDetails: JSON.parse(formData.planDetails)
    };
    
    if (editingPlanId) {
      dispatch(updateWorkoutPlan({ id: editingPlanId, planData }));
    } else {
      dispatch(createWorkoutPlan(planData));
    }
    
    // Reset form
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setEditingPlanId(null);
    setFormData({
      name: '',
      description: '',
      goal: '',
      durationWeeks: 4,
      workoutTypeId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      planDetails: '{}'
    });
  };

  // Edit plan
  const handleEdit = (plan: any) => {
    setEditingPlanId(plan.id);
    setShowForm(true);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      goal: plan.goal || '',
      durationWeeks: plan.durationWeeks,
      workoutTypeId: plan.workoutTypeId?.toString() || '',
      startDate: plan.startDate,
      endDate: plan.endDate,
      planDetails: JSON.stringify(plan.planDetails || {}, null, 2)
    });
  };

  // Delete plan
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      dispatch(deleteWorkoutPlan(id));
    }
  };

  // Toggle plan status
  const togglePlanStatus = (id: string, currentStatus: boolean) => {
    dispatch(updateWorkoutPlan({ 
      id, 
      planData: {
        isActive: !currentStatus 
      }
    }));
  };

  // Clear error
  const handleClearError = () => {
    dispatch(clearWorkoutPlanError());
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">运动计划</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 font-medium shadow-md transition-all duration-200"
        >
          {showForm ? '取消' : '创建计划'}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={handleClearError} className="text-red-500 hover:text-red-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
      
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingPlanId ? '编辑运动计划' : '创建新的运动计划'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">计划名称 *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: 4周减脂计划"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">运动类型</label>
                <select
                  name="workoutTypeId"
                  value={formData.workoutTypeId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">选择运动类型</option>
                  {workoutTypes.map((type: any) => (
                    <option key={type.id} value={type.id}>
                      {type.iconUrl} {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">持续周数</label>
                <input
                  type="number"
                  name="durationWeeks"
                  value={formData.durationWeeks}
                  onChange={handleInputChange}
                  min="1"
                  max="52"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">目标</label>
                <input
                  type="text"
                  name="goal"
                  value={formData.goal}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="例如: 减重5公斤"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">开始日期</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">结束日期</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">描述</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="计划的详细描述..."
              ></textarea>
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">计划详情 (JSON格式)</label>
              <textarea
                name="planDetails"
                value={formData.planDetails}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder='{"weeks": [{"days": [{"workout": "跑步30分钟", "notes": "保持中等强度"}]}]}'
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 font-medium shadow-md transition-all duration-200"
              >
                {loading ? '保存中...' : (editingPlanId ? '更新计划' : '创建计划')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">我的运动计划</h2>
        </div>
        
        {plans.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {plans.map((plan: any) => (
              <div key={plan.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                      {plan.workoutType && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {plan.workoutType.iconUrl} {plan.workoutType.name}
                        </span>
                      )}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {plan.isActive ? '进行中' : '已结束'}
                      </span>
                    </div>
                    
                    {plan.description && (
                      <p className="mt-2 text-gray-600">{plan.description}</p>
                    )}
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">目标</p>
                        <p className="text-gray-900">{plan.goal || '未设置'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">持续时间</p>
                        <p className="text-gray-900">{plan.durationWeeks} 周</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">开始日期</p>
                        <p className="text-gray-900">{new Date(plan.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">结束日期</p>
                        <p className="text-gray-900">{new Date(plan.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => togglePlanStatus(plan.id, plan.isActive)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        plan.isActive
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {plan.isActive ? '结束' : '激活'}
                    </button>
                    <button
                      onClick={() => handleEdit(plan)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200"
                    >
                      删除
                    </button>
                  </div>
                </div>
                
                {plan.planDetails && Object.keys(plan.planDetails).length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">计划详情:</p>
                    <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-x-auto">
                      {JSON.stringify(plan.planDetails, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500">暂无运动计划</p>
            <p className="text-gray-400 text-sm mt-1">创建您的第一个运动计划开始健身之旅</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;