import React, { useState } from 'react';
import { workoutAPI } from '../services/api';
import { transformImportedWorkout } from '../utils/workoutUtils';

interface ImportedWorkout {
  name?: string;
  type?: string;
  duration?: number;
  calories?: number;
  distance?: number;
  steps?: number;
  date?: string;
  notes?: string;
  heartRate?: number;
  avgSpeed?: number;
  maxSpeed?: number;
  elevationGain?: number;
  gpsTrace?: object;
}

interface ImportApiResponse {
  message: string;
  workouts: any[];
}

const WorkoutImport: React.FC<{ onImportSuccess: () => void }> = ({ onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('请选择一个文件');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Read file content
      const fileContent = await readFileAsText(file);
      
      // Parse file content based on file type
      let importedData: any[] = [];
      
      if (file.name.endsWith('.json')) {
        importedData = parseJsonFile(fileContent);
      } else if (file.name.endsWith('.csv')) {
        importedData = parseCsvFile(fileContent);
      } else {
        throw new Error('不支持的文件格式。请上传JSON或CSV文件。');
      }

      // Transform data to our format
      const transformedData = importedData.map(item => transformImportedWorkout(item, {}));
      
      // Send to backend
      const response = await workoutAPI.import({ workouts: transformedData });
      
      const importData = response.data as ImportApiResponse;
      setSuccess(`成功导入 ${importData.workouts.length} 条运动记录`);
      setFile(null);
      onImportSuccess();
    } catch (err: any) {
      setError(err.message || '导入失败，请检查文件格式');
    } finally {
      setLoading(false);
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const parseJsonFile = (content: string): any[] => {
    try {
      const data = JSON.parse(content);
      // Handle both array and object with workouts property
      if (Array.isArray(data)) {
        return data;
      } else if (data.workouts && Array.isArray(data.workouts)) {
        return data.workouts;
      } else {
        throw new Error('JSON文件格式不正确');
      }
    } catch (err) {
      throw new Error('无效的JSON文件');
    }
  };

  const parseCsvFile = (content: string): any[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV文件内容为空');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const workouts: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length !== headers.length) continue;

      const workout: any = {};
      headers.forEach((header, index) => {
        const value = values[index].trim();
        // Try to convert to appropriate type
        if (value === '') {
          workout[header] = undefined;
        } else if (!isNaN(Number(value))) {
          workout[header] = Number(value);
        } else {
          workout[header] = value;
        }
      });
      workouts.push(workout);
    }

    return workouts;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <span className="text-2xl mr-2">📥</span>
        导入运动数据
      </h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          选择文件 (支持 JSON 或 CSV 格式)
        </label>
        <input
          type="file"
          accept=".json,.csv"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          支持从 Apple Health、华为运动健康等平台导出的数据格式
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-green-500">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleImport}
          disabled={loading || !file}
          className={`py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
            loading || !file
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? '⏳ 导入中...' : '📤 导入数据'}
        </button>
        
        <button
          onClick={() => setFile(null)}
          className="py-2 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-200"
        >
          清除
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-semibold mb-2">支持的数据格式：</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>JSON格式</strong>: 包含workouts数组的对象，或直接为workouts数组</li>
          <li><strong>CSV格式</strong>: 第一行为字段名，后续每行为一条运动记录</li>
          <li>支持字段：name, type, duration, calories, distance, steps, date, notes, heartRate, avgSpeed, maxSpeed, elevationGain</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkoutImport;