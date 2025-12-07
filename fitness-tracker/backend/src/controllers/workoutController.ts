import { Request, Response } from 'express';
import Workout from '../models/Workout';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all workouts for logged in user
// @route   GET /api/workouts
// @access  Private
export const getWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workouts = await Workout.findAll({
      where: { userId: req.user?.id },
      order: [['date', 'DESC']]
    });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get workout by ID
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    
    // Check if workout belongs to logged in user
    if (workout.userId !== req.user?.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new workout
// @route   POST /api/workouts
// @access  Private
export const createWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type, duration, calories, distance, steps, date, notes } = req.body;
    
    const workout = await Workout.create({
      userId: req.user?.id,
      name,
      type,
      duration,
      calories,
      distance,
      steps,
      date,
      notes
    });
    
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type, duration, calories, distance, steps, date, notes } = req.body;
    
    const workout = await Workout.findByPk(req.params.id);
    
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    
    // Check if workout belongs to logged in user
    if (workout.userId !== req.user?.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    workout.name = name || workout.name;
    workout.type = type || workout.type;
    workout.duration = duration || workout.duration;
    workout.calories = calories || workout.calories;
    workout.distance = distance !== undefined ? distance : workout.distance;
    workout.steps = steps !== undefined ? steps : workout.steps;
    workout.date = date || workout.date;
    workout.notes = notes || workout.notes;
    
    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    
    // Check if workout belongs to logged in user
    if (workout.userId !== req.user?.id) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    await workout.destroy();
    res.json({ message: 'Workout removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};