import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { healthAPI } from '../services/api';

// Define types
interface HealthProfile {
  id: number;
  userId: number;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

interface MetricsRecord {
  id: number;
  userId: number;
  weight?: number;
  bmi?: number;
  bodyFatPercentage?: number;
  bmr?: number;
  recordedDate: string;
  createdAt: string;
  updatedAt: string;
}

interface HealthState {
  profile: HealthProfile | null;
  metricsHistory: MetricsRecord[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: HealthState = {
  profile: null,
  metricsHistory: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchHealthProfile = createAsyncThunk(
  'health/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await healthAPI.getHealthProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch health profile');
    }
  }
);

export const updateHealthProfile = createAsyncThunk(
  'health/updateProfile',
  async (profileData: Partial<HealthProfile>, { rejectWithValue }) => {
    try {
      const response = await healthAPI.updateHealthProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update health profile');
    }
  }
);

export const fetchMetricsHistory = createAsyncThunk(
  'health/fetchMetricsHistory',
  async (params: { period?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await healthAPI.getMetricsHistory(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch metrics history');
    }
  }
);

export const addMetricsRecord = createAsyncThunk(
  'health/addMetricsRecord',
  async (metricsData: Partial<MetricsRecord>, { rejectWithValue }) => {
    try {
      const response = await healthAPI.addMetricsRecord(metricsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add metrics record');
    }
  }
);

export const updateMetricsRecord = createAsyncThunk(
  'health/updateMetricsRecord',
  async ({ id, ...metricsData }: { id: number; metricsData: Partial<MetricsRecord> }, { rejectWithValue }) => {
    try {
      const response = await healthAPI.updateMetricsRecord(String(id), metricsData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update metrics record');
    }
  }
);

export const deleteMetricsRecord = createAsyncThunk(
  'health/deleteMetricsRecord',
  async (id: number, { rejectWithValue }) => {
    try {
      await healthAPI.deleteMetricsRecord(String(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete metrics record');
    }
  }
);

// Slice
const healthSlice = createSlice({
  name: '@@app/health',
  initialState,
  reducers: {
    clearHealthError: (state) => {
      state.error = null;
    },
    setHealthProfile: (state, action: PayloadAction<HealthProfile>) => {
      state.profile = action.payload;
    },
    setMetricsHistory: (state, action: PayloadAction<MetricsRecord[]>) => {
      state.metricsHistory = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch health profile
    builder.addCase(fetchHealthProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchHealthProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload as HealthProfile;
    });
    builder.addCase(fetchHealthProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update health profile
    builder.addCase(updateHealthProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateHealthProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.profile = action.payload as HealthProfile;
    });
    builder.addCase(updateHealthProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch metrics history
    builder.addCase(fetchMetricsHistory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMetricsHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.metricsHistory = action.payload as MetricsRecord[];
    });
    builder.addCase(fetchMetricsHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add metrics record
    builder.addCase(addMetricsRecord.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addMetricsRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.metricsHistory.push(action.payload as MetricsRecord);
    });
    builder.addCase(addMetricsRecord.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update metrics record
    builder.addCase(updateMetricsRecord.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateMetricsRecord.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.metricsHistory.findIndex(record => record.id === (action.payload as MetricsRecord).id);
      if (index !== -1) {
        state.metricsHistory[index] = action.payload as MetricsRecord;
      }
    });
    builder.addCase(updateMetricsRecord.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete metrics record
    builder.addCase(deleteMetricsRecord.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteMetricsRecord.fulfilled, (state, action) => {
      state.loading = false;
      state.metricsHistory = state.metricsHistory.filter(record => record.id !== (action.payload as number));
    });
    builder.addCase(deleteMetricsRecord.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearHealthError, setHealthProfile, setMetricsHistory } = healthSlice.actions;
export default healthSlice.reducer;