import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  profile: {
    id: number;
    userId: number;
    height: number | null;
    weight: number | null;
    age: number | null;
    gender: string | null;
    avatarUrl: string | null;
    bio: string | null;
  } | null;
  metricsHistory: Array<{
    id: number;
    weight: number;
    bmi: number;
    bodyFatPercentage: number;
    bmr: number;
    recordedDate: string;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  metricsHistory: [],
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: '@@app/profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState['profile']>) => {
      state.profile = action.payload;
    },
    setMetricsHistory: (state, action: PayloadAction<ProfileState['metricsHistory']>) => {
      state.metricsHistory = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<ProfileState['profile']>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    addMetricRecord: (state, action: PayloadAction<ProfileState['metricsHistory'][0]>) => {
      state.metricsHistory.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProfile, setMetricsHistory, updateProfile, addMetricRecord, setLoading, setError } = profileSlice.actions;
export default profileSlice.reducer;