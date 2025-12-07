import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { nutritionAPI } from '../services/api';

// Define types
interface Food {
  id: number;
  name: string;
  brand?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSize: number;
  servingUnit: string;
  nutrients?: object;
  createdAt: string;
  updatedAt: string;
}

interface Meal {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface NutritionLog {
  id: number;
  userId: number;
  foodId: number;
  mealId: number;
  quantity: number;
  consumedAt: string;
  createdAt: string;
  updatedAt: string;
  food?: Food;
  meal?: Meal;
}

interface NutritionSummary {
  date: string;
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: {
    [key: string]: {
      meal: string;
      logs: Array<{
        id: number;
        food: string;
        quantity: number;
        servingSize: number;
        servingUnit: string;
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        consumedAt: string;
      }>;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
}

interface NutritionState {
  logs: NutritionLog[];
  foods: Food[];
  meals: Meal[];
  summary: NutritionSummary | null;
  selectedDate: string;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: NutritionState = {
  logs: [],
  foods: [],
  meals: [],
  summary: null,
  selectedDate: new Date().toISOString().split('T')[0],
  loading: false,
  error: null,
};

// Async thunks
export const fetchNutritionLogs = createAsyncThunk(
  'nutrition/fetchLogs',
  async (params: { date?: string; mealId?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await nutritionAPI.getNutritionLogs(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition logs');
    }
  }
);

export const fetchNutritionLog = createAsyncThunk(
  'nutrition/fetchLog',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await nutritionAPI.getNutritionLog(String(id));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition log');
    }
  }
);

export const createNutritionLog = createAsyncThunk(
  'nutrition/createLog',
  async (logData: Partial<NutritionLog>, { rejectWithValue }) => {
    try {
      const response = await nutritionAPI.createNutritionLog(logData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create nutrition log');
    }
  }
);

export const updateNutritionLog = createAsyncThunk(
  'nutrition/updateLog',
  async ({ id, ...logData }: { id: number; logData: Partial<NutritionLog> }, { rejectWithValue }) => {
    try {
      const response = await nutritionAPI.updateNutritionLog(String(id), logData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update nutrition log');
    }
  }
);

export const deleteNutritionLog = createAsyncThunk(
  'nutrition/deleteLog',
  async (id: number, { rejectWithValue }) => {
    try {
      await nutritionAPI.deleteNutritionLog(String(id));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete nutrition log');
    }
  }
);

export const fetchFoods = createAsyncThunk(
  'nutrition/fetchFoods',
  async (params: { search?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await nutritionAPI.getFoods(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch foods');
    }
  }
);

export const fetchMeals = createAsyncThunk(
  'nutrition/fetchMeals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await nutritionAPI.getMeals();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meals');
    }
  }
);

export const fetchNutritionSummary = createAsyncThunk(
  'nutrition/fetchSummary',
  async (params: { date?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await nutritionAPI.getNutritionSummary(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nutrition summary');
    }
  }
);

// Slice
const nutritionSlice = createSlice({
  name: '@@app/nutrition',
  initialState,
  reducers: {
    clearNutritionError: (state) => {
      state.error = null;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setNutritionLogs: (state, action: PayloadAction<NutritionLog[]>) => {
      state.logs = action.payload;
    },
    setFoods: (state, action: PayloadAction<Food[]>) => {
      state.foods = action.payload;
    },
    setMeals: (state, action: PayloadAction<Meal[]>) => {
      state.meals = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch nutrition logs
    builder.addCase(fetchNutritionLogs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNutritionLogs.fulfilled, (state, action) => {
      state.loading = false;
      state.logs = action.payload as NutritionLog[];
    });
    builder.addCase(fetchNutritionLogs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch nutrition log
    builder.addCase(fetchNutritionLog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNutritionLog.fulfilled, (state, action) => {
      state.loading = false;
      const log = action.payload as NutritionLog;
      const index = state.logs.findIndex(l => l.id === log.id);
      if (index !== -1) {
        state.logs[index] = log;
      } else {
        state.logs.push(log);
      }
    });
    builder.addCase(fetchNutritionLog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create nutrition log
    builder.addCase(createNutritionLog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNutritionLog.fulfilled, (state, action) => {
      state.loading = false;
      state.logs.push(action.payload as NutritionLog);
    });
    builder.addCase(createNutritionLog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update nutrition log
    builder.addCase(updateNutritionLog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateNutritionLog.fulfilled, (state, action) => {
      state.loading = false;
      const log = action.payload as NutritionLog;
      const index = state.logs.findIndex(l => l.id === log.id);
      if (index !== -1) {
        state.logs[index] = log;
      }
    });
    builder.addCase(updateNutritionLog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete nutrition log
    builder.addCase(deleteNutritionLog.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteNutritionLog.fulfilled, (state, action) => {
      state.loading = false;
      state.logs = state.logs.filter(l => l.id !== action.payload);
    });
    builder.addCase(deleteNutritionLog.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch foods
    builder.addCase(fetchFoods.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFoods.fulfilled, (state, action) => {
      state.loading = false;
      state.foods = action.payload as Food[];
    });
    builder.addCase(fetchFoods.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch meals
    builder.addCase(fetchMeals.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchMeals.fulfilled, (state, action) => {
      state.loading = false;
      state.meals = action.payload as Meal[];
    });
    builder.addCase(fetchMeals.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch nutrition summary
    builder.addCase(fetchNutritionSummary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchNutritionSummary.fulfilled, (state, action) => {
      state.loading = false;
      state.summary = action.payload as NutritionSummary;
    });
    builder.addCase(fetchNutritionSummary.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { 
  clearNutritionError, 
  setSelectedDate, 
  setNutritionLogs, 
  setFoods, 
  setMeals 
} = nutritionSlice.actions;

export default nutritionSlice.reducer;