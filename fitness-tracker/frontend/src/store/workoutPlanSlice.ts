import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { workoutPlanAPI } from '../services/api';

// Define types
interface WorkoutType {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  metValue: number;
  createdAt: string;
  updatedAt: string;
}

interface WorkoutPlan {
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
  createdAt: string;
  updatedAt: string;
  workoutType?: WorkoutType;
}

interface WorkoutPlanState {
  plans: WorkoutPlan[];
  workoutTypes: WorkoutType[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: WorkoutPlanState = {
  plans: [],
  workoutTypes: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchWorkoutPlans = createAsyncThunk(
  'workoutPlans/fetchPlans',
  async (params: { activeOnly?: boolean } = {}, { rejectWithValue }) => {
    try {
      const response = await workoutPlanAPI.getWorkoutPlans(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout plans');
    }
  }
);

export const fetchWorkoutPlan = createAsyncThunk(
  'workoutPlans/fetchPlan',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await workoutPlanAPI.getWorkoutPlan(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout plan');
    }
  }
);

export const createWorkoutPlan = createAsyncThunk(
  'workoutPlans/createPlan',
  async (planData: Partial<WorkoutPlan>, { rejectWithValue }) => {
    try {
      const response = await workoutPlanAPI.createWorkoutPlan(planData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workout plan');
    }
  }
);

export const updateWorkoutPlan = createAsyncThunk(
  'workoutPlans/updatePlan',
  async ({ id, ...planData }: { id: string; planData: Partial<WorkoutPlan> }, { rejectWithValue }) => {
    try {
      const response = await workoutPlanAPI.updateWorkoutPlan(id, planData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update workout plan');
    }
  }
);

export const deleteWorkoutPlan = createAsyncThunk(
  'workoutPlans/deletePlan',
  async (id: string, { rejectWithValue }) => {
    try {
      await workoutPlanAPI.deleteWorkoutPlan(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workout plan');
    }
  }
);

export const fetchWorkoutTypes = createAsyncThunk(
  'workoutPlans/fetchTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutPlanAPI.getWorkoutTypes();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workout types');
    }
  }
);

// Slice
const workoutPlanSlice = createSlice({
  name: '@@app/workoutPlans',
  initialState,
  reducers: {
    clearWorkoutPlanError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch workout plans
    builder.addCase(fetchWorkoutPlans.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkoutPlans.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = action.payload as WorkoutPlan[];
    });
    builder.addCase(fetchWorkoutPlans.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch workout plan
    builder.addCase(fetchWorkoutPlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkoutPlan.fulfilled, (state, action) => {
      state.loading = false;
      const plan = action.payload as WorkoutPlan;
      const index = state.plans.findIndex(p => p.id === plan.id);
      if (index !== -1) {
        state.plans[index] = plan;
      } else {
        state.plans.push(plan);
      }
    });
    builder.addCase(fetchWorkoutPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create workout plan
    builder.addCase(createWorkoutPlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createWorkoutPlan.fulfilled, (state, action) => {
      state.loading = false;
      state.plans.push(action.payload as WorkoutPlan);
    });
    builder.addCase(createWorkoutPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update workout plan
    builder.addCase(updateWorkoutPlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateWorkoutPlan.fulfilled, (state, action) => {
      state.loading = false;
      const plan = action.payload as WorkoutPlan;
      const index = state.plans.findIndex(p => p.id === plan.id);
      if (index !== -1) {
        state.plans[index] = plan;
      }
    });
    builder.addCase(updateWorkoutPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete workout plan
    builder.addCase(deleteWorkoutPlan.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteWorkoutPlan.fulfilled, (state, action) => {
      state.loading = false;
      state.plans = state.plans.filter(p => p.id !== action.payload);
    });
    builder.addCase(deleteWorkoutPlan.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch workout types
    builder.addCase(fetchWorkoutTypes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkoutTypes.fulfilled, (state, action) => {
      state.loading = false;
      state.workoutTypes = action.payload as WorkoutType[];
    });
    builder.addCase(fetchWorkoutTypes.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearWorkoutPlanError } = workoutPlanSlice.actions;
export default workoutPlanSlice.reducer;