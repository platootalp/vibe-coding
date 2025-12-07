import React, { useState, useEffect } from 'react';
import { deviceAPI } from '../services/api';

interface DeviceSyncData {
  id: number;
  userId: number;
  deviceType: string;
  deviceId: string;
  lastSyncedAt: string;
}

const DeviceSync: React.FC = () => {
  const [devices, setDevices] = useState<DeviceSyncData[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeviceSyncHistory();
  }, []);

  const fetchDeviceSyncHistory = async () => {
    try {
      setLoading(true);
      const response = await deviceAPI.getDeviceSyncHistory();
      setDevices(response.data);
    } catch (err: any) {
      setError('获取设备同步历史失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncDevice = async () => {
    try {
      setSyncing(true);
      // In a real implementation, this would collect data from a connected device
      // For now, we'll simulate syncing with fake data
      const fakeDeviceData = {
        deviceType: 'fitness_tracker',
        deviceId: 'FT_' + Math.random().toString(36).substr(2, 9),
        syncData: {
          steps: Math.floor(Math.random() * 10000),
          heartRate: Math.floor(Math.random() * 100) + 60,
          calories: Math.floor(Math.random() * 500) + 200
        }
      };
      
      await deviceAPI.syncDeviceData(fakeDeviceData);
      
      // Refresh the device list
      fetchDeviceSyncHistory();
      
      alert('设备数据同步成功！');
    } catch (err: any) {
      setError('设备同步失败');
      console.error(err);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">设备同步</h2>
        <button
          onClick={handleSyncDevice}
          disabled={syncing}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
        >
          {syncing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              同步中...
            </>
          ) : (
            '🔄 同步设备'
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {devices.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-4">⌚</div>
          <p className="text-gray-500">暂无设备同步记录</p>
          <p className="text-gray-400 text-sm mt-2">连接您的可穿戴设备以同步数据</p>
        </div>
      ) : (
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900 capitalize">{device.deviceType.replace('_', ' ')}</h3>
                  <p className="text-sm text-gray-500">ID: {device.deviceId}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    最后同步: {new Date(device.lastSyncedAt).toLocaleString()}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    已同步
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">支持的设备</h3>
        <div className="flex space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            Apple Watch
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Fitbit
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            Garmin
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            小米手环
          </span>
        </div>
      </div>
    </div>
  );
};

export default DeviceSync;