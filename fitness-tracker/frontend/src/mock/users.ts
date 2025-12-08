// Mock user data
export const mockUsers = [
    {
        id: 1,
        name: '张三',
        email: 'zhangsan@example.com',
        role: 'user',
        age: 28,
        height: 175,
        weight: 70,
        gender: 'male',
        createdAt: '2023-01-15T08:30:00Z',
        updatedAt: '2023-01-15T08:30:00Z'
    },
    {
        id: 2,
        name: '李四',
        email: 'lisi@example.com',
        role: 'user',
        age: 32,
        height: 160,
        weight: 55,
        gender: 'female',
        createdAt: '2023-02-20T10:15:00Z',
        updatedAt: '2023-02-20T10:15:00Z'
    }
];

// Mock user profiles
export const mockUserProfiles = [
    {
        id: 1,
        userId: 1,
        bio: '热爱健身和户外运动',
        fitnessLevel: '中级',
        goals: ['减脂', '增肌'],
        createdAt: '2023-01-15T08:30:00Z',
        updatedAt: '2023-01-15T08:30:00Z'
    },
    {
        id: 2,
        userId: 2,
        bio: '专业健身教练',
        fitnessLevel: '高级',
        goals: ['保持身材', '提高耐力'],
        createdAt: '2023-02-20T10:15:00Z',
        updatedAt: '2023-02-20T10:15:00Z'
    }
];