import { Request, Response } from 'express';
import WorkoutPlan from '../models/WorkoutPlan';
import WorkoutType from '../models/WorkoutType';
import { Op } from 'sequelize';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all workout plans for the logged-in user
// @route   GET /api/workout-plans
// @access  Private
export const getWorkoutPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { activeOnly = 'true' } = req.query;
    
    // Build where clause
    const whereClause: any = { userId };
    if (activeOnly === 'true') {
      whereClause.isActive = true;
    }
    
    const workoutPlans = await WorkoutPlan.findAll({
      where: whereClause,
      include: [{
        model: WorkoutType,
        as: 'workoutType',
        attributes: ['id', 'name', 'description', 'iconUrl', 'metValue']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(workoutPlans);
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a specific workout plan
// @route   GET /api/workout-plans/:id
// @access  Private
export const getWorkoutPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const workoutPlan = await WorkoutPlan.findOne({
      where: {
        id,
        userId
      },
      include: [{
        model: WorkoutType,
        as: 'workoutType',
        attributes: ['id', 'name', 'description', 'iconUrl', 'metValue']
      }]
    });
    
    if (!workoutPlan) {
      res.status(404).json({ message: 'Workout plan not found' });
      return;
    }
    
    res.json(workoutPlan);
  } catch (error) {
    console.error('Error fetching workout plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new workout plan
// @route   POST /api/workout-plans
// @access  Private
export const createWorkoutPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const {
      workoutTypeId,
      name,
      description,
      goal,
      durationWeeks,
      planDetails,
      startDate,
      endDate
    } = req.body;
    
    // Validate required fields
    if (!name || !durationWeeks || !startDate || !endDate) {
      res.status(400).json({ message: 'Name, durationWeeks, startDate, and endDate are required' });
      return;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      res.status(400).json({ message: 'End date must be after start date' });
      return;
    }
    
    // Validate duration weeks
    if (durationWeeks < 1 || durationWeeks > 52) {
      res.status(400).json({ message: 'Duration must be between 1 and 52 weeks' });
      return;
    }
    
    // Validate workout type if provided
    if (workoutTypeId) {
      const workoutType = await WorkoutType.findByPk(workoutTypeId);
      if (!workoutType) {
        res.status(400).json({ message: 'Invalid workout type' });
        return;
      }
    }
    
    // Create workout plan
    const workoutPlan = await WorkoutPlan.create({
      userId,
      workoutTypeId: workoutTypeId || null,
      name,
      description: description || '',
      goal: goal || '',
      durationWeeks,
      planDetails: planDetails || {},
      startDate,
      endDate,
      isActive: true
    });
    
    // Fetch the created plan with workout type
    const populatedPlan = await WorkoutPlan.findByPk(workoutPlan.id, {
      include: [{
        model: WorkoutType,
        as: 'workoutType',
        attributes: ['id', 'name', 'description', 'iconUrl', 'metValue']
      }]
    });
    
    res.status(201).json(populatedPlan);
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a workout plan
// @route   PUT /api/workout-plans/:id
// @access  Private
export const updateWorkoutPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const {
      workoutTypeId,
      name,
      description,
      goal,
      durationWeeks,
      planDetails,
      startDate,
      endDate,
      isActive
    } = req.body;
    
    // Find the workout plan
    const workoutPlan = await WorkoutPlan.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!workoutPlan) {
      res.status(404).json({ message: 'Workout plan not found' });
      return;
    }
    
    // Validate dates if provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) {
        res.status(400).json({ message: 'End date must be after start date' });
        return;
      }
    }
    
    // Validate duration weeks if provided
    if (durationWeeks !== undefined && (durationWeeks < 1 || durationWeeks > 52)) {
      res.status(400).json({ message: 'Duration must be between 1 and 52 weeks' });
      return;
    }
    
    // Validate workout type if provided
    if (workoutTypeId) {
      const workoutType = await WorkoutType.findByPk(workoutTypeId);
      if (!workoutType) {
        res.status(400).json({ message: 'Invalid workout type' });
        return;
      }
    }
    
    // Update workout plan
    workoutPlan.workoutTypeId = workoutTypeId || workoutPlan.workoutTypeId;
    workoutPlan.name = name || workoutPlan.name;
    workoutPlan.description = description !== undefined ? description : workoutPlan.description;
    workoutPlan.goal = goal !== undefined ? goal : workoutPlan.goal;
    workoutPlan.durationWeeks = durationWeeks || workoutPlan.durationWeeks;
    workoutPlan.planDetails = planDetails || workoutPlan.planDetails;
    workoutPlan.startDate = startDate || workoutPlan.startDate;
    workoutPlan.endDate = endDate || workoutPlan.endDate;
    workoutPlan.isActive = isActive !== undefined ? isActive : workoutPlan.isActive;
    
    await workoutPlan.save();
    
    // Fetch the updated plan with workout type
    const populatedPlan = await WorkoutPlan.findByPk(workoutPlan.id, {
      include: [{
        model: WorkoutType,
        as: 'workoutType',
        attributes: ['id', 'name', 'description', 'iconUrl', 'metValue']
      }]
    });
    
    res.json(populatedPlan);
  } catch (error) {
    console.error('Error updating workout plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a workout plan
// @route   DELETE /api/workout-plans/:id
// @access  Private
export const deleteWorkoutPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    // Find the workout plan
    const workoutPlan = await WorkoutPlan.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!workoutPlan) {
      res.status(404).json({ message: 'Workout plan not found' });
      return;
    }
    
    // Delete the workout plan
    await workoutPlan.destroy();
    
    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all workout types
// @route   GET /api/workout-plans/types
// @access  Public
export const getWorkoutTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const workoutTypes = await WorkoutType.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json(workoutTypes);
  } catch (error) {
    console.error('Error fetching workout types:', error);
    res.status(500).json({ message: 'Server error' });
  }
};