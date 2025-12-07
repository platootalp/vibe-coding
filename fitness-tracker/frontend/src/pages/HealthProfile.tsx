import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { 
  fetchHealthProfile, 
  updateHealthProfile, 
  fetchMetricsHistory, 
  addMetricsRecord,
  clearHealthError
} from '../store/healthSlice';

const HealthProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, metricsHistory, loading, error } = useAppSelector((state: any) => state.health);
  
  // Form state for profile
  const [profileForm, setProfileForm] = useState({
    height: '',
    weight: '',
    age: '',
    gender: '',
    bio: ''
  });
  
  // Form state for metrics record
  const [metricsForm, setMetricsForm] = useState({
    weight: '',
    recordedDate: new Date().toISOString().split('T')[0]
  });
  
  // Period for metrics history
  const [period, setPeriod] = useState('month');

  // Fetch health profile and metrics history on component mount
  useEffect(() => {
    dispatch(fetchHealthProfile());
    dispatch(fetchMetricsHistory({ period }));
  }, [dispatch, period]);

  // Update form when profile data is fetched
  useEffect(() => {
    if (profile) {
      setProfileForm({
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle metrics form changes
  const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMetricsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile form submission
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateHealthProfile({
      height: profileForm.height ? Number(profileForm.height) : undefined,
      weight: profileForm.weight ? Number(profileForm.weight) : undefined,
      age: profileForm.age ? Number(profileForm.age) : undefined,
      gender: profileForm.gender || undefined,
      bio: profileForm.bio || undefined
    }));
  };

  // Handle metrics form submission
  const handleMetricsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addMetricsRecord({
      weight: Number(metricsForm.weight),
      recordedDate: metricsForm.recordedDate
    }));
    
    // Reset form
    setMetricsForm({
      weight: '',
      recordedDate: new Date().toISOString().split('T')[0]
    });
  };

  // Clear error message
  const handleClearError = () => {
    dispatch(clearHealthError());
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">健康档案</h1>
      
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

      {/* Health Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">个人健康信息</h2>
        
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">身高 (cm)</label>
              <input
                type="number"
                name="height"
                value={profileForm.height}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如: 175"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">体重 (kg)</label>
              <input
                type="number"
                name="weight"
                value={profileForm.weight}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如: 70"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">年龄</label>
              <input
                type="number"
                name="age"
                value={profileForm.age}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如: 25"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">性别</label>
              <select
                name="gender"
                value={profileForm.gender}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">个人简介</label>
            <textarea
              name="bio"
              value={profileForm.bio}
              onChange={handleProfileChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="简要介绍一下您的健康目标或特殊情况..."
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 font-medium shadow-md transition-all duration-200"
            >
              {loading ? '保存中...' : '保存信息'}
            </button>
          </div>
        </form>
      </div>

      {/* Metrics History Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">健康指标历史</h2>
          
          <div className="flex items-center space-x-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="week">最近一周</option>
              <option value="month">最近一月</option>
              <option value="quarter">最近一季度</option>
              <option value="year">最近一年</option>
            </select>
          </div>
        </div>
        
        {/* Add Metrics Record Form */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-3">添加新的健康记录</h3>
          <form onSubmit={handleMetricsSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">体重 (kg)</label>
              <input
                type="number"
                name="weight"
                value={metricsForm.weight}
                onChange={handleMetricsChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="例如: 70"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-gray-700 text-sm font-medium mb-1">记录日期</label>
              <input
                type="date"
                name="recordedDate"
                value={metricsForm.recordedDate}
                onChange={handleMetricsChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-teal-600 disabled:opacity-50 font-medium shadow-md transition-all duration-200"
              >
                添加记录
              </button>
            </div>
          </form>
        </div>
        
        {/* Metrics History Table */}
        {metricsHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日期</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">体重 (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">体脂率 (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">基础代谢 (kcal)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {metricsHistory.map((record: any) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.recordedDate).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.bmi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.bodyFatPercentage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.bmr}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">暂无健康指标记录</p>
            <p className="text-gray-400 text-sm mt-1">添加您的第一条健康记录开始跟踪健康变化</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthProfile;