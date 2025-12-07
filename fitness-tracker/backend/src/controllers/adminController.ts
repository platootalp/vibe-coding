import { Request, Response } from 'express';
import User from '../models/User';
import Workout from '../models/Workout';
import WorkoutPlan from '../models/WorkoutPlan';
import NutritionLog from '../models/NutritionLog';
import { JwtPayload } from '../utils/jwt';

// Extend the Express Request type to include our user property
interface AuthRequest extends Request {
  user?: JwtPayload;
}

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getSystemStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get counts for various entities
    const userCount = await User.count();
    const workoutCount = await Workout.count();
    const workoutPlanCount = await WorkoutPlan.count();
    const nutritionLogCount = await NutritionLog.count();
    
    // Get recent user registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.count({
      where: {
        createdAt: {
          [require('sequelize').Op.gt]: thirtyDaysAgo
        }
      }
    });
    
    res.status(200).json({
      stats: {
        users: userCount,
        workouts: workoutCount,
        workoutPlans: workoutPlanCount,
        nutritionLogs: nutritionLogCount,
        recentRegistrations: recentUsers
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users (paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const { rows: users, count: total } = await User.findAndCountAll({
      attributes: { exclude: ['password'] }, // Don't include password hashes
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });
    
    res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }, // Don't include password
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    await user.save();
    
    // Return updated user (without password)
    const { password, ...userWithoutPassword } = user.toJSON();
    
    res.status(200).json({ 
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Delete user (will cascade to related records)
    await user.destroy();
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get audit logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
export const getAuditLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // For now, we'll return a placeholder response
    // In a real implementation, you would have an AuditLog model
    res.status(200).json({ 
      message: 'Audit logs functionality not yet implemented',
      logs: []
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};