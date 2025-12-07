import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice';
import workoutReducer from './workoutSlice';
import healthReducer from './healthSlice';
import workoutPlanReducer from './workoutPlanSlice';
import nutritionReducer from './nutritionSlice';
import socialReducer from './socialSlice';
import notificationReducer from './notificationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    workouts: workoutReducer,
    health: healthReducer,
    workoutPlans: workoutPlanReducer,
    nutrition: nutritionReducer,
    social: socialReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;