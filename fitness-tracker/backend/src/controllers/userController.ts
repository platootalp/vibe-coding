import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // req.user is set in auth middleware
    const user = await User.findByPk(req.user?.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user?.id);
    
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.age = req.body.age || user.age;
      user.height = req.body.height || user.height;
      user.weight = req.body.weight || user.weight;
      user.gender = req.body.gender || user.gender;
      
      const updatedUser = await user.save();
      
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        age: updatedUser.age,
        height: updatedUser.height,
        weight: updatedUser.weight,
        gender: updatedUser.gender
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};