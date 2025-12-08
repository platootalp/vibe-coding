// Mock API service to simulate backend responses
import { mockUsers, mockUserProfiles } from './users';
import { mockWorkouts, mockWorkoutTypes, mockWorkoutPlans } from './workouts';
import { mockNutritionLogs, mockFoods, mockMeals } from './nutrition';
import { mockHealthProfiles, mockMetricsHistory } from './health';

// Mock authentication tokens
const MOCK_TOKEN = 'mock-jwt-token';
const AUTHENTICATED_USER_ID = 1;

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAuthAPI = {
    login: async (credentials: { email: string; password: string }) => {
        await delay(500); // Simulate network delay

        // Simple mock authentication - accept any non-empty email/password
        if (credentials.email && credentials.password) {
            const user = mockUsers.find(u => u.email === credentials.email) || mockUsers[0];
            return {
                token: MOCK_TOKEN,
                user
            };
        } else {
            throw new Error('Invalid credentials');
        }
    },

    register: async (data: { name: string; email: string; password: string }) => {
        await delay(500); // Simulate network delay

        // Simple mock registration - accept any non-empty data
        if (data.name && data.email && data.password) {
            const newUser = {
                id: mockUsers.length + 1,
                name: data.name,
                email: data.email,
                role: 'user',
                age: null,
                height: null,
                weight: null,
                gender: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            return {
                token: MOCK_TOKEN,
                user: newUser
            };
        } else {
            throw new Error('Invalid registration data');
        }
    },

    logout: async () => {
        await delay(200); // Simulate network delay
        // Logout is stateless in mock mode
        return { success: true };
    }
};

export const mockUserAPI = {
    getProfile: async () => {
        await delay(300); // Simulate network delay
        const profile = mockUserProfiles.find(p => p.userId === AUTHENTICATED_USER_ID) || mockUserProfiles[0];
        return profile;
    },

    updateProfile: async (userData: any) => {
        await delay(300); // Simulate network delay
        // In mock mode, we just return the updated data
        return {
            ...mockUserProfiles.find(p => p.userId === AUTHENTICATED_USER_ID) || mockUserProfiles[0],
            ...userData,
            updatedAt: new Date().toISOString()
        };
    }
};

export const mockWorkoutAPI = {
    getAll: async () => {
        await delay(300); // Simulate network delay
        return mockWorkouts.filter(w => w.userId === AUTHENTICATED_USER_ID);
    },

    getById: async (id: string) => {
        await delay(200); // Simulate network delay
        const workout = mockWorkouts.find(w => w.id === parseInt(id) && w.userId === AUTHENTICATED_USER_ID);
        if (!workout) {
            throw new Error('Workout not found');
        }
        return workout;
    },

    create: async (data: any) => {
        await delay(300); // Simulate network delay
        const newWorkout = {
            id: mockWorkouts.length + 1,
            userId: AUTHENTICATED_USER_ID,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to mock data (in real app, this would be handled by backend)
        mockWorkouts.push(newWorkout);

        return newWorkout;
    },

    update: async (id: string, data: any) => {
        await delay(300); // Simulate network delay
        const index = mockWorkouts.findIndex(w => w.id === parseInt(id) && w.userId === AUTHENTICATED_USER_ID);
        if (index === -1) {
            throw new Error('Workout not found');
        }

        mockWorkouts[index] = {
            ...mockWorkouts[index],
            ...data,
            updatedAt: new Date().toISOString()
        };

        return mockWorkouts[index];
    },

    delete: async (id: string) => {
        await delay(200); // Simulate network delay
        const index = mockWorkouts.findIndex(w => w.id === parseInt(id) && w.userId === AUTHENTICATED_USER_ID);
        if (index === -1) {
            throw new Error('Workout not found');
        }

        mockWorkouts.splice(index, 1);
        return { success: true };
    },

    getTypes: async () => {
        await delay(200); // Simulate network delay
        return mockWorkoutTypes;
    },

    getPlans: async () => {
        await delay(300); // Simulate network delay
        return mockWorkoutPlans.filter(p => p.userId === AUTHENTICATED_USER_ID);
    },

    createPlan: async (planData: any) => {
        await delay(300); // Simulate network delay
        const newPlan = {
            id: mockWorkoutPlans.length + 1,
            userId: AUTHENTICATED_USER_ID,
            ...planData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to mock data (in real app, this would be handled by backend)
        mockWorkoutPlans.push(newPlan);

        return newPlan;
    },

    updatePlan: async (id: string, planData: any) => {
        await delay(300); // Simulate network delay
        const index = mockWorkoutPlans.findIndex(p => p.id === parseInt(id) && p.userId === AUTHENTICATED_USER_ID);
        if (index === -1) {
            throw new Error('Workout plan not found');
        }

        mockWorkoutPlans[index] = {
            ...mockWorkoutPlans[index],
            ...planData,
            updatedAt: new Date().toISOString()
        };

        return mockWorkoutPlans[index];
    },

    deletePlan: async (id: string) => {
        await delay(200); // Simulate network delay
        const index = mockWorkoutPlans.findIndex(p => p.id === parseInt(id) && p.userId === AUTHENTICATED_USER_ID);
        if (index === -1) {
            throw new Error('Workout plan not found');
        }

        mockWorkoutPlans.splice(index, 1);
        return { success: true };
    }
};

export const mockHealthAPI = {
    getHealthProfile: async () => {
        await delay(300); // Simulate network delay
        const profile = mockHealthProfiles.find(h => h.userId === AUTHENTICATED_USER_ID) || mockHealthProfiles[0];
        return profile;
    },

    updateHealthProfile: async (profileData: any) => {
        await delay(300); // Simulate network delay
        const index = mockHealthProfiles.findIndex(h => h.userId === AUTHENTICATED_USER_ID);
        if (index === -1) {
            throw new Error('Health profile not found');
        }

        mockHealthProfiles[index] = {
            ...mockHealthProfiles[index],
            ...profileData,
            updatedAt: new Date().toISOString()
        };

        return mockHealthProfiles[index];
    },

    getMetricsHistory: async () => {
        await delay(300); // Simulate network delay
        return mockMetricsHistory.filter(m => m.userId === AUTHENTICATED_USER_ID);
    },

    addMetricsRecord: async (metricsData: any) => {
        await delay(300); // Simulate network delay
        const newRecord = {
            id: mockMetricsHistory.length + 1,
            userId: AUTHENTICATED_USER_ID,
            ...metricsData
        };

        // Add to mock data (in real app, this would be handled by backend)
        mockMetricsHistory.push(newRecord);

        return newRecord;
    }
};

export const mockNutritionAPI = {
    getNutritionLogs: async () => {
        await delay(300); // Simulate network delay
        return mockNutritionLogs.filter(n => n.userId === AUTHENTICATED_USER_ID);
    },

    getFoods: async () => {
        await delay(200); // Simulate network delay
        return mockFoods;
    },

    getMeals: async () => {
        await delay(200); // Simulate network delay
        return mockMeals;
    },

    createNutritionLog: async (logData: any) => {
        await delay(300); // Simulate network delay
        const newLog = {
            id: mockNutritionLogs.length + 1,
            userId: AUTHENTICATED_USER_ID,
            ...logData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Add to mock data (in real app, this would be handled by backend)
        mockNutritionLogs.push(newLog);

        return newLog;
    },

    updateNutritionLog: async (id: string, logData: any) => {
        await delay(300); // Simulate network delay
        const index = mockNutritionLogs.findIndex(n => n.id === parseInt(id) && n.userId === AUTHENTICATED_USER_ID);
        if (index === -1) {
            throw new Error('Nutrition log not found');
        }

        mockNutritionLogs[index] = {
            ...mockNutritionLogs[index],
            ...logData,
            updatedAt: new Date().toISOString()
        };

        return mockNutritionLogs[index];
    },

    deleteNutritionLog: async (id: string) => {
        await delay(200); // Simulate network delay
        const index = mockNutritionLogs.findIndex(n => n.id === parseInt(id) && n.userId === AUTHENTICATED_USER_ID);
        if (index === -1) {
            throw new Error('Nutrition log not found');
        }

        mockNutritionLogs.splice(index, 1);
        return { success: true };
    }
};