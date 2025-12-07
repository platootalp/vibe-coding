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

// @desc    OAuth2 Google login
// @route   POST /api/auth/oauth/google
// @access  Public
export const googleOAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { googleId, email, name, accessToken } = req.body;

    // Check if user exists with Google OAuth
    let user = await User.findOne({ where: { oauthProvider: 'google', oauthId: googleId } });
    
    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ where: { email } });
      
      if (user) {
        // Link existing user with Google account
        user.oauthProvider = 'google';
        user.oauthId = googleId;
        await user.save();
      } else {
        // Create new user with Google OAuth
        // Default to a default tenant for now
        const defaultTenant = await Tenant.findOne();
        if (!defaultTenant) {
          res.status(500).json({ message: 'No tenant found' });
          return;
        }
        
        user = await User.create({
          tenantId: defaultTenant.id,
          name,
          email,
          password: '', // No password for OAuth users
          oauthProvider: 'google',
          oauthId: googleId,
          role: 'user'
        });
      }
    }

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
    console.error('Google OAuth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    OAuth2 Apple login
// @route   POST /api/auth/oauth/apple
// @access  Public
export const appleOAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appleId, email, name, accessToken } = req.body;

    // Check if user exists with Apple OAuth
    let user = await User.findOne({ where: { oauthProvider: 'apple', oauthId: appleId } });
    
    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ where: { email } });
      
      if (user) {
        // Link existing user with Apple account
        user.oauthProvider = 'apple';
        user.oauthId = appleId;
        await user.save();
      } else {
        // Create new user with Apple OAuth
        // Default to a default tenant for now
        const defaultTenant = await Tenant.findOne();
        if (!defaultTenant) {
          res.status(500).json({ message: 'No tenant found' });
          return;
        }
        
        user = await User.create({
          tenantId: defaultTenant.id,
          name,
          email,
          password: '', // No password for OAuth users
          oauthProvider: 'apple',
          oauthId: appleId,
          role: 'user'
        });
      }
    }

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
    console.error('Apple OAuth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    OAuth2 WeChat login
// @route   POST /api/auth/oauth/wechat
// @access  Public
export const wechatOAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { wechatId, email, name, accessToken } = req.body;

    // Check if user exists with WeChat OAuth
    let user = await User.findOne({ where: { oauthProvider: 'wechat', oauthId: wechatId } });
    
    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ where: { email } });
      
      if (user) {
        // Link existing user with WeChat account
        user.oauthProvider = 'wechat';
        user.oauthId = wechatId;
        await user.save();
      } else {
        // Create new user with WeChat OAuth
        // Default to a default tenant for now
        const defaultTenant = await Tenant.findOne();
        if (!defaultTenant) {
          res.status(500).json({ message: 'No tenant found' });
          return;
        }
        
        user = await User.create({
          tenantId: defaultTenant.id,
          name,
          email,
          password: '', // No password for OAuth users
          oauthProvider: 'wechat',
          oauthId: wechatId,
          role: 'user'
        });
      }
    }

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
    console.error('WeChat OAuth error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};