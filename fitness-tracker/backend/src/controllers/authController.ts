import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Tenant from '../models/Tenant';

// Generate JWT token
const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, tenantId } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Get tenant (use default if not provided)
    let tenant;
    if (tenantId) {
      tenant = await Tenant.findByPk(tenantId);
    } else {
      tenant = await Tenant.findOne();
    }
    
    if (!tenant) {
      res.status(500).json({ message: 'No tenant found' });
      return;
    }

    // Create user
    const user = await User.create({
      tenantId: tenant.id,
      name,
      email,
      password,
      role: 'user' // Default role
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        tenantId: user.tenantId,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken({ 
          id: user.id, 
          tenantId: user.tenantId,
          email: user.email,
          role: user.role
        })
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (user && await user.matchPassword(password)) {
      res.json({
        id: user.id,
        tenantId: user.tenantId,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken({ 
          id: user.id, 
          tenantId: user.tenantId,
          email: user.email,
          role: user.role
        })
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};