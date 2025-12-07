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
    const { name, type, duration, calories, distance, steps, date, notes, 
            heartRate, avgSpeed, maxSpeed, elevationGain, gpsTrace } = req.body;
    
    const workout = await Workout.create({
      userId: req.user?.id,
      name,
      type,
      duration,
      calories,
      distance,
      steps,
      date,
      notes,
      heartRate,
      avgSpeed,
      maxSpeed,
      elevationGain,
      gpsTrace
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
    const { name, type, duration, calories, distance, steps, date, notes,
            heartRate, avgSpeed, maxSpeed, elevationGain, gpsTrace } = req.body;
    
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
    workout.heartRate = heartRate !== undefined ? heartRate : workout.heartRate;
    workout.avgSpeed = avgSpeed !== undefined ? avgSpeed : workout.avgSpeed;
    workout.maxSpeed = maxSpeed !== undefined ? maxSpeed : workout.maxSpeed;
    workout.elevationGain = elevationGain !== undefined ? elevationGain : workout.elevationGain;
    workout.gpsTrace = gpsTrace !== undefined ? gpsTrace : workout.gpsTrace;
    
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

// @desc    Import workouts from external sources (Apple Health, Huawei Health, etc.)
// @route   POST /api/workouts/import
// @access  Private
export const importWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workouts } = req.body;
    
    if (!Array.isArray(workouts)) {
      res.status(400).json({ message: 'Workouts must be an array' });
      return;
    }
    
    // Validate and transform imported workouts
    const validWorkouts = workouts.map(workout => ({
      userId: req.user?.id,
      name: workout.name || 'Imported Workout',
      type: workout.type || 'other',
      duration: workout.duration || 0,
      calories: workout.calories || 0,
      distance: workout.distance,
      steps: workout.steps,
      date: workout.date || new Date(),
      notes: workout.notes,
      heartRate: workout.heartRate,
      avgSpeed: workout.avgSpeed,
      maxSpeed: workout.maxSpeed,
      elevationGain: workout.elevationGain,
      gpsTrace: workout.gpsTrace
    }));
    
    // Bulk create workouts
    const createdWorkouts = await Workout.bulkCreate(validWorkouts);
    
    res.status(201).json({
      message: `Successfully imported ${createdWorkouts.length} workouts`,
      workouts: createdWorkouts
    });
  } catch (error) {
    console.error('Error importing workouts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};