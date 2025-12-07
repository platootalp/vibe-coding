import { Request, Response } from 'express';
import Workout from '../models/Workout';
import User from '../models/User';
import { Op } from 'sequelize';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get workout statistics
// @route   GET /api/stats/workouts
// @access  Private
export const getWorkoutStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Get total workouts count
    const totalWorkouts = await Workout.count({ where: { userId } });
    
    // Get total duration
    const durationResult = await Workout.sum('duration', { where: { userId } });
    const totalDuration = durationResult || 0;
    
    // Get total calories burned
    const caloriesResult = await Workout.sum('calories', { where: { userId } });
    const totalCalories = caloriesResult || 0;
    
    // Get total distance
    const distanceResult = await Workout.sum('distance', { 
      where: { 
        userId
      } 
    });
    const totalDistance = distanceResult || 0;
    
    // Get workouts by type
    const workoutsByType = await Workout.findAll({
      where: { userId },
      attributes: [
        'type',
        [Workout.sequelize!.fn('COUNT', Workout.sequelize!.col('type')), 'count']
      ],
      group: ['type']
    });
    
    res.json({
      totalWorkouts,
      totalDuration,
      totalCalories,
      totalDistance,
      workoutsByType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get weekly workout data
// @route   GET /api/stats/weekly
// @access  Private
export const getWeeklyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Calculate date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Get workouts from last 7 days
    const weeklyWorkouts = await Workout.findAll({
      where: {
        userId,
        date: { [Op.gte]: oneWeekAgo }
      },
      order: [['date', 'ASC']]
    });
    
    // Group by date
    const dailyStats: { [key: string]: { duration: number; calories: number; workouts: number } } = {};
    
    weeklyWorkouts.forEach((workout: any) => {
      const dateStr = workout.date.toISOString().split('T')[0];
      
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = {
          duration: 0,
          calories: 0,
          workouts: 0
        };
      }
      
      dailyStats[dateStr].duration += workout.duration;
      dailyStats[dateStr].calories += workout.calories;
      dailyStats[dateStr].workouts += 1;
    });
    
    // Fill in missing dates
    const dates = [];
    const stats = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      dates.push(dateStr);
      stats.push({
        date: dateStr,
        duration: dailyStats[dateStr]?.duration || 0,
        calories: dailyStats[dateStr]?.calories || 0,
        workouts: dailyStats[dateStr]?.workouts || 0
      });
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};