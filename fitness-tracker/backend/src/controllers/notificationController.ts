import { Request, Response } from 'express';
import Notification from '../models/Notification';
import { JwtPayload } from '../utils/jwt';

// Extend the Express Request type to include our user property
interface AuthRequest extends Request {
  user?: JwtPayload;
}

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const { rows: notifications, count: total } = await Notification.findAndCountAll({
      where: { userId: req.user!.userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    res.status(200).json({
      notifications,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOne({
      where: { id, userId: req.user!.userId },
    });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user!.userId, isRead: false } }
    );

    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOne({
      where: { id, userId: req.user!.userId },
    });

    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }

    await notification.destroy();

    res.status(200).json({ message: 'Notification removed' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await Notification.count({
      where: { userId: req.user!.userId, isRead: false },
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};