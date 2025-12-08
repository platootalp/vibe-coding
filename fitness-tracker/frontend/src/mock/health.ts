// Mock health data
export const mockHealthProfiles = [
    {
        id: 1,
        userId: 1,
        height: 175,
        weight: 70,
        bmi: 22.9,
        bodyFatPercentage: 18.5,
        muscleMass: 32.5,
        bmr: 1680,
        goals: ['减脂', '增肌'],
        medicalConditions: [],
        medications: [],
        createdAt: '2023-01-15T08:30:00Z',
        updatedAt: '2023-03-15T10:00:00Z'
    },
    {
        id: 2,
        userId: 2,
        height: 160,
        weight: 55,
        bmi: 21.5,
        bodyFatPercentage: 22.0,
        muscleMass: 24.0,
        bmr: 1350,
        goals: ['保持身材', '提高耐力'],
        medicalConditions: [],
        medications: [],
        createdAt: '2023-02-20T10:15:00Z',
        updatedAt: '2023-03-16T09:30:00Z'
    }
];

// Mock metrics history
export const mockMetricsHistory = [
    {
        id: 1,
        userId: 1,
        date: '2023-03-01',
        weight: 72,
        bodyFatPercentage: 20.0,
        muscleMass: 31.0,
        bmi: 23.5
    },
    {
        id: 2,
        userId: 1,
        date: '2023-03-08',
        weight: 71,
        bodyFatPercentage: 19.5,
        muscleMass: 31.5,
        bmi: 23.2
    },
    {
        id: 3,
        userId: 1,
        date: '2023-03-15',
        weight: 70,
        bodyFatPercentage: 18.5,
        muscleMass: 32.5,
        bmi: 22.9
    }
];