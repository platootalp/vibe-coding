// Mock nutrition data
export const mockNutritionLogs = [
    {
        id: 1,
        userId: 1,
        date: '2023-03-15',
        mealType: 'breakfast',
        foodItems: [
            { name: '燕麦粥', calories: 150, protein: 5, carbs: 27, fat: 3 },
            { name: '牛奶', calories: 120, protein: 8, carbs: 12, fat: 5 }
        ],
        totalCalories: 270,
        totalProtein: 13,
        totalCarbs: 39,
        totalFat: 8,
        createdAt: '2023-03-15T09:00:00Z',
        updatedAt: '2023-03-15T09:00:00Z'
    },
    {
        id: 2,
        userId: 1,
        date: '2023-03-15',
        mealType: 'lunch',
        foodItems: [
            { name: '鸡胸肉沙拉', calories: 320, protein: 35, carbs: 12, fat: 15 },
            { name: '苹果', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 }
        ],
        totalCalories: 415,
        totalProtein: 35.5,
        totalCarbs: 37,
        totalFat: 15.3,
        createdAt: '2023-03-15T13:00:00Z',
        updatedAt: '2023-03-15T13:00:00Z'
    }
];

// Mock food database
export const mockFoods = [
    { id: 1, name: '鸡胸肉', calories: 165, protein: 31, carbs: 0, fat: 3.6, unit: '100g' },
    { id: 2, name: '三文鱼', calories: 208, protein: 20, carbs: 0, fat: 13, unit: '100g' },
    { id: 3, name: '糙米', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, unit: '100g' },
    { id: 4, name: '西兰花', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, unit: '100g' },
    { id: 5, name: '牛油果', calories: 160, protein: 2, carbs: 9, fat: 15, unit: '100g' }
];

// Mock meals
export const mockMeals = [
    { id: 1, name: '早餐', time: '07:00' },
    { id: 2, name: '上午加餐', time: '10:00' },
    { id: 3, name: '午餐', time: '12:30' },
    { id: 4, name: '下午加餐', time: '15:30' },
    { id: 5, name: '晚餐', time: '18:30' },
    { id: 6, name: '睡前加餐', time: '21:00' }
];