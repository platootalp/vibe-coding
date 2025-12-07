import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import workoutReducer from './workoutSlice';
import healthReducer from './healthSlice'; // Add health reducer

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    workouts: workoutReducer,
    health: healthReducer, // Add health reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;