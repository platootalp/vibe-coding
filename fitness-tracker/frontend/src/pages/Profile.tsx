import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import DeviceSync from '../components/DeviceSync';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const userData = response.data as UserProfile;
      setProfile(userData);
      
      // Set form values
      setName(userData.name);
      setEmail(userData.email);
      setAge(userData.age?.toString() || '');
      setHeight(userData.height?.toString() || '');
      setWeight(userData.weight?.toString() || '');
      setGender(userData.gender || '');
    } catch (err) {
      setError('获取个人资料失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const profileData = {
        name,
        email,
        age: age ? parseInt(age) : undefined,
        height: height ? parseInt(height) : undefined,
        weight: weight ? parseInt(weight) : undefined,
        gender: gender || undefined
      };

      const response = await userAPI.updateProfile(profileData);
      const updatedProfile = response.data as UserProfile;
      setProfile(updatedProfile);
      setSuccess('个人资料更新成功');
    } catch (err) {
      setError('更新个人资料失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔄</div>
        <p className="text-xl text-gray-600">加载中...</p>
      </div>
    );
  }

  if (error && !profile) {
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
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">👤 个人资料</h1>
        <p className="text-gray-500 mt-2">管理您的个人信息</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <span className="text-xl mr-2">⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
          <span className="text-xl mr-2">✅</span>
          <span>{success}</span>
        </div>
      )}
      
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                👤 姓名 *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📧 邮箱 *
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🎂 年龄
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
                placeholder="请输入年龄"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                📍 身高 (cm)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="50"
                max="300"
                placeholder="请输入身高"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                ⚖️ 体重 (kg)
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min="20"
                max="1000"
                placeholder="请输入体重"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                🚪 性别
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">请选择</option>
                <option value="male">👨 男</option>
                <option value="female">👩 女</option>
                <option value="other">🧑 其他</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              disabled={saving}
            >
              {saving ? '🔄 保存中...' : '✨ 保存个人资料'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Device Sync Section */}
      <div className="mt-8">
        <DeviceSync />
      </div>
      
      {profile && (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl border border-blue-100 p-8">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">📊</span>
            <h2 className="text-2xl font-bold text-gray-800">账户信息</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="text-gray-500 text-sm mb-2">📅 注册时间</p>
              <p className="text-gray-800 font-semibold text-lg">{new Date(profile.createdAt).toLocaleDateString('zh-CN')}</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-md">
              <p className="text-gray-500 text-sm mb-2">🎯 账户ID</p>
              <p className="font-mono text-sm text-gray-700 break-all">{profile._id}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;