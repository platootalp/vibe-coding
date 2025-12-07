import express from 'express';
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification, 
  getUnreadCount 
} from '../controllers/notificationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

// Get user notifications
router.route('/')
  .get(getNotifications);

// Mark notification as read
router.route('/:id/read')
  .put(markAsRead);

// Mark all notifications as read
router.route('/read-all')
  .put(markAllAsRead);

// Delete notification
router.route('/:id')
  .delete(deleteNotification);

// Get unread notifications count
router.route('/unread-count')
  .get(getUnreadCount);

export default router;