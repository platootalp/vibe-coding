// Mock workout data
export const mockWorkouts = [
    {
        id: 1,
        userId: 1,
        name: '晨跑',
        type: 'running',
        duration: 30,
        calories: 300,
        distance: 5.2,
        steps: 4200,
        date: '2023-03-15T07:00:00Z',
        notes: '清晨空气清新，跑步感觉很棒',
        createdAt: '2023-03-15T08:00:00Z',
        updatedAt: '2023-03-15T08:00:00Z'
    },
    {
        id: 2,
        userId: 1,
        name: '健身房力量训练',
        type: 'strength',
        duration: 45,
        calories: 250,
        date: '2023-03-15T18:00:00Z',
        notes: '重点练习胸肌和背肌',
        createdAt: '2023-03-15T19:00:00Z',
        updatedAt: '2023-03-15T19:00:00Z'
    },
    {
        id: 3,
        userId: 2,
        name: '瑜伽课程',
        type: 'yoga',
        duration: 60,
        calories: 180,
        date: '2023-03-16T09:00:00Z',
        notes: '放松身心的瑜伽练习',
        createdAt: '2023-03-16T10:00:00Z',
        updatedAt: '2023-03-16T10:00:00Z'
    }
];

// Mock workout types
export const mockWorkoutTypes = [
    { id: 1, name: '跑步', category: 'cardio' },
    { id: 2, name: '骑行', category: 'cardio' },
    { id: 3, name: '游泳', category: 'cardio' },
    { id: 4, name: '力量训练', category: 'strength' },
    { id: 5, name: '瑜伽', category: 'flexibility' },
    { id: 6, name: '普拉提', category: 'flexibility' }
];

// Mock workout plans
export const mockWorkoutPlans = [
    {
        id: 1,
        userId: 1,
        name: '初学者减脂计划',
        description: '适合初学者的4周减脂训练计划',
        durationWeeks: 4,
        difficulty: '初级',
        isActive: true,
        createdAt: '2023-03-01T10:00:00Z',
        updatedAt: '2023-03-01T10:00:00Z'
    },
    {
        id: 2,
        userId: 2,
        name: '高级增肌计划',
        description: '专业级增肌训练方案',
        durationWeeks: 8,
        difficulty: '高级',
        isActive: true,
        createdAt: '2023-03-05T14:00:00Z',
        updatedAt: '2023-03-05T14:00:00Z'
    }
];