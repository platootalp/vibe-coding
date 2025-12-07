import { Request, Response } from 'express';
import { Op } from 'sequelize';
import NutritionLog from '../models/NutritionLog';
import Food from '../models/Food';
import Meal from '../models/Meal';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all nutrition logs for the logged-in user
// @route   GET /api/nutrition/logs
// @access  Private
export const getNutritionLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { date, mealId } = req.query;
    
    // Build where clause
    const whereClause: any = { userId };
    
    // Filter by date if provided
    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereClause.consumedAt = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }
    
    // Filter by mealId if provided
    if (mealId) {
      whereClause.mealId = mealId;
    }
    
    const nutritionLogs = await NutritionLog.findAll({
      where: whereClause,
      include: [
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'name', 'brand', 'calories', 'proteinG', 'carbsG', 'fatG', 'servingSize', 'servingUnit']
        },
        {
          model: Meal,
          as: 'meal',
          attributes: ['id', 'name', 'description']
        }
      ],
      order: [['consumedAt', 'DESC']]
    });
    
    res.json(nutritionLogs);
  } catch (error) {
    console.error('Error fetching nutrition logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a specific nutrition log
// @route   GET /api/nutrition/logs/:id
// @access  Private
export const getNutritionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    const nutritionLog = await NutritionLog.findOne({
      where: {
        id,
        userId
      },
      include: [
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'name', 'brand', 'calories', 'proteinG', 'carbsG', 'fatG', 'servingSize', 'servingUnit']
        },
        {
          model: Meal,
          as: 'meal',
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    if (!nutritionLog) {
      res.status(404).json({ message: 'Nutrition log not found' });
      return;
    }
    
    res.json(nutritionLog);
  } catch (error) {
    console.error('Error fetching nutrition log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new nutrition log
// @route   POST /api/nutrition/logs
// @access  Private
export const createNutritionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { foodId, mealId, quantity, consumedAt } = req.body;
    
    // Validate required fields
    if (!foodId || !mealId) {
      res.status(400).json({ message: 'Food and meal are required' });
      return;
    }
    
    // Validate food exists
    const food = await Food.findByPk(foodId);
    if (!food) {
      res.status(400).json({ message: 'Invalid food' });
      return;
    }
    
    // Validate meal exists
    const meal = await Meal.findByPk(mealId);
    if (!meal) {
      res.status(400).json({ message: 'Invalid meal' });
      return;
    }
    
    // Validate quantity
    if (quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be greater than 0' });
      return;
    }
    
    // Create nutrition log
    const nutritionLog = await NutritionLog.create({
      userId,
      foodId,
      mealId,
      quantity: quantity || 1,
      consumedAt: consumedAt || new Date()
    });
    
    // Fetch the created log with associations
    const populatedLog = await NutritionLog.findByPk(nutritionLog.id, {
      include: [
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'name', 'brand', 'calories', 'proteinG', 'carbsG', 'fatG', 'servingSize', 'servingUnit']
        },
        {
          model: Meal,
          as: 'meal',
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    res.status(201).json(populatedLog);
  } catch (error) {
    console.error('Error creating nutrition log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a nutrition log
// @route   PUT /api/nutrition/logs/:id
// @access  Private
export const updateNutritionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { foodId, mealId, quantity, consumedAt } = req.body;
    
    // Find the nutrition log
    const nutritionLog = await NutritionLog.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!nutritionLog) {
      res.status(404).json({ message: 'Nutrition log not found' });
      return;
    }
    
    // Validate food if provided
    if (foodId) {
      const food = await Food.findByPk(foodId);
      if (!food) {
        res.status(400).json({ message: 'Invalid food' });
        return;
      }
    }
    
    // Validate meal if provided
    if (mealId) {
      const meal = await Meal.findByPk(mealId);
      if (!meal) {
        res.status(400).json({ message: 'Invalid meal' });
        return;
      }
    }
    
    // Validate quantity if provided
    if (quantity !== undefined && quantity <= 0) {
      res.status(400).json({ message: 'Quantity must be greater than 0' });
      return;
    }
    
    // Update nutrition log
    nutritionLog.foodId = foodId || nutritionLog.foodId;
    nutritionLog.mealId = mealId || nutritionLog.mealId;
    nutritionLog.quantity = quantity !== undefined ? quantity : nutritionLog.quantity;
    nutritionLog.consumedAt = consumedAt || nutritionLog.consumedAt;
    
    await nutritionLog.save();
    
    // Fetch the updated log with associations
    const populatedLog = await NutritionLog.findByPk(nutritionLog.id, {
      include: [
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'name', 'brand', 'calories', 'proteinG', 'carbsG', 'fatG', 'servingSize', 'servingUnit']
        },
        {
          model: Meal,
          as: 'meal',
          attributes: ['id', 'name', 'description']
        }
      ]
    });
    
    res.json(populatedLog);
  } catch (error) {
    console.error('Error updating nutrition log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a nutrition log
// @route   DELETE /api/nutrition/logs/:id
// @access  Private
export const deleteNutritionLog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    
    // Find the nutrition log
    const nutritionLog = await NutritionLog.findOne({
      where: {
        id,
        userId
      }
    });
    
    if (!nutritionLog) {
      res.status(404).json({ message: 'Nutrition log not found' });
      return;
    }
    
    // Delete the nutrition log
    await nutritionLog.destroy();
    
    res.json({ message: 'Nutrition log deleted successfully' });
  } catch (error) {
    console.error('Error deleting nutrition log:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all foods
// @route   GET /api/nutrition/foods
// @access  Public
export const getFoods = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search } = req.query;
    
    // Build where clause for search
    const whereClause: any = {};
    if (search) {
      whereClause.name = {
        [Op.like]: `%${search}%`
      };
    }
    
    const foods = await Food.findAll({
      where: whereClause,
      order: [['name', 'ASC']]
    });
    
    res.json(foods);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all meals
// @route   GET /api/nutrition/meals
// @access  Public
export const getMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const meals = await Meal.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json(meals);
  } catch (error) {
    console.error('Error fetching meals:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get nutrition summary for a specific date
// @route   GET /api/nutrition/summary
// @access  Private
export const getNutritionSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { date } = req.query;
    
    // Set date range
    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Get all nutrition logs for the day with associations
    const nutritionLogs = await NutritionLog.findAll({
      where: {
        userId,
        consumedAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      include: [
        {
          model: Food,
          as: 'food',
          attributes: ['id', 'name', 'calories', 'proteinG', 'carbsG', 'fatG', 'servingSize', 'servingUnit']
        },
        {
          model: Meal,
          as: 'meal',
          attributes: ['id', 'name']
        }
      ],
      order: [['consumedAt', 'ASC']]
    });
    
    // Calculate totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    // Group by meal
    const meals: any = {};
    
    for (const log of nutritionLogs) {
      // Get associated food and meal
      const food = log.get('food') as Food;
      const meal = log.get('meal') as Meal;
      
      // Calculate nutrition values based on quantity
      const calories = (food.calories * log.quantity * food.servingSize) / 100;
      const protein = (food.proteinG * log.quantity * food.servingSize) / 100;
      const carbs = (food.carbsG * log.quantity * food.servingSize) / 100;
      const fat = (food.fatG * log.quantity * food.servingSize) / 100;
      
      // Add to totals
      totalCalories += calories;
      totalProtein += protein;
      totalCarbs += carbs;
      totalFat += fat;
      
      // Group by meal
      if (!meals[meal.name]) {
        meals[meal.name] = {
          meal: meal.name,
          logs: [],
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0
        };
      }
      
      meals[meal.name].logs.push({
        id: log.id,
        food: food.name,
        quantity: log.quantity,
        servingSize: food.servingSize,
        servingUnit: food.servingUnit,
        calories,
        protein,
        carbs,
        fat,
        consumedAt: log.consumedAt
      });
      
      meals[meal.name].calories += calories;
      meals[meal.name].protein += protein;
      meals[meal.name].carbs += carbs;
      meals[meal.name].fat += fat;
    }
    
    res.json({
      date: targetDate.toISOString().split('T')[0],
      totals: {
        calories: parseFloat(totalCalories.toFixed(2)),
        protein: parseFloat(totalProtein.toFixed(2)),
        carbs: parseFloat(totalCarbs.toFixed(2)),
        fat: parseFloat(totalFat.toFixed(2))
      },
      meals
    });
  } catch (error) {
    console.error('Error fetching nutrition summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};