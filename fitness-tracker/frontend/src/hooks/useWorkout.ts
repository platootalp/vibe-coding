import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { 
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
} from '../store/workoutSlice';
import { workoutAPI } from '../services/api';

export const useWorkout = () => {
  const dispatch: AppDispatch = useDispatch();
  const { workouts, workoutTypes, plans, loading, error } = useSelector((state: RootState) => state.workouts);

  const fetchWorkouts = async () => {
    dispatch(setLoading(true));
    try {
      const response = await workoutAPI.getAll();
      dispatch(setWorkouts(response.data));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch workouts'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchWorkoutTypes = async () => {
    try {
      const response = await workoutAPI.getTypes();
      dispatch(setWorkoutTypes(response.data));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch workout types'));
    }
  };

  const fetchPlans = async () => {
    dispatch(setLoading(true));
    try {
      const response = await workoutAPI.getPlans();
      dispatch(setPlans(response.data));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch plans'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createWorkout = async (workoutData: any) => {
    try {
      const response = await workoutAPI.create(workoutData);
      dispatch(addWorkout(response.data));
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create workout';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const updateWorkoutRecord = async (id: string, workoutData: any) => {
    try {
      const response = await workoutAPI.update(id, workoutData);
      dispatch(updateWorkout(response.data));
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update workout';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const deleteWorkout = async (id: string) => {
    try {
      await workoutAPI.delete(id);
      dispatch(removeWorkout(id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete workout';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const createPlan = async (planData: any) => {
    try {
      const response = await workoutAPI.createPlan(planData);
      dispatch(addPlan(response.data));
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create plan';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const updatePlanRecord = async (id: string, planData: any) => {
    try {
      const response = await workoutAPI.updatePlan(id, planData);
      dispatch(updatePlan(response.data));
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update plan';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const deletePlan = async (id: string) => {
    try {
      await workoutAPI.deletePlan(id);
      dispatch(removePlan(id));
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete plan';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  return {
    workouts,
    workoutTypes,
    plans,
    loading,
    error,
    fetchWorkouts,
    fetchWorkoutTypes,
    fetchPlans,
    createWorkout,
    updateWorkout: updateWorkoutRecord,
    deleteWorkout,
    createPlan,
    updatePlan: updatePlanRecord,
    deletePlan,
  };
};