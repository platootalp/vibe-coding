import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks/reduxHooks';
import { 
  fetchNutritionLogs, 
  fetchFoods, 
  fetchMeals, 
  fetchNutritionSummary,
  createNutritionLog,
  updateNutritionLog,
  deleteNutritionLog,
  setSelectedDate,
  clearNutritionError
} from '../store/nutritionSlice';

const Nutrition: React.FC = () => {
  const dispatch = useAppDispatch();
  const { logs, foods, meals, summary, selectedDate, loading, error } = useAppSelector((state: any) => state.nutrition);
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    foodId: '',
    mealId: '',
    quantity: 1,
    consumedAt: new Date().toISOString().slice(0, 16)
  });
  
  // Search state
  const [foodSearch, setFoodSearch] = useState('');

  // Fetch data on component mount and when date changes
  useEffect(() => {
    dispatch(fetchNutritionLogs({ date: selectedDate }));
    dispatch(fetchMeals());
    dispatch(fetchNutritionSummary({ date: selectedDate }));
  }, [dispatch, selectedDate]);

  // Fetch foods when search term changes
  useEffect(() => {
    if (foodSearch.length >= 2) {
      dispatch(fetchFoods({ search: foodSearch }));
    } else {
      dispatch(fetchFoods({}));
    }
  }, [dispatch, foodSearch]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'foodId' || name === 'mealId' ? value : 
               name === 'quantity' ? parseFloat(value) || 0 : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.foodId || !formData.mealId) {
      alert('Please select both food and meal');
      return;
    }
    
    if (formData.quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }
    
    // Submit form
    const logData = {
      ...formData,
      foodId: parseInt(formData.foodId),
      mealId: parseInt(formData.mealId),
      consumedAt: new Date(formData.consumedAt).toISOString()
    };
    
    if (editingLogId) {
      dispatch(updateNutritionLog({ id: editingLogId, logData }));
    } else {
      dispatch(createNutritionLog(logData));
    }
    
    // Reset form
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setEditingLogId(null);
    setFormData({
      foodId: '',
      mealId: '',
      quantity: 1,
      consumedAt: new Date().toISOString().slice(0, 16)
    });
  };

  // Edit log
  const handleEdit = (log: any) => {
    setEditingLogId(log.id);
    setShowForm(true);
    setFormData({
      foodId: log.foodId.toString(),
      mealId: log.mealId.toString(),
      quantity: log.quantity,
      consumedAt: new Date(log.consumedAt).toISOString().slice(0, 16)
    });
  };

  // Delete log
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this nutrition log?')) {
      dispatch(deleteNutritionLog(id));
    }
  };

  // Handle date change
  const handleDateChange = (date: string) => {
    dispatch(setSelectedDate(date));
  };

  // Clear error
  const handleClearError = () => {
    dispatch(clearNutritionError());
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">膳食记录</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 font-medium shadow-md transition-all duration-200"
        >
          {showForm ? '取消' : '添加记录'}
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
      
      {/* Date selector */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">选择日期</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingLogId ? '编辑膳食记录' : '添加新的膳食记录'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">食物 *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索食物..."
                    value={foodSearch}
                    onChange={(e) => setFoodSearch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {foods.length > 0 && foodSearch.length >= 2 && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
                      {foods.map((food: any) => (
                        <div
                          key={food.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, foodId: food.id.toString() }));
                            setFoodSearch('');
                          }}
                        >
                          <div className="font-medium">{food.name}</div>
                          <div className="text-sm text-gray-500">
                            {food.calories} kcal | P: {food.proteinG}g | C: {food.carbsG}g | F: {food.fatG}g
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formData.foodId && (
                  <div className="mt-2 px-4 py-2 bg-blue-50 rounded-lg">
                    <div className="font-medium">
                      {foods.find((f: any) => f.id === parseInt(formData.foodId))?.name}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">餐次 *</label>
                <select
                  name="mealId"
                  value={formData.mealId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">选择餐次</option>
                  {meals.map((meal: any) => (
                    <option key={meal.id} value={meal.id}>
                      {meal.name} - {meal.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">份量</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0.01"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">食用时间</label>
                <input
                  type="datetime-local"
                  name="consumedAt"
                  value={formData.consumedAt}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
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
                {loading ? '保存中...' : (editingLogId ? '更新记录' : '添加记录')}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Nutrition Summary */}
      {summary && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">营养概览 - {selectedDate}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.totals.calories || 0}</div>
              <div className="text-gray-600">卡路里 (kcal)</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{summary.totals.protein || 0}g</div>
              <div className="text-gray-600">蛋白质</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{summary.totals.carbs || 0}g</div>
              <div className="text-gray-600">碳水化合物</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{summary.totals.fat || 0}g</div>
              <div className="text-gray-600">脂肪</div>
            </div>
          </div>
          
          {/* Meals breakdown */}
          {Object.keys(summary.meals).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">各餐次详情</h3>
              <div className="space-y-4">
                {Object.entries(summary.meals).map(([mealName, mealData]) => (
                  <div key={mealName} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-800">{mealName}</h4>
                      <div className="text-sm text-gray-600">
                        {(mealData as any).calories} kcal
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
                      <div>食物</div>
                      <div className="text-right">份量</div>
                      <div className="text-right">卡路里</div>
                      <div className="text-right">时间</div>
                    </div>
                    {(mealData as any).logs.map((log: any) => (
                      <div key={log.id} className="grid grid-cols-4 gap-2 text-sm py-2 border-t border-gray-100">
                        <div>{log.food}</div>
                        <div className="text-right">{log.quantity}</div>
                        <div className="text-right">{log.calories.toFixed(0)} kcal</div>
                        <div className="text-right">{formatDate(log.consumedAt)}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Nutrition Logs */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">膳食记录详情</h2>
        </div>
        
        {logs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {logs.map((log: any) => (
              <div key={log.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium text-gray-900">{log.food?.name}</h3>
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {log.meal?.name}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">份量</p>
                        <p className="text-gray-900">{log.quantity} x {log.food?.servingSize}{log.food?.servingUnit}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">卡路里</p>
                        <p className="text-gray-900">
                          {log.food && ((log.food.calories * log.quantity * log.food.servingSize) / 100).toFixed(0)} kcal
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">食用时间</p>
                        <p className="text-gray-900">{new Date(log.consumedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(log)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium hover:bg-blue-200"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <p className="text-gray-500">暂无膳食记录</p>
            <p className="text-gray-400 text-sm mt-1">添加您的第一条膳食记录开始跟踪营养摄入</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;