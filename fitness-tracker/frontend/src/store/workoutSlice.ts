import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkoutState {
  workouts: Array<{
    id: string;
    userId: number;
    workoutTypeId: number;
    name: string;
    durationMinutes: number;
    caloriesBurned: number;
    distanceKm?: number;
    steps?: number;
    startTime: string;
    endTime: string;
    // Enhanced fields for real-time data
    heartRate?: number;
    avgSpeed?: number;
    maxSpeed?: number;
    elevationGain?: number;
    gpsTrace?: object;
  }>;
  workoutTypes: Array<{
    id: number;
    name: string;
    description: string;
    iconUrl: string;
    metValue: number;
  }>;
  plans: Array<{
    id: string;
    userId: number;
    workoutTypeId?: number;
    name: string;
    description: string;
    goal: string;
    durationWeeks: number;
    planDetails: any;
    startDate: string;
    endDate: string;
    isActive: boolean;
    workoutType?: {
      id: number;
      name: string;
      description: string;
      iconUrl: string;
      metValue: number;
    };
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: WorkoutState = {
  workouts: [],
  workoutTypes: [],
  plans: [],
  loading: false,
  error: null,
};

const workoutSlice = createSlice({
  name: '@@app/workout',
  initialState,
  reducers: {
    setWorkouts: (state, action: PayloadAction<WorkoutState['workouts']>) => {
      state.workouts = action.payload;
    },
    setWorkoutTypes: (state, action: PayloadAction<WorkoutState['workoutTypes']>) => {
      state.workoutTypes = action.payload;
    },
    setPlans: (state, action: PayloadAction<WorkoutState['plans']>) => {
      state.plans = action.payload;
    },
    addWorkout: (state, action: PayloadAction<WorkoutState['workouts'][0]>) => {
      state.workouts.push(action.payload);
    },
    updateWorkout: (state, action: PayloadAction<WorkoutState['workouts'][0]>) => {
      const index = state.workouts.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.workouts[index] = action.payload;
      }
    },
    removeWorkout: (state, action: PayloadAction<string>) => {
      state.workouts = state.workouts.filter(w => w.id !== action.payload);
    },
    addPlan: (state, action: PayloadAction<WorkoutState['plans'][0]>) => {
      state.plans.push(action.payload);
    },
    updatePlan: (state, action: PayloadAction<WorkoutState['plans'][0]>) => {
      const index = state.plans.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.plans[index] = action.payload;
      }
    },
    removePlan: (state, action: PayloadAction<string>) => {
      state.plans = state.plans.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setWorkouts, 
  setWorkoutTypes, 
  setPlans, 
  addWorkout, 
  updateWorkout, 
  removeWorkout, 
  addPlan, 
  updatePlan, 
  removePlan, 
  setLoading, 
  setError 
} = workoutSlice.actions;

export default workoutSlice.reducer;