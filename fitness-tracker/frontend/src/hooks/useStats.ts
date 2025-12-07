import { useState, useEffect } from 'react';
import { statsAPI } from '../services/api';

interface WorkoutStat {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  totalDistance: number;
  workoutsByType: Array<{
    type: string;
    count: number;
  }>;
}

interface WeeklyStat {
  date: string;
  duration: number;
  calories: number;
  workouts: number;
}

export const useStats = () => {
  const [workoutStats, setWorkoutStats] = useState<WorkoutStat | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutStats = async () => {
    try {
      setLoading(true);
      const response = await statsAPI.getWorkoutStats();
      setWorkoutStats(response.data as WorkoutStat);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch workout stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyStats = async () => {
    try {
      const response = await statsAPI.getWeeklyStats();
      setWeeklyStats(response.data as WeeklyStat[]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch weekly stats');
    }
  };

  useEffect(() => {
    Promise.all([fetchWorkoutStats(), fetchWeeklyStats()])
      .catch((err) => {
        setError('Failed to fetch stats data');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    workoutStats,
    weeklyStats,
    loading,
    error,
    refresh: () => {
      fetchWorkoutStats();
      fetchWeeklyStats();
    }
  };
};