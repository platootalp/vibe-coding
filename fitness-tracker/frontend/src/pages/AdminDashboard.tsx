import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

// Define interfaces for API response
interface SystemStats {
  users: number;
  workouts: number;
  workoutPlans: number;
  nutritionLogs: number;
  recentRegistrations: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [stats, setStats] = React.useState<SystemStats>({
    users: 0,
    workouts: 0,
    workoutPlans: 0,
    nutritionLogs: 0,
    recentRegistrations: 0
  });
  
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response: any = await adminAPI.getSystemStats();
        setStats(response.data.stats);
      } catch (err: any) {
        setError('Failed to fetch system stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error! </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Users</h3>
          <p className="mt-2 text-3xl font-semibold text-blue-600">{stats.users}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Workouts</h3>
          <p className="mt-2 text-3xl font-semibold text-green-600">{stats.workouts}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Workout Plans</h3>
          <p className="mt-2 text-3xl font-semibold text-purple-600">{stats.workoutPlans}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Nutrition Logs</h3>
          <p className="mt-2 text-3xl font-semibold text-yellow-600">{stats.nutritionLogs}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Registrations</h3>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">{stats.recentRegistrations}</p>
        </div>
      </div>
      
      {/* User Management Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">User Management</h2>
        <p className="text-gray-600 mb-4">Manage users, view user details, and handle administrative tasks.</p>
        <button 
          onClick={() => navigate('/admin/panel')}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Manage Users
        </button>
      </div>
      
      {/* System Audit Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">System Audit</h2>
        <p className="text-gray-600 mb-4">View system logs and audit trails.</p>
        <button 
          onClick={() => console.log('Navigate to audit logs')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          View Audit Logs
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;