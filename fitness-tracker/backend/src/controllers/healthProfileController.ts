import { Request, Response } from 'express';
import UserProfile from '../models/UserProfile';
import UserMetricsHistory from '../models/UserMetricsHistory';
import { Op } from 'sequelize';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get user health profile
// @route   GET /api/health/profile
// @access  Private
export const getHealthProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    // Get user profile
    let profile = await UserProfile.findOne({ where: { userId } });
    
    // If profile doesn't exist, create a new one
    if (!profile) {
      profile = await UserProfile.create({ userId });
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching health profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user health profile
// @route   PUT /api/health/profile
// @access  Private
export const updateHealthProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { height, weight, age, gender, avatarUrl, bio } = req.body;
    
    // Find or create user profile
    let [profile, created] = await UserProfile.findOrCreate({
      where: { userId },
      defaults: { userId, height, weight, age, gender, avatarUrl, bio }
    });
    
    // If profile exists, update it
    if (!created) {
      profile.height = height || profile.height;
      profile.weight = weight || profile.weight;
      profile.age = age || profile.age;
      profile.gender = gender || profile.gender;
      profile.avatarUrl = avatarUrl || profile.avatarUrl;
      profile.bio = bio || profile.bio;
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    console.error('Error updating health profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user metrics history
// @route   GET /api/health/metrics-history
// @access  Private
export const getMetricsHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { period = 'month' } = req.query; // 'week', 'month', 'quarter', 'year'
    
    // Calculate date range based on period
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case 'week':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 1);
    }
    
    // Get metrics history within date range
    const metricsHistory = await UserMetricsHistory.findAll({
      where: {
        userId,
        recordedDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['recordedDate', 'ASC']]
    });
    
    res.json(metricsHistory);
  } catch (error) {
    console.error('Error fetching metrics history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add user metrics record
// @route   POST /api/health/metrics
// @access  Private
export const addMetricsRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { weight, recordedDate } = req.body;
    
    // Validate required fields
    if (!weight || !recordedDate) {
      res.status(400).json({ message: 'Weight and recordedDate are required' });
      return;
    }
    
    // Check if a record already exists for this date
    const existingRecord = await UserMetricsHistory.findOne({
      where: {
        userId,
        recordedDate
      }
    });
    
    if (existingRecord) {
      res.status(400).json({ message: 'A record already exists for this date' });
      return;
    }
    
    // Calculate BMI, body fat percentage, and BMR based on user profile
    const profile = await UserProfile.findOne({ where: { userId } });
    const metrics = calculateHealthMetrics(weight, profile?.height, profile?.age, profile?.gender);
    
    // Create new metrics record
    const newRecord = await UserMetricsHistory.create({
      userId,
      weight,
      recordedDate,
      ...metrics
    });
    
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error adding metrics record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user metrics record
// @route   PUT /api/health/metrics/:id
// @access  Private
export const updateMetricsRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { weight, recordedDate } = req.body;
    
    // Find the metrics record
    const record = await UserMetricsHistory.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!record) {
      res.status(404).json({ message: 'Metrics record not found' });
      return;
    }
    
    // Update weight and recordedDate if provided
    if (weight !== undefined) record.weight = weight;
    if (recordedDate) record.recordedDate = recordedDate;
    
    // Recalculate metrics based on updated weight
    const profile = await UserProfile.findOne({ where: { userId } });
    const metrics = calculateHealthMetrics(record.weight!, profile?.height, profile?.age, profile?.gender);
    
    record.bmi = metrics.bmi;
    record.bodyFatPercentage = metrics.bodyFatPercentage;
    record.bmr = metrics.bmr;
    
    await record.save();
    
    res.json(record);
  } catch (error) {
    console.error('Error updating metrics record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user metrics record
// @route   DELETE /api/health/metrics/:id
// @access  Private
export const deleteMetricsRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    // Find the metrics record
    const record = await UserMetricsHistory.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!record) {
      res.status(404).json({ message: 'Metrics record not found' });
      return;
    }
    
    // Delete the record
    await record.destroy();
    
    res.json({ message: 'Metrics record deleted successfully' });
  } catch (error) {
    console.error('Error deleting metrics record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate health metrics
const calculateHealthMetrics = (
  weight: number, 
  height?: number, 
  age?: number, 
  gender?: string
): { bmi?: number; bodyFatPercentage?: number; bmr?: number } => {
  const metrics: { bmi?: number; bodyFatPercentage?: number; bmr?: number } = {};
  
  // Calculate BMI (Body Mass Index)
  // BMI = weight (kg) / [height (m)]^2
  if (weight && height) {
    const heightInMeters = height / 100;
    metrics.bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(2));
  }
  
  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  // For men: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) + 5
  // For women: BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age(y) - 161
  if (weight && height && age && gender) {
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      // For other genders, use an average formula
      bmr = 10 * weight + 6.25 * height - 5 * age - 78;
    }
    metrics.bmr = Math.round(bmr);
  }
  
  // Estimate body fat percentage using BMI
  // This is a simplified estimation and not as accurate as professional measurements
  if (metrics.bmi && age && gender) {
    let bodyFatPercentage;
    if (gender === 'male') {
      bodyFatPercentage = 1.20 * metrics.bmi + 0.23 * age - 16.2;
    } else if (gender === 'female') {
      bodyFatPercentage = 1.20 * metrics.bmi + 0.23 * age - 5.4;
    } else {
      // For other genders, use an average formula
      bodyFatPercentage = 1.20 * metrics.bmi + 0.23 * age - 10.8;
    }
    // Ensure body fat percentage is within reasonable bounds
    bodyFatPercentage = Math.max(0, Math.min(60, bodyFatPercentage));
    metrics.bodyFatPercentage = parseFloat(bodyFatPercentage.toFixed(2));
  }
  
  return metrics;
};